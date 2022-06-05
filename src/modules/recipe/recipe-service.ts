import { AppError, ErrorCode } from "../../error/AppError";
import { logger } from "../../logger";
import { recipe } from "./models/recipe";
import {
  RecipeInput,
  recipeOutputManySchema,
  recipeOutputSchema,
} from "./recipe-schema";

export async function listRecipes() {
  const recipes = await recipe.find();
  return recipeOutputManySchema.parse(recipes);
}

export async function getRecipeById(id: string) {
  const foundRecipe = await recipe.findById(id);

  if (!foundRecipe) {
    throw new AppError("Recipe not found", ErrorCode.NOT_FOUND);
  }

  return recipeOutputSchema.parse(foundRecipe);
}

export async function createRecipe(data: RecipeInput) {
  const createdRecipe = await recipe.create(data);

  logger.info({ createdRecipe }, "Successfully created recipe");
  return recipeOutputSchema.parse(createdRecipe);
}

export async function updateRecipe(id: string, data: RecipeInput) {
  const result = await recipe.findOneAndReplace({ _id: id }, data, {
    new: true,
  });

  if (!result) {
    throw new AppError("Recipe not found", ErrorCode.NOT_FOUND);
  }

  logger.info({ id, result }, "Successfully updated recipe");
}

export async function deleteRecipe(id: string) {
  const result = await recipe.findOneAndDelete({ _id: id });

  if (!result) {
    throw new AppError("Recipe not found", ErrorCode.NOT_FOUND);
  }

  logger.info({ id, result }, "Successfully deleted recipe");
}
