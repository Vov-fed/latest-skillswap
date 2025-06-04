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
exports.io = exports.initSocket = void 0;
// Call initSocket(server) in your main app entry after creating the HTTP server.
const socket_io_1 = require("socket.io");
const Message_1 = __importDefault(require("./models/Message"));
let io;
const initSocket = (server) => {
    exports.io = io = new socket_io_1.Server(server, {
        cors: {
            origin: "https://skillswap-mauve.vercel.app",
            methods: ["GET", "POST"],
            credentials: true
        }
    });
    io.on("connection", (socket) => {
        console.log("New client connected:", socket.id);
        socket.on("joinChat", (_a) => __awaiter(void 0, [_a], void 0, function* ({ chatId, userId }) {
            socket.join(chatId);
            // Find messages in this chat that are "sent" and not from this user
            const undelivered = yield Message_1.default.find({
                chat: chatId,
                status: "sent",
                sender: { $ne: userId }
            });
            for (const msg of undelivered) {
                msg.status = "delivered";
                yield msg.save();
                yield msg.populate([
                    { path: "sender", select: "name profilePicture _id" },
                    { path: "reactions.users", select: "name profilePicture _id" }
                ]);
                io.to(chatId).emit("messageUpdated", msg);
            }
        }));
        socket.on("readMessage", (_a) => __awaiter(void 0, [_a], void 0, function* ({ chatId, userId }) {
            const deliveredMessages = yield Message_1.default.find({
                chat: chatId,
                status: "delivered",
                sender: { $ne: userId }
            });
            for (const msg of deliveredMessages) {
                msg.status = "read";
                yield msg.save();
                yield msg.populate([
                    { path: "sender", select: "name profilePicture _id" },
                    { path: "reactions.users", select: "name profilePicture _id" }
                ]);
                io.to(chatId).emit("messageUpdated", msg);
                console.log(`Message ${msg._id} marked as read in chat ${chatId}`);
            }
        }));
        socket.on("reactToMessage", (_a) => __awaiter(void 0, [_a], void 0, function* ({ messageId, emoji, userId }) {
            console.log("Received reactToMessage event", { messageId, emoji, userId });
            const msg = yield Message_1.default.findById(messageId);
            if (!msg)
                return;
            // Find reaction object for this emoji
            let reaction = msg.reactions.find(r => r.emoji === emoji);
            console.log("Found reaction?", !!reaction);
            if (reaction) {
                // If user already reacted, remove previous reaction or add new one
                const userIndex = reaction.users.findIndex(u => u.toString() === userId);
                console.log("User index in reaction.users:", userIndex);
                if (userIndex !== -1) {
                    reaction.users.splice(userIndex, 1);
                    io.to(msg.chat.toString()).emit("messageReacted", msg, reaction);
                    io.to(msg.chat.toString()).emit("reactionAdded", {
                        messageId: msg._id.toString(),
                        emoji
                    });
                    console.log(`User ${userId} removed reaction ${emoji} from message ${messageId}`);
                }
                else {
                    reaction.users.push(userId);
                    io.to(msg.chat.toString()).emit("messageReacted", msg, reaction);
                    io.to(msg.chat.toString()).emit("reactionAdded", {
                        messageId: msg._id.toString(),
                        emoji
                    });
                    console.log(`User ${userId} reacted with ${emoji} to message ${messageId}`);
                }
            }
            else {
                msg.reactions.push({ emoji, users: [userId] });
                console.log("Created new reaction entry");
                io.to(msg.chat.toString()).emit("messageReacted", msg, { emoji, users: [userId] });
                io.to(msg.chat.toString()).emit("reactionAdded", {
                    messageId: msg._id.toString(),
                    emoji
                });
                console.log(`User ${userId} reacted with ${emoji} to message ${messageId}`);
            }
            yield msg.save();
            yield msg.populate([
                { path: "sender", select: "name profilePicture _id" },
                { path: "reactions.users", select: "name profilePicture _id" }
            ]);
            io.to(msg.chat.toString()).emit("messageUpdated", msg);
        }));
        socket.on("leaveChat", (chatId) => {
            socket.leave(chatId);
            // Optionally: console.log(`${socket.id} left chat ${chatId}`);
        });
        socket.on("disconnect", () => {
            // Optionally: console.log("Client disconnected:", socket.id);
        });
    });
};
exports.initSocket = initSocket;
