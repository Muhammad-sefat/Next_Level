import express, { Request, Response, Router } from "express";
import { postController } from "./post.contoller";

const router = express.Router();

router.post("/", postController.createPost);

export const postRouter: Router = router;
