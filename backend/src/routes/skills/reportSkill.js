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
const Moderator_1 = __importDefault(require("../../models/Moderator"));
const reportSkill = express_1.default.Router();
// POST /api/skills - Create a new skill request/offer
reportSkill.post('/:id/report', authMiddleware_1.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const skillId = req.params.id;
    const { reason } = req.body;
    if (!reason) {
        return res.status(400).json({ message: 'Reason for reporting is required' });
    }
    try {
        const skill = yield Skill_1.default.findById(skillId);
        if (!skill) {
            return res.status(404).json({ message: 'Skill not found' });
        }
        const report = {
            skillId,
            reason
        };
        yield Moderator_1.default.create(report);
        return res.status(201).json({ message: 'Skill reported successfully' });
    }
    catch (error) {
        console.error('Error reporting skill:', error);
        console.log('Error details:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}));
exports.default = reportSkill;
