"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const SkillSchema = new mongoose_1.default.Schema({
    skillOffered: {
        type: String,
        required: true,
    },
    skillRequested: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true
    },
    userOffering: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    usersRequesting: [{
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: 'User',
            default: []
        }],
    usersInterested: [{
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: 'User',
            default: []
        }],
    likes: [{
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: 'User',
            default: []
        }],
    isActive: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
});
exports.default = mongoose_1.default.model('Skill', SkillSchema);
