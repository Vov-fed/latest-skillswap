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
exports.reactToMessage = exports.markAllReadInChat = exports.markMessageRead = exports.sendMessage = void 0;
// Import Socket.io server instance
const socket_1 = require("../../socket");
const Message_1 = __importDefault(require("../../models/Message"));
const Chat_1 = __importDefault(require("../../models/Chat"));
// Send a new message
const sendMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { chatId, text, mediaUrl, replyTo, tempId } = req.body;
        //@ts-ignore
        const sender = req.user._id; // from auth middleware
        if (!chatId || (!text && !mediaUrl)) {
            return res
                .status(400)
                .json({ error: "chatId and text or media required" });
        }
        // Create the message
        const message = new Message_1.default({
            chat: chatId,
            sender,
            text,
            mediaUrl,
            replyTo,
            status: "sent",
            tempId,
        });
        yield message.save();
        // Update chat's lastMessage
        yield Chat_1.default.findByIdAndUpdate(chatId, {
            lastMessage: message._id,
            updatedAt: new Date(),
        });
        res.status(201).json(message);
        // --- Real-time: emit new message to chat room via Socket.io ---
        // Populate sender if needed before emitting
        yield message.populate("sender", "name avatarUrl");
        socket_1.io.to(chatId).emit("newMessage", message);
        // -------------------------------------------------------------
    }
    catch (err) {
        res.status(500).json({ error: "Failed to send message" });
    }
});
exports.sendMessage = sendMessage;
// Mark one message as read
const markMessageRead = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { messageId } = req.params;
        const message = yield Message_1.default.findByIdAndUpdate(messageId, { status: "read" }, { new: true });
        if (!message)
            return res.status(404).json({ error: "Message not found" });
        res.json(message);
        socket_1.io.to(message.chat.toString()).emit("messageUpdated", message);
    }
    catch (err) {
        res.status(500).json({ error: "Failed to mark as read" });
    }
});
exports.markMessageRead = markMessageRead;
// Mark all messages in chat as read (for the user)
const markAllReadInChat = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { chatId } = req.params;
        //@ts-ignore
        const userId = req.user._id;
        // Only mark messages not sent by this user
        yield Message_1.default.updateMany({ chat: chatId, sender: { $ne: userId }, status: { $ne: "read" } }, { $set: { status: "read" } });
        res.json({ message: "All messages marked as read" });
    }
    catch (err) {
        res.status(500).json({ error: "Failed to mark all as read" });
    }
});
exports.markAllReadInChat = markAllReadInChat;
// Add a reaction (like, emoji, etc.) to a message
const reactToMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { messageId } = req.params;
        const { reaction } = req.body; // reaction is the emoji string
        //@ts-ignore
        const userId = req.user._id;
        const message = yield Message_1.default.findById(messageId);
        if (!message)
            return res.status(404).json({ error: "Message not found" });
        // Ensure reactions array exists
        if (!Array.isArray(message.reactions)) {
            message.reactions = [];
        }
        // Remove userId from all reaction.users arrays first (only one reaction per user allowed)
        for (const r of message.reactions) {
            r.users = r.users.filter((u) => u.toString() !== userId.toString());
        }
        // Then, add userId to the selected emoji's users
        let reactionObj = message.reactions.find((r) => r.emoji === reaction);
        if (reactionObj) {
            reactionObj.users.push(userId);
        }
        else {
            message.reactions.push({ emoji: reaction, users: [userId] });
        }
        // Optionally, remove reaction objects with empty users arrays (cleanup)
        message.reactions = message.reactions.filter((r) => r.users.length > 0);
        yield message.save();
        // Populate sender and nested reactions.users with name and profilePicture
        yield message.populate([
            { path: "sender", select: "name profilePicture _id" },
            { path: "reactions.users", select: "name profilePicture _id" }
        ]);
        socket_1.io.to(message.chat.toString()).emit("reactionAdded", {
            messageId: message._id,
            emoji: reaction,
            userId,
        });
        res.json(message);
        socket_1.io.to(message.chat.toString()).emit("messageUpdated", message);
    }
    catch (err) {
        res.status(500).json({ error: "Failed to add reaction" });
    }
});
exports.reactToMessage = reactToMessage;
