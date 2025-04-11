const request = require("supertest");
const app = require("../index");
const { User, Game, Wishlist } = require("../models");
const { signToken, verifyToken } = require("../helpers/jwt");
const { comparePass } = require("../helpers/bcrypt");
const { GoogleGenAI } = require("@google/genai");

jest.mock("../models", () => ({
    User: {
        create: jest.fn(),
        findOne: jest.fn(),
        findByPk: jest.fn(),
        findAll: jest.fn(), // Add findAll for User
        update: jest.fn(),
        destroy: jest.fn(),
    },
    Wishlist: {
        findAll: jest.fn(), // Add findAll for Wishlist
        findOne: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        destroy: jest.fn(),
    },
    Game: {
        findAndCountAll: jest.fn(),
        findByPk: jest.fn(),
        findAll: jest.fn(),
        getPublicGames: jest.fn(),
        findOne: jest.fn(), // Add findOne for Game
    },
}));
jest.mock("../helpers/jwt", () => ({
    signToken: jest.fn(),
    verifyToken: jest.fn() // Mock verifyToken
}));
jest.mock("../helpers/bcrypt", () => ({ comparePass: jest.fn() }));
jest.mock("@google/genai");

let userToken;
let mockUser = { id: 1, username: "testuser", email: "test@example.com", password: "password123" };
let token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzQ0Mjg3NzI1fQ.KSKbe_Jy_0joN28MJvS20dwYOyzZHDMMHGSNQnDBDj8";

beforeEach(() => {
    jest.clearAllMocks();
    signToken.mockReturnValue(token);
    verifyToken.mockReturnValue({ id: mockUser.id });
    User.findByPk.mockResolvedValue(mockUser);
    userToken = signToken({ id: mockUser.id });
});


describe("User Controller Tests", () => {
  test("should register a new user", async () => {
    User.create.mockResolvedValue(mockUser);
    const res = await request(app).post("/register").send({
      username: "testuser",
      email: "test@example.com",
      password: "password123",
    });
    expect(res.statusCode).toBe(201);
    expect(res.body.username).toBe("testuser");
  });

  test("should return 400 for invalid registration data", async () => {
    User.create.mockRejectedValue({ name: "ValidationError", message: "Invalid input" }); // Mock validation error
    const res = await request(app).post("/register").send({
        username: "",
        email: "invalid-email",
        password: "123",
    });
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Username, Email or Password is empty!");
  });

  test("should return 500 for server error during registration", async () => {
    User.create.mockRejectedValue(new Error("Internal server error")); // Simulate server error
    const res = await request(app).post("/register").send({
      username: "testuser",
      email: "test@example.com",
      password: "password123",
    });
    expect(res.statusCode).toBe(500);
    expect(res.body.message).toBe("Internal server error");
  });

  test("should return 400 for missing fields during registration", async () => {
    const res = await request(app).post("/register").send({
      username: "",
      email: "",
      password: "",
    });
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Username, Email or Password is empty!");
  });

  test("should return 400 for duplicate email during registration", async () => {
    User.create.mockRejectedValue({
      name: "SequelizeUniqueConstraintError",
      errors: [{ message: "Email already exists" }],
    }); // Simulate unique constraint error
    const res = await request(app).post("/register").send({
      username: "testuser",
      email: "duplicate@example.com",
      password: "password123",
    });
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Email already exists");
  });

  test("should login a user", async () => {
    User.findOne.mockResolvedValue(mockUser);
    comparePass.mockReturnValue(true);
    const res = await request(app).post("/login").send({
      username: "testuser",
      password: "password123",
    });
    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBe(token);
  });

  test("should return 401 for invalid login credentials", async () => {
    User.findOne.mockResolvedValue(null);
    const res = await request(app).post("/login").send({
      username: "nonexistentuser",
      password: "wrongpassword",
    });
    expect(res.statusCode).toBe(401);
  });

  test("should return 500 for server error during login", async () => {
    User.findOne.mockRejectedValue(new Error("Internal server error")); // Simulate server error
    const res = await request(app).post("/login").send({
      username: "testuser",
      password: "password123",
    });
    expect(res.statusCode).toBe(500);
    expect(res.body.message).toBe("Internal server error");
  });

  test("should return 401 for incorrect password during login", async () => {
    User.findOne.mockResolvedValue(mockUser);
    comparePass.mockReturnValue(false); // Simulate incorrect password
    const res = await request(app).post("/login").send({
      username: "testuser",
      password: "wrongpassword",
    });
    expect(res.statusCode).toBe(401);
    expect(res.body.message).toBe("Invalid Username/Password!");
  });

  test("should return user details", async () => {
    User.findOne.mockResolvedValue(mockUser);
    const res = await request(app)
      .get("/user/detail")
      .set("Authorization", `Bearer ${userToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.username).toBe("testuser");
  });

  test("should return 404 for user not found in details", async () => {
    User.findOne.mockResolvedValue(null); // User not found
    const res = await request(app)
      .get("/user/detail")
      .set("Authorization", `Bearer ${userToken}`);
    expect(res.statusCode).toBe(404);
  });

  test("should return 500 for server error during user details retrieval", async () => {
    User.findOne.mockRejectedValue(new Error("Internal server error")); // Simulate server error
    const res = await request(app)
      .get("/user/detail")
      .set("Authorization", `Bearer ${userToken}`);
    expect(res.statusCode).toBe(500);
    expect(res.body.message).toBe("Internal server error");
  });

  test("should return 401 for missing token during user details retrieval", async () => {
    const res = await request(app).get("/user/detail"); // No Authorization header
    expect(res.statusCode).toBe(401);
    expect(res.body.message).toBe("Unauthorized access");
  });

  test("should return 401 for invalid token during user details retrieval", async () => {
    verifyToken.mockImplementation(() => {
      throw { name: "JsonWebTokenError", message: "Invalid token" };
    }); // Simulate invalid token error
    const res = await request(app)
      .get("/user/detail")
      .set("Authorization", "Bearer invalidtoken");
    expect(res.statusCode).toBe(401);
    expect(res.body.message).toBe("Invalid token");
  });

  it("should update user preferences", async () => {
    User.update.mockResolvedValue([1]);
    const res = await request(app)
      .post("/user/addPreferences")
      .send({ preferedCategory: "Action", hatedCategory: "Horror" })
      .set("Authorization", `Bearer ${userToken}`);
    expect(res.statusCode).toBe(200);
  });

  it("should return 400 for invalid user preferences", async () => {
    User.update.mockResolvedValue([0]); // Simulate no rows updated
    const res = await request(app)
      .post("/user/addPreferences")
      .send({ preferedCategory: "", hatedCategory: "" }) // Invalid data
      .set("Authorization", `Bearer ${userToken}`);
    expect(res.statusCode).toBe(400);
  });

  test("should return 500 for server error during user preferences update", async () => {
    User.update.mockRejectedValue(new Error("Internal server error")); // Simulate server error
    const res = await request(app)
      .post("/user/addPreferences")
      .send({ preferedCategory: "Action", hatedCategory: "Horror" })
      .set("Authorization", `Bearer ${userToken}`);
    expect(res.statusCode).toBe(500);
    expect(res.body.message).toBe("Internal server error");
  });

  it("should delete a user account", async () => {
    User.destroy.mockResolvedValue(1);
    const res = await request(app)
      .delete("/user/delete")
      .set("Authorization", `Bearer ${userToken}`);
    expect(res.statusCode).toBe(200);
  });

  it("should handle errors when deleting a user account", async () => {
    User.destroy.mockRejectedValue(new Error("Database error")); // Simulate error
    const res = await request(app)
      .delete("/user/delete")
      .set("Authorization", `Bearer ${userToken}`);
    expect(res.statusCode).toBe(500);
  });

  test("should return 500 for server error during user deletion", async () => {
    User.destroy.mockRejectedValue(new Error("Internal server error")); // Simulate server error
    const res = await request(app)
      .delete("/user/delete")
      .set("Authorization", `Bearer ${userToken}`);
    expect(res.statusCode).toBe(500);
    expect(res.body.message).toBe("Internal server error");
  });

  test("should return 400 for missing username during registration", async () => {
    const res = await request(app).post("/register").send({
      username: "",
      email: "test@example.com",
      password: "password123",
    });
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Username, Email or Password is empty!");
  });

  test("should return 400 for missing password during login", async () => {
    const res = await request(app).post("/login").send({
      username: "testuser",
      password: "",
    });
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Username or Password is empty!");
  });

  test("should return 400 for missing username during login", async () => {
    const res = await request(app).post("/login").send({
      username: "",
      password: "password123",
    });
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Username or Password is empty!");
  });

  test("should return 500 for unexpected error during user details retrieval", async () => {
    User.findOne.mockRejectedValue(new Error("Internal server error")); // Simulate unexpected error
    const res = await request(app)
      .get("/user/detail")
      .set("Authorization", `Bearer ${userToken}`);
    expect(res.statusCode).toBe(500);
    expect(res.body.message).toBe("Internal server error");
  });

  test("should return 500 for unexpected error during preferences update", async () => {
    User.update.mockRejectedValue(new Error("Internal server error")); // Simulate unexpected error
    const res = await request(app)
      .post("/user/addPreferences")
      .send({ preferedCategory: "Action", hatedCategory: "Horror" })
      .set("Authorization", `Bearer ${userToken}`);
    expect(res.statusCode).toBe(500);
    expect(res.body.message).toBe("Internal server error");
  });

  test("should return 500 for unexpected error during user deletion", async () => {
    User.destroy.mockRejectedValue(new Error("Internal server error")); // Simulate unexpected error
    const res = await request(app)
      .delete("/user/delete")
      .set("Authorization", `Bearer ${userToken}`);
    expect(res.statusCode).toBe(500);
    expect(res.body.message).toBe("Internal server error");
  });

  test("should return 400 for empty request body during login", async () => {
    const res = await request(app).post("/login").send({});
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Username or Password is empty!");
  });

  test("should return 500 for unexpected error during registration", async () => {
    User.create.mockRejectedValue(new Error("Internal server error")); // Simulate unexpected error
    const res = await request(app).post("/register").send({
      username: "testuser",
      email: "test@example.com",
      password: "password123",
    });
    expect(res.statusCode).toBe(500);
    expect(res.body.message).toBe("Internal server error");
  });

  test("should return 500 for unexpected error during login", async () => {
    User.findOne.mockRejectedValue(new Error("Internal server error")); // Simulate unexpected error
    const res = await request(app).post("/login").send({
      username: "testuser",
      password: "password123",
    });
    expect(res.statusCode).toBe(500);
    expect(res.body.message).toBe("Internal server error");
  });

  test("should return 400 for invalid category values during preferences update", async () => {
    const res = await request(app)
      .post("/user/addPreferences")
      .send({ preferedCategory: "", hatedCategory: "" }) // Invalid values
      .set("Authorization", `Bearer ${userToken}`);
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("No preference provided!");
  });

  test("should return 500 for unexpected error during preferences update", async () => {
    User.update.mockRejectedValue(new Error("Internal server error")); // Simulate unexpected error
    const res = await request(app)
      .post("/user/addPreferences")
      .send({ preferedCategory: "Action", hatedCategory: "Horror" })
      .set("Authorization", `Bearer ${userToken}`);
    expect(res.statusCode).toBe(500);
    expect(res.body.message).toBe("Internal server error");
  });

  test("should return 500 for unexpected error during user deletion", async () => {
    User.destroy.mockRejectedValue(new Error("Internal server error")); // Simulate unexpected error
    const res = await request(app)
      .delete("/user/delete")
      .set("Authorization", `Bearer ${userToken}`);
    expect(res.statusCode).toBe(500);
    expect(res.body.message).toBe("Internal server error");
  });

  test("should return user details from getUser", async () => {
    const mockUser = { id: 1, username: "testuser" };
    const res = await request(app)
      .get("/user")
      .set("Authorization", `Bearer ${userToken}`); // Simulate authenticated request

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(mockUser);
  });
});

describe("Game Controller Tests", () => {
  const mockGame = { id: 1, name: "Test Game", description: "Test Description" };

  it("should fetch all games", async () => {
    Game.findAndCountAll.mockResolvedValue({ rows: [mockGame], count: 1 });
    const res = await request(app).get("/games");
    expect(res.statusCode).toBe(200);
    expect(res.body.count).toBe(1);
  });

  it("should fetch detailed game by ID", async () => {
    Game.findByPk.mockResolvedValue(mockGame);
    const res = await request(app).get("/games/1");
    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe("Test Game");
  });

  it("should return 404 if game not found", async () => {
    Game.findByPk.mockResolvedValue(null);
    const res = await request(app).get("/games/99");
    expect(res.statusCode).toBe(404);
  });

  it("should return 404 when fetching a game with an invalid ID", async () => {
    Game.findByPk.mockResolvedValue(null); // Simulate game not found
    const res = await request(app).get("/games/999");
    expect(res.statusCode).toBe(404);
  });

  it("should fetch public games with filters", async () => {
    Game.getPublicGames.mockResolvedValue({ rows: [mockGame], count: 1 });
    const res = await request(app).get("/public/games").query({ search: "Test" });
    expect(res.statusCode).toBe(200);
    expect(res.body.count).toBe(1);
  });

  it("should handle errors when fetching public games", async () => {
    Game.getPublicGames.mockRejectedValue(new Error("Database error")); // Simulate error
    const res = await request(app).get("/public/games");
    expect(res.statusCode).toBe(500);
  });

  it("should return AI recommendations", async () => {
    Game.findAll.mockResolvedValue([{ id: 1, name: "Test Game", genre1: "Action" }]);
    const mockAIResponse = {
      text: "1,2,3|||Ini adalah rekomendasi dari AI."
    };
    GoogleGenAI.mockImplementation(() => ({
      models: {
        generateContent: jest.fn().mockResolvedValue(mockAIResponse)
      }
    }));

    const res = await request(app)
      .post("/recommendation")
      .send({ genre: "Action", degenre: "Horror" })
      .set("Authorization", `Bearer ${userToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.games.length).toBe(3);
    expect(res.body.comment).toBe("Ini adalah rekomendasi dari AI.");
  });

  it("should return 500 for internal server error in game recommendation", async () => {
    Game.findAll.mockRejectedValue(new Error("Internal server error"));
    const res = await request(app)
      .post("/recommendation")
      .send({ genre: "Action", degenre: "Horror" })
      .set("Authorization", `Bearer ${userToken}`);
    expect(res.statusCode).toBe(500);
  });
});

describe("Wishlist Controller Tests", () => {
  const mockWishlist = { id: 1, userId: 1, gameId: 1, status: "Wishlist" };

  it("should fetch all wishlists", async () => {
    Wishlist.findAll.mockResolvedValue([mockWishlist]);
    const res = await request(app)
      .get("/wishlist")
      .set("Authorization", `Bearer ${userToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(1);
  });

  it("should return 500 for internal server error when fetching wishlist", async () => {
    Wishlist.findAll.mockRejectedValue(new Error("Internal server error"));
    const res = await request(app)
      .get("/wishlist")
      .set("Authorization", `Bearer ${userToken}`);
    expect(res.statusCode).toBe(500);
  });

  it("should add a game to wishlist", async () => {
    Game.findOne.mockResolvedValue({ id: 1 });
    Wishlist.findOne.mockResolvedValue(null);
    Wishlist.create.mockResolvedValue(mockWishlist);
    const res = await request(app)
      .post("/games/1/wishlist")
      .set("Authorization", `Bearer ${userToken}`);
    expect(res.statusCode).toBe(201);
  });

  it("should return 400 when adding a game to wishlist with invalid data", async () => {
    Game.findOne.mockResolvedValue(null);
    const res = await request(app)
      .post("/games/1/wishlist")
      .set("Authorization", `Bearer ${userToken}`);
    expect(res.statusCode).toBe(400);
  });

  it("should return 500 when an error occurs while adding a game to wishlist", async () => {
    Game.findOne.mockResolvedValue({ id: 1 });
    Wishlist.findOne.mockRejectedValue(new Error("Internal server error")); // Simulate error
    const res = await request(app)
      .post("/games/1/wishlist")
      .set("Authorization", `Bearer ${userToken}`);
    expect(res.statusCode).toBe(500);
  });

  it("should delete a wishlist item", async () => {
    Wishlist.findOne.mockResolvedValue(mockWishlist); // Ensure findOne returns the mockWishlist
    Wishlist.destroy.mockResolvedValue(1); // Ensure destroy returns 1 (success)

    const res = await request(app)
        .delete("/games/1/wishlist")
        .set("Authorization", `Bearer ${userToken}`);
    expect(res.statusCode).toBe(200);
  });

  it("should return 404 when deleting a non-existent wishlist item", async () => {
    Wishlist.findOne.mockResolvedValue(null); // Wishlist item not found
    const res = await request(app)
      .delete("/games/1/wishlist")
      .set("Authorization", `Bearer ${userToken}`);
    expect(res.statusCode).toBe(404);
  });

  it("should return 500 when an error occurs while deleting a wishlist item", async () => {
    Wishlist.findOne.mockResolvedValue(mockWishlist);
    Wishlist.destroy.mockRejectedValue(new Error("Internal server error")); // Simulate error
    const res = await request(app)
      .delete("/games/1/wishlist")
      .set("Authorization", `Bearer ${userToken}`);
    expect(res.statusCode).toBe(500);
  });

  it("should mark a wishlist item as bought", async () => {
    Wishlist.findOne.mockResolvedValue(mockWishlist);
    Wishlist.update.mockResolvedValue([1]);
    const res = await request(app)
      .patch("/wishlist/1/bought")
      .set("Authorization", `Bearer ${userToken}`);
    expect(res.statusCode).toBe(200);
  });

  it("should return 500 when an error occurs while marking a wishlist item as bought", async () => {
    Wishlist.findOne.mockResolvedValue(mockWishlist);
    Wishlist.update.mockRejectedValue(new Error("Internal server error")); // Simulate error
    const res = await request(app)
      .patch("/wishlist/1/bought")
      .set("Authorization", `Bearer ${userToken}`);
    expect(res.statusCode).toBe(500);
  });

  it("should add a comment to a wishlist item", async () => {
    Wishlist.findOne.mockResolvedValue({ ...mockWishlist, isComment: false });
    Wishlist.update.mockResolvedValue([1]);
    const res = await request(app)
      .post("/games/1/comment")
      .send({ comment: "Great game!", rating: 5 })
      .set("Authorization", `Bearer ${userToken}`);
    expect(res.statusCode).toBe(200);
  });

  it("should return 400 for invalid wishlist comment data", async () => {
    Wishlist.findOne.mockResolvedValue(mockWishlist);
    Wishlist.update.mockRejectedValue(new Error("Validation error"));
    const res = await request(app)
      .post("/games/1/comment")
      .send({ comment: "", rating: 10 }) // Invalid comment and rating
      .set("Authorization", `Bearer ${userToken}`);
    expect(res.statusCode).toBe(400);
  });

  it("should return 500 when an error occurs while adding a comment to a wishlist item", async () => {
    Wishlist.findOne.mockResolvedValue(mockWishlist);
    Wishlist.update.mockRejectedValue(new Error("Internal server error")); // Simulate error
    const res = await request(app)
      .post("/games/1/comment")
      .send({ comment: "Great game!", rating: 5 })
      .set("Authorization", `Bearer ${userToken}`);
    expect(res.statusCode).toBe(500);
  });

  it("should fetch a comment for a wishlist item", async () => {
    Wishlist.findOne.mockResolvedValue({ ...mockWishlist, comment: "Great game!", rating: 5 });
    const res = await request(app)
      .get("/games/1/comment")
      .set("Authorization", `Bearer ${userToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.comment).toBe("Great game!");
  });

  it("should return 500 when an error occurs while fetching a wishlist comment", async () => {
    Wishlist.findOne.mockRejectedValue(new Error("Internal server error")); // Simulate error
    const res = await request(app)
      .get("/games/1/comment")
      .set("Authorization", `Bearer ${userToken}`);
    expect(res.statusCode).toBe(500);
  });
});

describe("Authentication Middleware Tests", () => {
  it("should return 401 if no authorization header is provided", async () => {
    const res = await request(app).get("/user/detail"); // No Authorization header
    expect(res.statusCode).toBe(401);
  });
});
