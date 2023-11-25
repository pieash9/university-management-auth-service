import express, { Application, NextFunction, Request, Response } from "express";
import cors from "cors";
const app: Application = express();

app.use(cors());

//parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//handle not found
app.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.send("Server is running!");
});

export default app;
