"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const http_1 = __importDefault(require("http"));
const cors_1 = __importDefault(require("./cors"));
const index_1 = __importDefault(require("./routes/users/index"));
const index_2 = __importDefault(require("./routes/skills/index"));
const index_3 = __importDefault(require("./routes/chats/index"));
const index_4 = __importDefault(require("./routes/messages/index"));
const socket_1 = require("./socket");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
// --- SOCKET.IO SETUP ---
const server = http_1.default.createServer(app);
(0, socket_1.initSocket)(server);
app.get('/', (_req, res) => {
    res.send('Hello from Express with TypeScript!');
});
app.use(cors_1.default);
app.use(express_1.default.json());
app.use('/users', index_1.default);
app.use('/skills', index_2.default);
app.use('/chats', index_3.default);
app.use('/messages', index_4.default);
server.listen(PORT, () => {
    console.log(`Server running at port:${PORT}`);
});
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/mydatabase';
mongoose_1.default.connect(MONGO_URI)
    .then(() => {
    console.log('Connected to MongoDB', MONGO_URI);
})
    .catch((err) => {
    console.error('MongoDB connection error:', err);
});
