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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Moderator_1 = __importDefault(require("../../models/Moderator"));
const deleteSkillRouter = express_1.default.Router();
// DELETE /api/skills/:id - Delete a skill by ID
deleteSkillRouter.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const skillId = req.params.id;
        const token = req.headers.authorization;
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const decodedToken = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || 'default_secret');
        let userId;
        if (typeof decodedToken === 'object' && decodedToken !== null && 'userId' in decodedToken) {
            userId = decodedToken.userId;
        }
        if (!userId) {
            return res.status(401).json({ message: 'Invalid token' });
        }
        const skill = yield Skill_1.default.findById(skillId);
        if (!skill) {
            return res.status(404).json({ message: 'Skill not found' });
        }
        const userRole = (typeof decodedToken === 'object' && decodedToken !== null && 'role' in decodedToken)
            ? decodedToken.role
            : undefined;
        if ((!skill.userOffering && userRole !== 'admin') || (skill.userOffering && skill.userOffering.toString() !== userId && userRole !== 'admin')) {
            return res.status(403).json({ message: 'Forbidden: You do not have permission to delete this skill' });
        }
        const deletedSkill = yield Skill_1.default.findByIdAndDelete(skillId);
        if (!deletedSkill) {
            return res.status(404).json({ message: 'Skill not found' });
        }
        const isModerator = (yield Moderator_1.default.findOne({ skillId: skillId })) || false;
        if (isModerator) {
            yield Moderator_1.default.deleteOne({ skillId: skillId });
        }
        res.status(200).json({ message: 'Skill deleted successfully' });
    }
    catch (error) {
        console.error('Error deleting skill:', error);
        res.status(500).json({ message: 'Server error while deleting skill' });
    }
}));
exports.default = deleteSkillRouter;
