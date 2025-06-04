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
exports.searchMessagesInChat = exports.getMessageById = exports.getMessagesByChat = void 0;
const Message_1 = __importDefault(require("../../models/Message"));
const getMessagesByChat = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { chatId } = req.params;
        const { before, limit = 150 } = req.query;
        const query = { chat: chatId };
        if (before) {
            query._id = { $lt: before };
        }
        const messages = yield Message_1.default.find(query)
            .sort({ _id: -1 }) // Newest first
            .limit(Number(limit))
            .populate([
            { path: "sender", select: "name profilePicture" },
            { path: "reactions.users", select: "name profilePicture" }
        ])
            .exec();
        // Return in chronological order
        res.json(messages.reverse());
    }
    catch (err) {
        res.status(500).json({ error: "Failed to fetch messages" });
    }
});
exports.getMessagesByChat = getMessagesByChat;
const getMessageById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { messageId } = req.params;
        const message = yield Message_1.default.findById(messageId)
            .populate([
            { path: "sender", select: "name profilePicture" },
            { path: "reactions.users", select: "name profilePicture" }
        ]);
        if (!message) {
            return res.status(404).json({ error: "Message not found" });
        }
        res.json(message);
    }
    catch (err) {
        res.status(500).json({ error: "Failed to fetch message" });
    }
});
exports.getMessageById = getMessageById;
const searchMessagesInChat = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { chatId } = req.params;
        const { q } = req.query;
        if (!q) {
            return res.status(400).json({ error: "Query required" });
        }
        const messages = yield Message_1.default.find({
            chat: chatId,
            text: { $regex: q, $options: "i" }
        })
            .sort({ createdAt: -1 })
            .limit(50)
            .populate([
            { path: "sender", select: "name profilePicture" },
            { path: "reactions.users", select: "name profilePicture" }
        ]);
        res.json(messages);
    }
    catch (err) {
        res.status(500).json({ error: "Failed to search messages" });
    }
});
exports.searchMessagesInChat = searchMessagesInChat;
