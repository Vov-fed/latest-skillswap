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
const updateSkillRouter = express_1.default.Router();
// PUT /api/skills/:id - Update a skill by ID
updateSkillRouter.put('/:id', authMiddleware_1.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { skillOffered, skillRequested, description } = req.body;
    try {
        const updatedSkill = yield Skill_1.default.findByIdAndUpdate(id, { skillOffered, skillRequested, description }, { new: true });
        if (!updatedSkill) {
            return res.status(404).json({ message: "Skill not found" });
        }
        res.json(updatedSkill);
    }
    catch (error) {
        console.error("Error updating skill:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}));
exports.default = updateSkillRouter;
