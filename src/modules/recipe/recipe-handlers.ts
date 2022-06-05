import { NextFunction, Request, Response, Router } from "express";
import validateSchema from "../../middleware/validateSchema";
import {
  createRecipe,
  deleteRecipe,
  getRecipeById,
  listRecipes,
  updateRecipe,
} from "./recipe-service";
import {
  RecipeInput,
  recipeInputSchema,
  RecipeIdParam,
  RecipeIdParamSchema,
  recipeUpdateInputSchema,
} from "./recipe-schema";

export const recipesRouter = Router();

recipesRouter.get("/", async (_req, res: Response, next: NextFunction) => {
  try {
    const recipes = await listRecipes();

    res.json(recipes);
  } catch (err) {
    next(err);
  }
});

recipesRouter.get(
  "/:recipeId",
  validateSchema(RecipeIdParamSchema),
  async (req: Request<RecipeIdParam>, res: Response, next: NextFunction) => {
    try {
      const recipes = await getRecipeById(req.params.recipeId);

      res.json(recipes);
    } catch (err) {
      next(err);
    }
  }
);

recipesRouter.post(
  "/",
  validateSchema(recipeInputSchema),
  async (
    req: Request<{}, {}, RecipeInput>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const recipe = await createRecipe(req.body);

      res.status(201).json(recipe);
    } catch (err) {
      next(err);
    }
  }
);

recipesRouter.put(
  "/:recipeId",
  validateSchema(recipeUpdateInputSchema),
  async (
    req: Request<RecipeIdParam, {}, RecipeInput>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      await updateRecipe(req.params.recipeId, req.body);

      res.status(204).send();
    } catch (err) {
      next(err);
    }
  }
);

recipesRouter.delete(
  "/:recipeId",
  validateSchema(RecipeIdParamSchema),
  async (req: Request<RecipeIdParam>, res: Response, next: NextFunction) => {
    try {
      await deleteRecipe(req.params.recipeId);

      res.status(204).send();
    } catch (err) {
      next(err);
    }
  }
);
