import request from "supertest";
import { connect } from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { app } from "../../app";
import { recipe } from "./models/recipe";

const recipeFixtures = [
  {
    name: "test recipe 1",
    ingredients: [
      {
        name: "test ingredient 1",
        amount: 1,
        measure: "piece",
      },
    ],
  },
  {
    name: "test recipe 2",
    description: "some description for recipe 2",
    imageUrl: "https://example.com/recipe2.jpg",
    ingredients: [
      {
        name: "test ingredient 1",
        amount: 1,
        measure: "piece",
      },
      {
        name: "test ingredient 2",
        amount: 2,
        measure: "kg",
      },
    ],
  },
];

describe("recipes handler", () => {
  let mongoose: typeof import("mongoose");
  let mockServer: MongoMemoryServer;

  beforeAll(async () => {
    mockServer = await MongoMemoryServer.create();
    mongoose = await connect(mockServer.getUri(), { dbName: "recipe-test-db" });
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mockServer.stop();
  });

  afterEach(async () => {
    await mongoose.connection.db.dropDatabase();
  });

  describe("GET /recipes", () => {
    test("should return all recipes", async () => {
      recipeFixtures.forEach(async (data) => await recipe.create(data));

      const response = await request(app)
        .get("/v1/recipes")
        .set("Accept", "application/json");

      expect(response.status).toEqual(200);
      expect(response.body).toEqual([
        expect.objectContaining({
          id: expect.any(String),
          ...recipeFixtures[0],
        }),
        expect.objectContaining({
          id: expect.any(String),
          ...recipeFixtures[1],
        }),
      ]);
    });
  });

  describe("GET /recipes/:recipeId", () => {
    test("should return recipe when existing", async () => {
      const recipeData = await recipe.create(recipeFixtures[0]);

      const response = await request(app)
        .get(`/v1/recipes/${recipeData.id}`)
        .set("Accept", "application/json");

      expect(response.status).toEqual(200);
      expect(response.body).toEqual(
        expect.objectContaining({
          id: recipeData.id,
          ...recipeFixtures[0],
        })
      );
    });

    test("should return 404 status with proper error message when recipe does not exist", async () => {
      const someNonExistingRecipeId = "629c6565cec051d448a35575";
      const response = await request(app)
        .get(`/v1/recipes/${someNonExistingRecipeId}`)
        .set("Accept", "application/json");

      expect(response.status).toEqual(404);
      expect(response.body).toEqual({ error: "Recipe not found" });
    });
  });

  describe("POST /recipes", () => {
    test("should create recipe", async () => {
      const response = await request(app)
        .post("/v1/recipes")
        .send(recipeFixtures[0])
        .set("Accept", "application/json");

      expect(response.status).toEqual(201);
      expect(response.body).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          ...recipeFixtures[0],
        })
      );
    });

    test("should return 422 when invalid input is provided", async () => {
      const { name, ...fixtureWithoutName } = recipeFixtures[0];

      const response = await request(app)
        .post("/v1/recipes")
        .send(fixtureWithoutName)
        .set("Accept", "application/json");

      expect(response.status).toEqual(422);
    });
  });

  describe("PUT /recipes/:recipeId", () => {
    test("should update recipe", async () => {
      const { id } = await recipe.create(recipeFixtures[0]);

      const response = await request(app)
        .put(`/v1/recipes/${id}`)
        .send(recipeFixtures[1])
        .set("Accept", "application/json");

      expect(response.status).toEqual(204);

      const updatedRecipe = await recipe.findById(id);
      expect(updatedRecipe).toMatchObject(recipeFixtures[1]);
    });

    test("should return 404 status with proper error message when recipe does not exist", async () => {
      const someNonExistingRecipeId = "629c6565cec051d448a35575";
      const response = await request(app)
        .put(`/v1/recipes/${someNonExistingRecipeId}`)
        .send(recipeFixtures[1])
        .set("Accept", "application/json");

      expect(response.status).toEqual(404);
      expect(response.body).toEqual({ error: "Recipe not found" });
    });

    test("should return 422 when invalid input is provided", async () => {
      const { id } = await recipe.create(recipeFixtures[0]);
      const { name, ...fixtureWithoutName } = recipeFixtures[0];

      const response = await request(app)
        .put(`/v1/recipes/${id}`)
        .send(fixtureWithoutName)
        .set("Accept", "application/json");

      expect(response.status).toEqual(422);
    });
  });

  describe("DELETE /recipes/:recipeId", () => {
    test("should delete recipe", async () => {
      const { id } = await recipe.create(recipeFixtures[0]);

      const response = await request(app)
        .delete(`/v1/recipes/${id}`)
        .set("Accept", "application/json");

      expect(response.status).toEqual(204);

      const deletedRecipe = await recipe.findById(id);
      expect(deletedRecipe).toEqual(null);
    });

    test("should return 404 status with proper error message when recipe does not exist", async () => {
      const someNonExistingRecipeId = "629c6565cec051d448a35575";
      const response = await request(app)
        .delete(`/v1/recipes/${someNonExistingRecipeId}`)
        .set("Accept", "application/json");

      expect(response.status).toEqual(404);
      expect(response.body).toEqual({ error: "Recipe not found" });
    });
  });
});
