import express, { Router } from "express";
import dotenv from "dotenv";
import { recipesRouter } from "./modules/recipe/recipe-handlers";
import { handleErrors } from "./middleware/handleErrors";

dotenv.config();

export const app = express();

app.use(express.json());

app.use("/healthcheck", (_req, res, _next) => {
  return res.status(200).json({ hello: "world" });
});

const router = Router();
router.use("/recipes", recipesRouter);

app.use("/v1", router);
app.use(handleErrors);
