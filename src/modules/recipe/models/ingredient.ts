import mongoose, { Document } from "mongoose";

export type Ingredient = {
  name: string;
  amount: number;
  measure: string;
};

export const ingredientSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    amount: { type: Number, required: true },
    measure: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

export const ingredient = mongoose.model<Ingredient & Document>(
  "Ingredient",
  ingredientSchema
);
