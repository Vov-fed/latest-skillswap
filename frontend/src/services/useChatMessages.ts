import { useEffect, useRef, useState } from "react";
import { getMessages, sendMessage as apiSendMessage, reactToMessage as apiReactToMessage, } from "./chatAndMessageApi";
import { useSocket } from "./useSocket";
import { getUserIdByToken } from "./userApi";

type Message = {
  _id: string;
  text: string;
  sender: string | { _id: string; name: string; profilePicture: string };
  reactions: { emoji: string; users: { _id: string; name: string; profilePicture: string }[] }[];
  createdAt: string;
  status: "sent" | "delivered" | "read";
  tempId?: string;
};

function generateTempId() {
  return `tmp-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function useChatMessages(chatId: string) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const socket = useSocket();
  const userId = getUserIdByToken();
  const messagesRef = useRef<Message[]>([]);
  const [animatedReaction, setAnimatedReaction] = useState<null | { messageId: string; emoji: string }>(null);

  // Fetch messages on mount or chatId change
  useEffect(() => {
    setLoading(true);
    getMessages(chatId)
      .then((msgs) => {
        setMessages(msgs);
        messagesRef.current = msgs;
      })
      .finally(() => setLoading(false));
  }, [chatId]);

  useEffect(() => {
    if (!socket || !socket.connected || !chatId) return;
    socket.emit("joinChat", { chatId, userId });

    const handleNewMessage = (msg: Message) => {
      setMessages(prev => {
        // Find if there is a temp message with this tempId
        if (msg.tempId) {
          const tempIdx = prev.findIndex(m => m.tempId && m.tempId === msg.tempId);
          if (tempIdx !== -1) {
            // Replace the temp message with the real one
            const newArr = [...prev];
            newArr[tempIdx] = msg;
            return newArr;
          }
        }
        // Prevent adding duplicate by _id
        if (prev.some(m => m._id === msg._id)) return prev;
        return [...prev, msg];
      });
      messagesRef.current = [...messagesRef.current, msg];
    };

    const handleMessageUpdated = (updatedMsg: Message) => {
      setMessages((prev) =>
        prev.map((msg) => (msg._id === updatedMsg._id ? updatedMsg : msg))
      );
      messagesRef.current = messagesRef.current.map((msg) =>
        msg._id === updatedMsg._id ? updatedMsg : msg
      );
      // Animation logic removed; handled in handleReactionAdded instead.
    };

    const handleReactionAdded = ({ messageId, emoji }: any) => {
      setAnimatedReaction({ messageId, emoji });
      setTimeout(() => setAnimatedReaction(null), 400);
    };

    socket.on("newMessage", handleNewMessage);
    socket.on("messageUpdated", handleMessageUpdated);
    socket.on("reactionAdded", handleReactionAdded);

    return () => {
      socket.off("newMessage", handleNewMessage);
      socket.off("messageUpdated", handleMessageUpdated);
      socket.off("reactionAdded", handleReactionAdded);
    };
  }, [socket, socket?.connected, chatId, userId]);

  // Send message
  const sendMessage = async (text: string) => {
    if (!text.trim()) return;
    setSending(true);
    const tempId = generateTempId();
    const tempMessage: Message = {
      _id: tempId,
      tempId,
      text,
      sender: { _id: userId ?? "", name: "You", profilePicture: "" }, // Fill these as you wish
      reactions: [],
      createdAt: new Date().toISOString(),
      status: "sent"
    };
    setMessages(prev => [...prev, tempMessage]);
    try {
      const msg = await apiSendMessage({ chatId, text, tempId });
      if (socket) {
        socket.emit("newMessage", msg);
      }
    } finally {
      setSending(false);
    }
  };

  // Add reaction
const reactToMessage = async (msgId: string, emoji: string) => {
  try {
    if (socket) {
      socket.emit("reactToMessage", { messageId: msgId, emoji, userId });

      // Trigger animation immediately for local user
      setAnimatedReaction({ messageId: msgId, emoji });
      setTimeout(() => setAnimatedReaction(null), 400);
    }
  } catch (err) {
    console.error("Failed to react to message:", err);
  }
};


  return {
    messages,
    loading,
    sending,
    sendMessage,
    reactToMessage,
    userId,
    animatedReaction,
  };
}