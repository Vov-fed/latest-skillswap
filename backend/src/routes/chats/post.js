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
exports.createChat = void 0;
const Chat_1 = __importDefault(require("../../models/Chat"));
const createChat = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { participants, isGroup, groupName, groupAvatar } = req.body;
        if (!participants || !Array.isArray(participants) || participants.length < 2) {
            return res.status(400).json({ error: "Participants required" });
        }
        // Prevent duplicate private chat
        if (!isGroup) {
            const existingChat = yield Chat_1.default.findOne({
                isGroup: false,
                participants: { $all: participants, $size: 2 }
            });
            if (existingChat) {
                return res.status(200).json(existingChat);
            }
        }
        const chat = new Chat_1.default({
            participants,
            isGroup: !!isGroup,
            groupName: isGroup ? groupName : "",
            groupAvatar: isGroup ? groupAvatar : "",
        });
        yield chat.save();
        const fullChat = yield chat.populate("participants", "name avatarUrl");
        res.status(201).json(fullChat);
    }
    catch (err) {
        res.status(500).json({ error: "Failed to create chat" });
    }
});
exports.createChat = createChat;
