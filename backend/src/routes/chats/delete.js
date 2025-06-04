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
exports.deleteChat = void 0;
const Chat_1 = __importDefault(require("../../models/Chat"));
const Message_1 = __importDefault(require("../../models/Message"));
const deleteChat = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { chatId } = req.params;
        // Find the chat and ensure it exists
        const chat = yield Chat_1.default.findById(chatId);
        if (!chat) {
            return res.status(404).json({ error: "Chat not found" });
        }
        // Delete all messages of this chat
        yield Message_1.default.deleteMany({ chat: chatId });
        // Delete the chat
        yield Chat_1.default.deleteOne({ _id: chatId });
        return res.status(200).json({ message: "Chat and messages deleted successfully" });
    }
    catch (error) {
        console.error("Error deleting chat:", error);
        return res.status(500).json({ error: "Server error" });
    }
});
exports.deleteChat = deleteChat;
