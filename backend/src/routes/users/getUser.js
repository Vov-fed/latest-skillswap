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
exports.getUsersByIdsRoute = exports.getUserByIdRoute = exports.getUserRoute = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../../models/User"));
const getUserRoute = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || 'default_secret');
        const user = yield User_1.default.findById(decoded.userId).select('-password -__v');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        return res.status(200).json({ user });
    }
    catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Invalid token' });
        }
        console.error('Get user error:', error);
        return res.status(500).json({ message: 'Something went wrong' });
    }
});
exports.getUserRoute = getUserRoute;
const getUserByIdRoute = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.id;
    if (!userId) {
        return res.status(400).json({ message: 'User ID is required' });
    }
    try {
        const user = yield User_1.default.findById(userId).select('-password -__v');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        return res.status(200).json({ user });
    }
    catch (error) {
        console.error('Get user by ID error:', error);
        return res.status(500).json({ message: 'Something went wrong' });
    }
});
exports.getUserByIdRoute = getUserByIdRoute;
const getUsersByIdsRoute = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json({ message: 'Array of user IDs is required' });
    }
    try {
        const users = yield User_1.default.find({ _id: { $in: ids } }).select('name email profilePicture _id');
        return res.status(200).json(users);
    }
    catch (error) {
        console.error('Get users by IDs error:', error);
        return res.status(500).json({ message: 'Something went wrong' });
    }
});
exports.getUsersByIdsRoute = getUsersByIdsRoute;
