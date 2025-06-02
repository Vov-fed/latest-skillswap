import React, { useEffect, useState } from "react";
import { getChats } from "../../../services/chatAndMessageApi";
import ChatWindow from "../ChatWindow";
import styles from "./index.module.scss";
import { useNavigate } from "react-router-dom";
import { getUserIdByToken } from "../../../services/userApi";
interface ChatPanelProps {
  open: boolean;
  onClose?: () => void;
  fullWidth: boolean;
  chatOpened?: string;
}

const ChatPanel: React.FC<ChatPanelProps> = ({ open, onClose, fullWidth, chatOpened }) => {
  const userId = getUserIdByToken();
  const [chats, setChats] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedChat, setSelectedChat] = useState<any>(null);
  const navigate = useNavigate();

  const goToChat = (chatId:string) => {
    navigate(`/chats/${chatId}`);
  };
  useEffect(() => {
    if (open) {
      setSelectedChat(null);
      setLoading(true);
      getChats()
      .then(setChats)
      .finally(() => setLoading(false));
    }
  }, [open]);
  useEffect(() => {
    if (chatOpened) {
      setSelectedChat(chats.find(chat => chat._id === chatOpened) || null);
    } else {
      setSelectedChat(null);
    }
  }, [chatOpened, chats]);

  if (!open) return null;

  return (
  <>
      <div className={`${styles.chatPanelContainer} ${fullWidth ? styles.fullWidth : ""}`}>
      <div className={styles.chatPanelHeader}>
        {!selectedChat || fullWidth ? (
          <>
            <span className={styles.chatPanelTitle}>Chats</span>
            {!fullWidth && <button onClick={onClose} className={styles.chatPanelCloseButton}>×</button>}
          </>
        ) : (
          <>
            <button
              onClick={() => setSelectedChat(null)}
              className={styles.chatPanelBackButton}
            >←</button>
            <span className={styles.chatPanelTitle}>
              {selectedChat.isGroup
                ? selectedChat.groupName
                : selectedChat.participants.find(p => p._id !== userId)?.name || "User"}
            </span>
            <button onClick={onClose} className={styles.chatPanelCloseButton}>×</button>
          </>
        )}
      </div>
      {/* Content */}
      <div className={styles.chatPanelContent}>
        {!selectedChat || fullWidth ? (
          <>
            {loading && <div className={styles.chatPanelEmpty}>Loading...</div>}
            {!loading && chats.length === 0 && (
              <div className={styles.chatPanelEmpty}>No chats yet.</div>
            )}
            {!loading && chats.map(chat => (
              <div key={chat._id} className={styles.chatItem} onClick={() => {setSelectedChat(chat); if(fullWidth) {goToChat(chat._id);}}} >
                <img src={chat.isGroup ? chat.groupAvatar || "/group.png" : chat.participants.find(p => p._id !== userId)?.profilePicture || `https://ui-avatars.com/api/?name=${chat.participants.find(p => p._id !== userId)?.name}&background=random&color=fff`} alt="" className={styles.chatItemAvatar}/>
                <div className={styles.chatItemInfo}>
                  <div className={styles.chatItemName}>
                    {chat.isGroup ? chat.groupName : chat.participants.find( p=> p._id !== userId)?.name || "User"}
                  </div>
                  <div className={styles.chatItemPreview}>
                    {chat.lastMessage?.text ? chat.lastMessage.text : "No messages yet"}
                  </div>
                </div>
              </div>
            ))}
          </>
        ) : (
          !fullWidth && <ChatWindow chat={selectedChat} onBack={() => setSelectedChat(null)} onClose={onClose} />
        )}
      </div>
    </div>
      {selectedChat && fullWidth && <ChatWindow chat={selectedChat} onBack={() => setSelectedChat(null)} onClose={onClose} fullWidth={fullWidth} />}
  </>
  );
};
export default ChatPanel;