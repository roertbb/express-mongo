import { z } from "zod";

const ingredientBase = {
  name: z.string(),
  amount: z.number(),
  measure: z.string(),
};

const recipeBase = {
  name: z.string(),
  description: z.string().optional(),
  imageUrl: z.string().optional(),
};

export const recipeOutputSchema = z.object({
  id: z.string(),
  ...recipeBase,
  ingredients: z.array(z.object(ingredientBase)),
});
export type RecipeOutput = z.infer<typeof recipeOutputSchema>;

export const recipeOutputManySchema = z.array(recipeOutputSchema);
export type RecipeOutputMany = z.infer<typeof recipeOutputManySchema>;

export const recipeInputSchema = z.object({
  body: z.object({
    ...recipeBase,
    ingredients: z.array(z.object(ingredientBase)),
  }),
});
export type RecipeInput = z.infer<typeof recipeInputSchema>["body"];

const recipeIdParamSchema = z.object({ recipeId: z.string() });
export const RecipeIdParamSchema = z.object({ params: recipeIdParamSchema });
export type RecipeIdParam = z.infer<typeof RecipeIdParamSchema>["params"];

export const recipeUpdateInputSchema = z.object({
  body: z.object({
    ...recipeBase,
    ingredients: z.array(z.object(ingredientBase)),
  }),
  params: recipeIdParamSchema,
});
export type RecipeUpdateInput = z.infer<typeof recipeUpdateInputSchema>["body"];
