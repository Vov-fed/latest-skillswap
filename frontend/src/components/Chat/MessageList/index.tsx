import React, { useRef, useEffect, useState } from "react";
import styles from "./index.module.scss";
import { Message } from "../Message";
import { ReactionPicker } from "../Reaction";

type Reaction = {
  users: { _id: string; name: string; profilePicture: string }[];
  emoji: string;
};
type Message = {
  _id: string;
  text: string;
  sender: string | { _id: string; name: string; profilePicture: string };
  reactions: Reaction[];
  createdAt: string;
  animatedReaction?: {
    emoji: string;
    users: { _id: string; name: string; profilePicture: string }[];
  };
};
type Props = {
  messages: Message[];
  userId: string;
  onReact: (msgId: string, emoji: string) => void;
  activeMsgId: string | null;
  setActiveMsgId: (msgId: string | null) => void;
  animatedReaction?: { messageId: string; emoji: string } | null;
  fullWidth?: boolean;
};

export const MessageList: React.FC<Props> = ({ messages, userId, onReact, activeMsgId, setActiveMsgId, animatedReaction, fullWidth }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const prevMessageCount = useRef(messages.length);
  const [pickerOpenFor, setPickerOpenFor] = useState("");

  useEffect(() => {
    const messageRows = document.querySelectorAll("." + styles.messageRow);
    const timers = new Map<Element, number>();
    const startPositions = new Map<Element, { x: number; y: number }>();

    const handleTouchStart = (e: TouchEvent) => {
      const target = e.currentTarget as HTMLElement;
      const msgId = target?.dataset?.msgid;
      if (!msgId) return;

      const touch = e.touches[0];
      startPositions.set(target, { x: touch.clientX, y: touch.clientY });

      const timeout = window.setTimeout(() => {
        setPickerOpenFor((prev) => (prev === msgId ? "" : msgId));
        timers.delete(target);
      }, 500);

      timers.set(target, timeout);
    };

    const cancelTimer = (e: TouchEvent) => {
      const target = e.currentTarget as HTMLElement;
      const start = startPositions.get(target);
      const touch = e.changedTouches[0];
      const moveX = Math.abs(touch.clientX - (start?.x || 0));
      const moveY = Math.abs(touch.clientY - (start?.y || 0));

      // Cancel if finger moved too much (considered swipe)
      if (moveX > 10 || moveY > 10) {
        clearTimeout(timers.get(target));
        timers.delete(target);
      }

      if (timers.has(target)) {
        clearTimeout(timers.get(target));
        timers.delete(target);
      }

      startPositions.delete(target);
    };

    messageRows.forEach((row) => {
      row.addEventListener("touchstart", handleTouchStart as EventListener, { passive: true });
      row.addEventListener("touchend", cancelTimer as EventListener);
      row.addEventListener("touchmove", cancelTimer as EventListener);
      row.addEventListener("touchcancel", cancelTimer as EventListener);
    });

    return () => {
      messageRows.forEach((row) => {
        row.removeEventListener("touchstart", handleTouchStart as EventListener);
        row.removeEventListener("touchend", cancelTimer as EventListener);
        row.removeEventListener("touchmove", cancelTimer as EventListener);
        row.removeEventListener("touchcancel", cancelTimer as EventListener);
      });
    };
  }, [messages]);

  useEffect(() => {
  const el = scrollRef.current;
  if (!el) return;
  if (messages.length < prevMessageCount.current) {
    prevMessageCount.current = messages.length;
    return;
  }
    el.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
}, [messages.length]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const picker = document.querySelector("[data-reaction-picker]");
      if (picker && !picker.contains(e.target as Node)) {
        setPickerOpenFor("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setPickerOpenFor("");
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div className={styles.chatMessages + " " + (fullWidth ? styles.fullWidth : '')} ref={scrollRef}>
      {messages.map((msg) => {
        // const isLast = index === messages.length - 1;
        const reactionMap: { [emoji: string]: Reaction[] } = {};
        msg.reactions.forEach((r) => {
          if (!reactionMap[r.emoji]) reactionMap[r.emoji] = [];
          reactionMap[r.emoji].push(r);
        });
        return (
          <div
            key={msg._id}
            data-msgid={msg._id}
            className={`${styles.messageRow} ${ msg.sender === userId || (typeof msg.sender === "object" && msg.sender._id === userId) ? styles.mine : "" }`}
            onMouseLeave={() => setActiveMsgId(null)}
            onContextMenu={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setPickerOpenFor((prev) => (prev === msg._id ? "" : msg._id));
            }}
          >
            <Message msg={msg} userId={userId} onReact={onReact} animatedReaction={animatedReaction} />
            {
              pickerOpenFor === msg._id && (
                <ReactionPicker msg={msg} fullWidth={fullWidth} userId={userId} onReact={onReact} activeMsgId={activeMsgId} setActiveMsgId={setActiveMsgId} reactionMap={reactionMap} mine={typeof msg.sender === "object" && msg.sender._id === userId} pickerClose={() => setPickerOpenFor("")} />
              )
            }
          </div>
        );
      })}
    </div>
  );
};

export default MessageList;