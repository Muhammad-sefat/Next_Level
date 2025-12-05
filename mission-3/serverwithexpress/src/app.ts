import express, { Request, Response } from "express";
import initDB from "./config/db";
import { userRouter } from "./modules/user/user.route";
import { todoRouter } from "./modules/todo/todo.route";
import { authRouter } from "./modules/auth/auth.routes";

const app = express();

app.use(express.json());

// init data
initDB();

app.get("/", (req: Request, res: Response) => {
  res.send("Server is runing perfectly");
});

//* USER CURD OPERATIONS
app.use("/users", userRouter);

//* TODO CURD OPERATIONS
app.use("/todos", todoRouter);

//* AUTH OPERATIONS
app.use("/auth", authRouter);

// Not found
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    data: req.path,
  });
});

export default app;
