import React, { useState } from "react";
import styles from "./index.module.scss";
import { useChatMessages } from "../../../services/useChatMessages";
import { MessageList } from "../MessageList";
import { ChatInput } from "../ChatInput";

type Props = {
  chat: {
    _id: string;
  };
  onBack?: () => void;
  onClose?: () => void;
  fullWidth?: boolean;
};
const ChatWindow: React.FC<Props> = ({ chat, onBack, onClose, fullWidth}) => {
  const [input, setInput] = useState("");
  const [activeMsgId, setActiveMsgId] = useState<string | null>(null);
  const { messages, loading, sending, sendMessage, reactToMessage, userId, animatedReaction } = useChatMessages(chat._id);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    sendMessage(input);
    setInput("");
  };

  return (
    <div className={`${styles.chatWindowContainer} ${fullWidth ? styles.fullWidth : ""}`}>
      {loading ? (
        <div>Loading messages...</div>
      ) : (
        <div className={styles.wrapper}>
          <MessageList messages={messages} userId={userId ?? ""} onReact={reactToMessage} activeMsgId={activeMsgId} setActiveMsgId={setActiveMsgId} animatedReaction={animatedReaction} />
          <ChatInput value={input} onChange={e => setInput(e.target.value)} onSend={handleSend} sending={sending} fullWidth={fullWidth}/>
        </div>
      )}
    </div>
  );
};
export default ChatWindow;