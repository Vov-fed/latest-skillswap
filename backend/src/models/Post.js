"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const PostSchema = new mongoose_1.default.Schema({
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User'
    },
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    img: {
        type: String,
    },
    likes: {
        type: Array,
        default: []
    },
    comments: {
        type: [
            {
                user: {
                    type: mongoose_1.default.Schema.Types.ObjectId,
                    ref: 'User'
                },
                content: {
                    type: String,
                    required: true
                },
                date: {
                    type: Date,
                    default: Date.now
                },
                likes: {
                    type: Array,
                    default: []
                }
            }
        ],
        default: []
    },
    date: {
        type: Date,
        default: Date.now
    }
});
module.exports = mongoose_1.default.model('Post', PostSchema);
