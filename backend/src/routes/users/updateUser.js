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
exports.updateUser = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const User_1 = __importDefault(require("../../models/User"));
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.headers.authorization;
        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || 'default_secret');
        const user = yield User_1.default.findById(decoded.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (req.body.currentPassword && req.body.newPassword) {
            const isMatch = yield bcryptjs_1.default.compare(req.body.currentPassword, user.password);
            if (!isMatch) {
                return res.status(400).json({ message: 'Current password is incorrect' });
            }
            const hashedNewPassword = yield bcryptjs_1.default.hash(req.body.newPassword, 10);
            user.password = hashedNewPassword;
        }
        const allowedFields = [
            'name',
            'bio',
            'location',
            'profilePicture',
            'headerPicture',
            'profession',
            'skills',
            'skillsOffered',
            'skillsRequested',
            'skillsInterested',
            'email'
        ];
        allowedFields.forEach((field) => {
            if (field in req.body) {
                user[field] = req.body[field];
            }
        });
        yield user.save();
        const updatedUser = yield User_1.default.findById(user._id).select('-password -__v');
        res.status(200).json({ user: updatedUser });
    }
    catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Invalid token' });
        }
        res.status(500).json({ message: 'Failed to update user', error: error.message });
    }
});
exports.updateUser = updateUser;
exports.default = exports.updateUser;
