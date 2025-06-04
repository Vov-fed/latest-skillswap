"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const get_1 = require("./get");
const post_1 = require("./post");
const patch_1 = require("./patch");
const delete_1 = require("./delete");
const authMiddleware_1 = require("../../middleware/authMiddleware");
const router = express_1.default.Router();
// ***************GET ROUTES****************
// Get messages by chat ID
router.get('/:chatId', get_1.getMessagesByChat);
// Get a specific message by ID
router.get('/message/:messageId', get_1.getMessageById);
// Search messages in a chat
router.get('/:chatId/search', get_1.searchMessagesInChat);
// ***************POST ROUTES****************
// Send a new message
router.post('/', authMiddleware_1.verifyToken, post_1.sendMessage);
// Mark a message as read
router.post('/read/:messageId', post_1.markMessageRead);
// Mark all messages in a chat as read
router.post('/read/:chatId', authMiddleware_1.verifyToken, post_1.markAllReadInChat);
// React to a message
router.post('/react/:messageId', authMiddleware_1.verifyToken, post_1.reactToMessage);
// Edit a message
router.patch('/:messageId', authMiddleware_1.verifyToken, patch_1.editMessage);
// Update a message status
router.patch('/status/:messageId', authMiddleware_1.verifyToken, patch_1.updateMessageStatus);
// Edit a reaction on a message
router.patch('/react/:messageId', authMiddleware_1.verifyToken, patch_1.editReaction);
// ***************DELETE ROUTES****************
// Delete a message
router.delete('/:messageId', authMiddleware_1.verifyToken, delete_1.deleteMessage);
// Delete all messages in a chat
router.delete('/chat/:chatId', authMiddleware_1.verifyToken, delete_1.deleteMessagesInChat);
// Remove a reaction from a message
router.delete('/react/:messageId', authMiddleware_1.verifyToken, delete_1.removeReaction);
exports.default = router;
