import axios from "axios";
import dotenv from "dotenv";
dotenv.config();
import Cookies from "js-cookie";

const token = Cookies.get("token");
const api = axios.create({
  baseURL: process.env.BACKEND_URI || "http://localhost:3000", // add http! and adjust if needed
  headers: { authorization: token }
});

// --- CHAT ROUTES ---

// Get all chats for user
export const getChats = async () => {
  try {
    const response = await api.get("/chats/");
    return response.data;
  } catch (error) {
    console.error("Failed to fetch chats:", error);
    throw error;
  }
};

// Get one chat by ID
export const getChat = async (chatId: string) => {
  try {
    const response = await api.get(`/chats/${chatId}`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch chat:", error);
    throw error;
  }
};

// Create new chat
export const createChat = async (payload: {
  participants: string[];
  isGroup?: boolean;
  groupName?: string;
  groupAvatar?: string;
}) => {
  try {
    const response = await api.post("/chats", payload);
    return response.data;
  } catch (error) {
    console.error("Failed to create chat:", error);
    throw error;
  }
};

// Update chat (group only)
export const updateChat = async (chatId: string, updates: {
  groupName?: string;
  groupAvatar?: string;
  participants?: string[];
}) => {
  try {
    const response = await api.patch(`/chats/${chatId}`, updates);
    return response.data;
  } catch (error) {
    console.error("Failed to update chat:", error);
    throw error;
  }
};

// Delete a chat
export const deleteChat = async (chatId: string) => {
  try {
    const response = await api.delete(`/chats/${chatId}`);
    return response.data;
  } catch (error) {
    console.error("Failed to delete chat:", error);
    throw error;
  }
};

// --- MESSAGE ROUTES ---

// Get messages for a chat (paginated)
export const getMessages = async (chatId: string, before?: string, limit = 100) => {
  try {
    const params: any = { limit };
    if (before) params.before = before;
    const response = await api.get(`/messages/${chatId}`, { params });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch messages:", error);
    throw error;
  }
};

// Send a new message
export const sendMessage = async (payload: {
  chatId: string;
  text: string;
  mediaUrl?: string;
  replyTo?: string;
  tempId?: string;
}) => {
  try {
    const response = await api.post("/messages", payload);
    console.log("Message sent successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Failed to send message:", error);
    throw error;
  }
};

// Edit a message
export const editMessage = async (messageId: string, updates: {
  text?: string;
  mediaUrl?: string;
}) => {
  try {
    const response = await api.patch(`/messages/${messageId}`, updates);
    return response.data;
  } catch (error) {
    console.error("Failed to edit message:", error);
    throw error;
  }
};

// Delete a message
export const deleteMessage = async (messageId: string) => {
  try {
    const response = await api.delete(`/messages/${messageId}`);
    return response.data;
  } catch (error) {
    console.error("Failed to delete message:", error);
    throw error;
  }
};

// Mark a message as read
export const markMessageRead = async (messageId: string) => {
  try {
    const response = await api.post(`/messages/${messageId}/read`);
    return response.data;
  } catch (error) {
    console.error("Failed to mark message as read:", error);
    throw error;
  }
};

// Mark all messages in chat as read
export const markAllReadInChat = async (chatId: string) => {
  try {
    const response = await api.post(`/messages/readall/${chatId}`);
    return response.data;
  } catch (error) {
    console.error("Failed to mark all as read:", error);
    throw error;
  }
};

// React to a message
export const reactToMessage = async (messageId: string, reaction: string) => {
  try {
    const response = await api.post(`/messages/react/${messageId}`, { reaction });
    return response.data;
  } catch (error) {
    console.error("Failed to react to message:", error);
    throw error;
  }
};
