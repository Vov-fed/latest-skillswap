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
const express_1 = __importDefault(require("express"));
const Skill_1 = __importDefault(require("../../models/Skill"));
const authMiddleware_1 = require("../../middleware/authMiddleware");
const User_1 = __importDefault(require("../../models/User"));
const createSkillRouter = express_1.default.Router();
// POST /api/skills - Create a new skill request/offer
createSkillRouter.post('/', authMiddleware_1.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { skillOffered, skillRequested, description } = req.body;
        if (!skillOffered || !skillRequested || !description) {
            return res.status(400).json({ message: 'skillOffered, skillRequested, and description are required' });
        }
        // @ts-ignore
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized: No user' });
        }
        const newSkill = new Skill_1.default({
            skillOffered,
            skillRequested,
            description,
            userOffering: userId,
            usersRequesting: [],
            usersInterested: [],
            likes: [],
            isActive: true,
            createdAt: new Date(),
        });
        const savedSkill = yield newSkill.save();
        yield User_1.default.findByIdAndUpdate(userId, { $push: { skillRequestings: savedSkill._id.toString() } });
        res.status(201).json(savedSkill);
    }
    catch (error) {
        console.error('Error creating skill:', error);
        res.status(500).json({ message: 'Server error while creating skill' });
    }
}));
exports.default = createSkillRouter;
