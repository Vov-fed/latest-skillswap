"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeReaction = exports.deleteMessagesInChat = exports.deleteMessage = void 0;
const socket_1 = require("../../socket");
const Message_1 = __importDefault(require("../../models/Message"));
// Delete a message (only sender or admin)
const deleteMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { messageId } = req.params;
        //@ts-ignore
        const userId = req.user._id;
        const message = yield Message_1.default.findById(messageId);
        if (!message) {
            return res.status(404).json({ error: "Message not found" });
        }
        // Allow only sender (or admin if you have admin logic)
        if (String(message.sender) !== String(userId)) {
            return res.status(403).json({ error: "You can only delete your own messages" });
        }
        yield message.deleteOne();
        res.json({ message: "Message deleted" });
        // Emit real-time update for message deletion
        socket_1.io.to(message.chat.toString()).emit("messageDeleted", messageId);
    }
    catch (err) {
        res.status(500).json({ error: "Failed to delete message" });
    }
});
exports.deleteMessage = deleteMessage;
// Delete all messages in a chat
const deleteMessagesInChat = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { chatId } = req.params;
        // You might want to check if the user is allowed to do this (owner/admin)
        yield Message_1.default.deleteMany({ chat: chatId });
        // Emit real-time update for chat messages deletion
        socket_1.io.to(chatId).emit("messagesDeleted", chatId);
        res.json({ message: "All messages deleted for chat" });
    }
    catch (err) {
        res.status(500).json({ error: "Failed to delete messages for chat" });
    }
});
exports.deleteMessagesInChat = deleteMessagesInChat;
// Remove the user's reaction from a message
const removeReaction = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { messageId } = req.params;
        const emoji = req.query.emoji || req.body.emoji;
        if (!emoji) {
            return res.status(400).json({ error: "Emoji is required" });
        }
        //@ts-ignore
        const userId = req.user._id;
        const message = yield Message_1.default.findById(messageId);
        if (!message) {
            return res.status(404).json({ error: "Message not found" });
        }
        const reactionIndex = message.reactions.findIndex(r => r.emoji === emoji);
        if (reactionIndex === -1) {
            return res.status(404).json({ error: "Reaction not found" });
        }
        const userIndex = message.reactions[reactionIndex].users.findIndex(u => String(u) === String(userId));
        if (userIndex !== -1) {
            message.reactions[reactionIndex].users.splice(userIndex, 1);
            if (message.reactions[reactionIndex].users.length === 0) {
                message.reactions.splice(reactionIndex, 1);
            }
        }
        yield message.save();
        yield message.populate([
            { path: "sender", select: "name profilePicture _id" },
            { path: "reactions.users", select: "name profilePicture _id" }
        ]);
        // Emit real-time update for reaction removal
        socket_1.io.to(message.chat.toString()).emit("messageUpdated", message);
        res.json(message);
    }
    catch (err) {
        res.status(500).json({ error: "Failed to remove reaction" });
    }
});
exports.removeReaction = removeReaction;
