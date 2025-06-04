"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const get_1 = require("./get");
const post_1 = require("./post");
const delete_1 = require("./delete");
const authMiddleware_1 = require("../../middleware/authMiddleware");
const router = express_1.default.Router();
// GET /chats
router.get('/', authMiddleware_1.verifyToken, get_1.getChats);
// GET /chats/:chatId
router.get('/:chatId', authMiddleware_1.verifyToken, get_1.getChat);
//Post /
router.post('/', authMiddleware_1.verifyToken, post_1.createChat);
// DELETE /chats/:chatId
router.delete('/:chatId', authMiddleware_1.verifyToken, delete_1.deleteChat);
// Export the router
exports.default = router;
