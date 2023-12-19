import express from "express";
import { AcademicFacultyValidation } from "./academicFaculty.validation";
import validateRequest from "../../middlewares/validateRequest";
import { AcademicFacultyController } from "./academicFaculty.controller";

const router = express.Router();

router.post(
  "/create-faculty",
  validateRequest(AcademicFacultyValidation.createFacultyZodSchema),
  AcademicFacultyController.createFaculty,
);

router.get("/:id", AcademicFacultyController.getSingleFaculty);
router.get("/", AcademicFacultyController.getAllFaculty);
router.patch(
  "/:id",
  validateRequest(AcademicFacultyValidation.updateFacultyZodSchema),
  AcademicFacultyController.updateFaculty,
);
router.delete("/:id", AcademicFacultyController.deleteFaculty);

export const AcademicFacultyRoutes = router;
