import express, { Application } from "express";
import cors from "cors";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
import { UserRoutes } from "./app/modules/user/user.route";
import { AcademicSemesterRoutes } from "./app/modules/academicSemester/academicSemester.route";

const app: Application = express();

app.use(cors());

//parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// application routes
app.use("/api/v1/users", UserRoutes);
app.use("/api/v1/academic-semesters", AcademicSemesterRoutes);

app.get("/", async () => {
  // Promise.reject(new Error('Unhandled promise rejection'))
  throw new Error("Unhandled error");
});

// global error handler
app.use(globalErrorHandler);

export default app;
