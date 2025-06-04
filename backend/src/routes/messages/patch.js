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
exports.editReaction = exports.updateMessageStatus = exports.editMessage = void 0;
const Message_1 = __importDefault(require("../../models/Message"));
// Edit a message (only sender can edit)
const editMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { messageId } = req.params;
        const { text, mediaUrl } = req.body;
        //@ts-ignore
        const userId = req.user._id;
        const message = yield Message_1.default.findById(messageId);
        if (!message) {
            return res.status(404).json({ error: "Message not found" });
        }
        if (String(message.sender) !== String(userId)) {
            return res.status(403).json({ error: "You can only edit your own messages" });
        }
        if (text !== undefined)
            message.text = text;
        if (mediaUrl !== undefined)
            message.mediaUrl = mediaUrl;
        message.updatedAt = new Date();
        yield message.save();
        res.json(message);
    }
    catch (err) {
        res.status(500).json({ error: "Failed to edit message" });
    }
});
exports.editMessage = editMessage;
// Update a message status
const updateMessageStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { messageId } = req.params;
        const { status } = req.body; // e.g., "delivered" or "read"
        if (!["sent", "delivered", "read"].includes(status)) {
            return res.status(400).json({ error: "Invalid status" });
        }
        const message = yield Message_1.default.findByIdAndUpdate(messageId, { status, updatedAt: new Date() }, { new: true });
        if (!message) {
            return res.status(404).json({ error: "Message not found" });
        }
        res.json(message);
    }
    catch (err) {
        res.status(500).json({ error: "Failed to update status" });
    }
});
exports.updateMessageStatus = updateMessageStatus;
// Edit a reaction on a message
const editReaction = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { messageId } = req.params;
        const { reaction } = req.body;
        //@ts-ignore
        const userId = req.user._id;
        const message = yield Message_1.default.findById(messageId);
        if (!message)
            return res.status(404).json({ error: "Message not found" });
        // Replace or add new reaction (assuming message.reactions: [{ emoji, users }])
        let existing = message.reactions.find(r => r.emoji === reaction);
        if (existing) {
            if (!existing.users.includes(userId)) {
                existing.users.push(userId);
            }
        }
        else {
            message.reactions.push({
                users: [userId],
                emoji: reaction
            });
        }
        yield message.save();
        res.json(message);
    }
    catch (err) {
        res.status(500).json({ error: "Failed to update reaction" });
    }
});
exports.editReaction = editReaction;
