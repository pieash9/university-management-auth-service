"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FacultyRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const faculty_controller_1 = require("./faculty.controller");
const faculty_validation_1 = require("./faculty.validation");
const router = express_1.default.Router();
router.get("/:id", faculty_controller_1.FacultyController.getSingleFaculty);
router.get("/", faculty_controller_1.FacultyController.getAllFaculties);
router.patch("/:id", (0, validateRequest_1.default)(faculty_validation_1.FacultyValidation.updateFacultyZodSchema), faculty_controller_1.FacultyController.updateFaculty);
exports.FacultyRoutes = router;
