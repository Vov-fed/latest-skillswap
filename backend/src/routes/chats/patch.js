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
exports.patchChat = void 0;
const Chat_1 = __importDefault(require("../../models/Chat"));
const patchChat = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { chatId } = req.params;
        const { groupName, groupAvatar, participants } = req.body;
        const chat = yield Chat_1.default.findById(chatId);
        if (!chat) {
            return res.status(404).json({ error: "Chat not found" });
        }
        if (!chat.isGroup) {
            if (groupName || groupAvatar || participants) {
                return res.status(400).json({ error: "Cannot update group fields on a private chat" });
            }
        }
        else {
            if (groupName !== undefined)
                chat.groupName = groupName;
            if (groupAvatar !== undefined)
                chat.groupAvatar = groupAvatar;
            if (participants !== undefined) {
                if (!Array.isArray(participants)) {
                    return res.status(400).json({ error: "Participants must be an array of user IDs" });
                }
                chat.participants = participants;
            }
        }
        yield chat.save();
        const updatedChat = yield Chat_1.default.findById(chatId).populate("participants", "name avatarUrl");
        return res.json(updatedChat);
    }
    catch (error) {
        return res.status(500).json({ error: error || "Server error" });
    }
});
exports.patchChat = patchChat;
