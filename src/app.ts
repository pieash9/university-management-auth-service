import express, { Application } from "express";
import cors from "cors";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
import routes from "./app/routes";

const app: Application = express();

app.use(cors());

//parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// application routes
app.use("/api/v1", routes);

app.get("/", async () => {
  // Promise.reject(new Error('Unhandled promise rejection'))
  throw new Error("Unhandled error");
});

// global error handler
app.use(globalErrorHandler);

export default app;
