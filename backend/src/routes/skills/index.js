"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const getSkills_1 = __importDefault(require("./getSkills"));
const deleteSkill_1 = __importDefault(require("./deleteSkill"));
const createSkillRequest_1 = __importDefault(require("./createSkillRequest"));
const reportSkill_1 = __importDefault(require("./reportSkill"));
const updateSkill_1 = __importDefault(require("./updateSkill"));
router.use(getSkills_1.default);
router.use(deleteSkill_1.default);
router.use(createSkillRequest_1.default);
router.use(reportSkill_1.default);
router.use(updateSkill_1.default);
exports.default = router;
