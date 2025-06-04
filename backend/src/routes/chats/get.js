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
exports.getChat = exports.getChats = void 0;
const Message_1 = __importDefault(require("../../models/Message"));
const Chat_1 = __importDefault(require("../../models/Chat"));
// GET   /chats
// Get all chats for the authenticated user (with participants, last message, unread count)
// GET /chats
const getChats = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // @ts-ignore
        const userId = req.user._id; // assume req.user is set by auth middleware
        const chats = yield Chat_1.default.find({ participants: userId })
            .populate("participants", "name profilePicture")
            .populate({
            path: "lastMessage",
            populate: { path: "sender", select: "name profilePicture" }
        })
            .sort({ updatedAt: -1 });
        res.json(chats);
    }
    catch (err) {
        res.status(500).json({ error: "Failed to get chats", });
    }
});
exports.getChats = getChats;
// GET /chats/:chatId
const getChat = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // @ts-ignore
        const userId = req.user._id;
        const { chatId } = req.params;
        // Ensure user is a participant
        const chat = yield Chat_1.default.findOne({ _id: chatId, participants: userId })
            .populate("participants", "name avatarUrl")
            .populate({
            path: "lastMessage",
            populate: { path: "sender", select: "name avatarUrl" }
        });
        if (!chat)
            return res.status(404).json({ error: "Chat not found" });
        // Get recent messages (e.g., last 30)
        const messages = yield Message_1.default.find({ chat: chatId })
            .sort({ createdAt: -1 })
            .limit(30)
            .populate("sender", "name avatarUrl");
        res.json({ chat, messages: messages.reverse() });
    }
    catch (err) {
        res.status(500).json({ error: "Failed to get chat" });
    }
});
exports.getChat = getChat;
// GET /messages/:chatId?before=<msgId>&limit=<n>
// export const getMessages = async (req: Request, res: Response) => {
//   try {
//     // @ts-ignore
//     const userId = req.user._id;
//     const { chatId } = req.params;
//     const { before, limit = 30 } = req.query;
//     let filter: any = { chat: chatId };
//     if (before) {
//       filter._id = { $lt: before }; // get older messages
//     }
//     const messages = await Message.find(filter)
//       .sort({ _id: -1 })
//       .limit(Number(limit))
//       .populate("sender", "name avatarUrl");
//     res.json(messages.reverse()); // return oldest first
//   } catch (err) {
//     res.status(500).json({ error: "Failed to get messages" });
//   }
// };
