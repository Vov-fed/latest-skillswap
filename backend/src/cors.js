"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const corsOptions = {
    origin: 'https://skillswap-mauve.vercel.app',
    credentials: true,
    exposedHeaders: ['Content-Length', 'X-Total-Count'],
    preflightContinue: false,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};
exports.default = (0, cors_1.default)(corsOptions);
