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
};
export const MessageList: React.FC<Props> = ({ messages, userId, onReact, activeMsgId, setActiveMsgId, animatedReaction, }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const prevMessageCount = useRef(messages.length);
  const [pickerOpenFor, setPickerOpenFor] = useState("");

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
    <div className={styles.chatMessages} ref={scrollRef}>
      {messages.map((msg) => {
        const reactionMap: { [emoji: string]: Reaction[] } = {};
        msg.reactions.forEach((r) => {
          if (!reactionMap[r.emoji]) reactionMap[r.emoji] = [];
          reactionMap[r.emoji].push(r);
        });
        return (
          <div
            key={msg._id}
            className={`${styles.messageRow} ${ msg.sender === userId || (typeof msg.sender === "object" && msg.sender._id === userId) ? styles.mine : "" }`}
            onMouseLeave={() => setActiveMsgId(null)}
            onContextMenu={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setPickerOpenFor((prev) => (prev === msg._id ? "" : msg._id));
            }}>
            <Message msg={msg} userId={userId} onReact={onReact} animatedReaction={animatedReaction} />
            {
              pickerOpenFor === msg._id && (
                <ReactionPicker msg={msg} userId={userId} onReact={onReact} activeMsgId={activeMsgId} setActiveMsgId={setActiveMsgId} reactionMap={reactionMap}/>
              )
            }
          </div>
        );
      })}
    </div>
  );
};

export default MessageList;