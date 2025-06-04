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
const mongoose_1 = __importDefault(require("mongoose"));
const express_1 = __importDefault(require("express"));
const Skill_1 = __importDefault(require("../../models/Skill"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authMiddleware_1 = require("../../middleware/authMiddleware");
const Moderator_1 = __importDefault(require("../../models/Moderator"));
const getSkillsRouter = express_1.default.Router();
// GET /api/skills - Fetch all skills
getSkillsRouter.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const skills = yield Skill_1.default.find({}).populate('userOffering', 'name email profilePicture');
        res.status(200).json(skills);
    }
    catch (error) {
        console.error('Error fetching skills:', error);
        res.status(500).json({ message: 'Server error while fetching skills' });
    }
}));
getSkillsRouter.get('/moderator', authMiddleware_1.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId; // Extract userId from the request object
    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || 'default_secret');
    if (!decoded || decoded.role !== 'admin') {
        return res.status(403).json({ message: 'Forbidden: You are not a moderator' });
    }
    try {
        const moderatorSkills = yield Moderator_1.default.find()
            .populate('skillId', 'skillOffered skillRequested description userOffering');
        res.status(200).json({ message: 'Moderator skills fetched successfully', data: moderatorSkills });
    }
    catch (error) {
        console.error('Error fetching skills for moderator:', error);
        res.status(500).json({ message: 'Server error while fetching skills for moderator' });
    }
}));
getSkillsRouter.get('/from/:userId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.userId;
        const skills = yield Skill_1.default.find({ userOffering: userId }).populate('userOffering', 'name email profilePicture');
        res.json(skills);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
}));
// GET /api/skills/:id - Fetch a skill by ID
getSkillsRouter.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const skillId = req.params.id;
    if (!mongoose_1.default.Types.ObjectId.isValid(skillId)) {
        return res.status(400).json({ message: 'Invalid skill ID format' });
    }
    try {
        const skill = yield Skill_1.default.findById(skillId);
        if (!skill) {
            return res.status(404).json({ message: 'Skill not found' });
        }
        res.status(200).json(skill);
    }
    catch (error) {
        console.error(`Error fetching skill with ID ${skillId}:`, error);
        res.status(500).json({ message: 'Server error while fetching skill' });
    }
}));
// GET /api/skills/myskills - Fetch skills offered by the authenticated user
exports.default = getSkillsRouter;
