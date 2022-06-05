import mongoose from "mongoose";
import { Ingredient, ingredientSchema } from "./ingredient";

export interface Recipe {
  name: string;
  description?: string;
  imageUtl?: string;
  ingredients?: Ingredient[];
}

const recipeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: String,
    imageUrl: String,
    ingredients: [ingredientSchema],
  },
  {
    timestamps: true,
  }
);

export const recipe = mongoose.model<Recipe & Document>("Recipe", recipeSchema);
