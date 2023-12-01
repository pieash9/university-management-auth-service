import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
import routes from "./app/routes";
import httpStatus from "http-status";

const app: Application = express();

app.use(cors());

//parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// application routes
app.use("/api/v1", routes);

// app.get("/", async () => {
//   // Promise.reject(new Error('Unhandled promise rejection'))
//   throw new Error("Unhandled error");
// });

// global error handler
app.use(globalErrorHandler);

// handle not found
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(httpStatus.NOT_FOUND).json({
    success: false,
    message: "Not Found",
    errorMessages: [
      {
        path: req.originalUrl,
        message: "API not found !",
      },
    ],
  });
  next();
});

export default app;
