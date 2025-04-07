const request = require("supertest");
const app = require("../index"); // Adjust path if needed
const { User, Game, Wishlist } = require("../models");
const { signToken } = require("../helpers/jwt");
const { comparePass } = require("../helpers/bcrypt");

jest.mock("../models");
jest.mock("../helpers/jwt", () => ({ signToken: jest.fn() }));
jest.mock("../helpers/bcrypt", () => ({ comparePass: jest.fn() }));
jest.mock("../models");

let userToken;
let mockUser = { id: 1, username: "testuser", email: "test@example.com", password: "hashedpassword" };
let userMock = {
  id: 1,
  username: "testuser",
  email: "test@example.com",
  password: "hashedpassword",
  preferedCategory: "Action",
  hatedCategory: "Horror",
};

let token = "testtoken";

beforeEach(() => {
  jest.clearAllMocks();
  signToken.mockReturnValue(token);
  userToken = signToken({ id: mockUser.id });
});

describe("Game API Tests", () => {
  const mockGame = { id: 1, title: "Test Game", genre: "Action" };

  it("should fetch all games", async () => {
    db.Game.findAll.mockResolvedValue([mockGame]);

    const res = await request(app).get("/games");
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it("should fetch a single game by ID", async () => {
    db.Game.findByPk.mockResolvedValue(mockGame);

    const res = await request(app).get("/games/1");
    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe("Test Game");
  });

  it("should return 404 if game not found", async () => {
    db.Game.findByPk.mockResolvedValue(null);

    const res = await request(app).get("/games/99");
    expect(res.statusCode).toBe(404);
  });

  it("should create a new game", async () => {
    db.Game.create.mockResolvedValue(mockGame);

    const res = await request(app).post("/games").send(mockGame);
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("id");
  });

  it("should return 400 for invalid game data", async () => {
    const res = await request(app).post("/games").send({ title: "" });
    expect(res.statusCode).toBe(400);
  });

  it("should delete a game", async () => {
    db.Game.destroy.mockResolvedValue(1); // 1 means successful deletion

    const res = await request(app).delete("/games/1");
    expect(res.statusCode).toBe(200);
  });

  it("should return 404 when deleting non-existing game", async () => {
    db.Game.destroy.mockResolvedValue(0); // 0 means nothing deleted

    const res = await request(app).delete("/games/99");
    expect(res.statusCode).toBe(404);
  });

  it("should return 401 for unauthorized game creation", async () => {
    const res = await request(app).post("/games").send(mockGame);
    expect(res.statusCode).toBe(401);
  });

  it("should return 500 for server error during game creation", async () => {
    db.Game.create.mockRejectedValue(new Error("Server error"));
    const res = await request(app)
      .post("/games")
      .send(mockGame)
      .set("Authorization", `Bearer ${userToken}`);
    expect(res.statusCode).toBe(500);
  });
});

describe("User API Tests", () => {
  const mockUser = { id: 1, username: "testuser", email: "test@example.com" };

  it("should create a new user", async () => {
    db.User.create.mockResolvedValue(mockUser);

    const res = await request(app).post("/users").send(mockUser);
    expect(res.statusCode).toBe(201);
    expect(res.body.username).toBe("testuser");
  });

  it("should return 400 for invalid user data", async () => {
    const res = await request(app).post("/users").send({ email: "" });
    expect(res.statusCode).toBe(400);
  });

  it("should get user by ID", async () => {
    db.User.findByPk.mockResolvedValue(mockUser);

    const res = await request(app).get("/users/1");
    expect(res.statusCode).toBe(200);
    expect(res.body.username).toBe("testuser");
  });

  it("should return 404 if user not found", async () => {
    db.User.findByPk.mockResolvedValue(null);

    const res = await request(app).get("/users/99");
    expect(res.statusCode).toBe(404);
  });

  it("should return 500 for server error during user creation", async () => {
    db.User.create.mockRejectedValue(new Error("Server error"));
    const res = await request(app).post("/users").send(mockUser);
    expect(res.statusCode).toBe(500);
  });

  it("should return 401 for unauthorized user detail access", async () => {
    const res = await request(app).get("/user/detail");
    expect(res.statusCode).toBe(401);
  });
});

describe("Wishlist API Tests", () => {
  const mockWishlist = { id: 1, userId: 1, gameId: 2 };

  it("should fetch all wishlists", async () => {
    db.Wishlist.findAll.mockResolvedValue([mockWishlist]);

    const res = await request(app).get("/wishlist");
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it("should add a game to wishlist", async () => {
    db.Wishlist.create.mockResolvedValue(mockWishlist);

    const res = await request(app).post("/wishlist").send(mockWishlist);
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("id");
  });

  it("should return 400 for missing fields in wishlist", async () => {
    const res = await request(app).post("/wishlist").send({});
    expect(res.statusCode).toBe(400);
  });

  it("should delete a wishlist item", async () => {
    db.Wishlist.destroy.mockResolvedValue(1);

    const res = await request(app).delete("/wishlist/1");
    expect(res.statusCode).toBe(200);
  });

  it("should return 404 when deleting non-existing wishlist item", async () => {
    db.Wishlist.destroy.mockResolvedValue(0);

    const res = await request(app).delete("/wishlist/99");
    expect(res.statusCode).toBe(404);
  });

  it("should return 500 for server error during wishlist creation", async () => {
    db.Wishlist.create.mockRejectedValue(new Error("Server error"));
    const res = await request(app)
      .post("/wishlist")
      .send(mockWishlist)
      .set("Authorization", `Bearer ${userToken}`);
    expect(res.statusCode).toBe(500);
  });

  it("should return 401 for unauthorized wishlist access", async () => {
    const res = await request(app).get("/wishlist");
    expect(res.statusCode).toBe(401);
  });
});

describe("User Controller Tests", () => {
  test("POST /register - success", async () => {
    User.create.mockResolvedValue(userMock);
    const res = await request(app).post("/register").send({
      username: "testuser",
      email: "test@example.com",
      password: "password123",
    });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("username", "testuser");
  });

  test("POST /login - success", async () => {
    User.findOne.mockResolvedValue(userMock);
    comparePass.mockReturnValue(true);
    const res = await request(app).post("/login").send({
      username: "testuser",
      password: "password123",
    });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token", token);
  });

  test("POST /login - invalid credentials", async () => {
    User.findOne.mockResolvedValue(null);
    const res = await request(app).post("/login").send({
      username: "wronguser",
      password: "wrongpass",
    });
    expect(res.status).toBe(401);
  });

  test("GET /user/detail - success", async () => {
    User.findOne.mockResolvedValue(userMock);
    const res = await request(app)
      .get("/user/detail")
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("email", "test@example.com");
  });

  test("GET /user - success", async () => {
    const res = await request(app)
      .get("/user")
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("username", "testuser");
  });

  test("POST /user/addPreferences - success", async () => {
    User.update.mockResolvedValue([1]);
    const res = await request(app)
      .post("/user/addPreferences")
      .send({ preferedCategory: "RPG", hatedCategory: "Horror" })
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("message", "User preference has been updated!");
  });

  test("DELETE /user/delete - success", async () => {
    User.destroy.mockResolvedValue(1);
    const res = await request(app)
      .delete("/user/delete")
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("message", "Account has been deleted!");
  });

  test("POST /login - server error", async () => {
    User.findOne.mockRejectedValue(new Error("Server error"));
    const res = await request(app).post("/login").send({
      username: "testuser",
      password: "password123",
    });
    expect(res.status).toBe(500);
  });

  test("GET /user/detail - server error", async () => {
    User.findOne.mockRejectedValue(new Error("Server error"));
    const res = await request(app)
      .get("/user/detail")
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(500);
  });

  test("POST /register - invalid data", async () => {
    User.create.mockRejectedValue(new Error("Validation error"));
    const res = await request(app).post("/register").send({
      username: "",
      email: "invalid-email",
      password: "short",
    });
    expect(res.status).toBe(400);
  });

  test("POST /login - missing fields", async () => {
    const res = await request(app).post("/login").send({
      username: "",
      password: "",
    });
    expect(res.status).toBe(400);
  });

  test("GET /user/detail - unauthorized access", async () => {
    const res = await request(app).get("/user/detail");
    expect(res.status).toBe(401);
  });

  test("POST /user/addPreferences - invalid data", async () => {
    User.update.mockResolvedValue([0]); // No rows updated
    const res = await request(app)
      .post("/user/addPreferences")
      .send({ preferedCategory: "", hatedCategory: "" })
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(400);
  });

  test("DELETE /user/delete - unauthorized access", async () => {
    const res = await request(app).delete("/user/delete");
    expect(res.status).toBe(401);
  });
});

describe("User Routes", () => {
  test("POST /register - should register user", async () => {
    User.create.mockResolvedValue(mockUser);
    const res = await request(app).post("/register").send({ username: "testuser", email: "test@example.com", password: "password123" });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("username", "testuser");
  });

  test("POST /login - should login user", async () => {
    User.findOne.mockResolvedValue(mockUser);
    comparePass.mockReturnValue(true);
    const res = await request(app).post("/login").send({ username: "testuser", password: "password123" });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token");
  });
});

describe("Game Routes", () => {
  test("GET /games - should get all games", async () => {
    Game.findAndCountAll.mockResolvedValue({ rows: [], count: 0 });
    const res = await request(app).get("/games");
    expect(res.status).toBe(200);
  });

  test("GET /games/:gameId - should get game details", async () => {
    Game.findByPk.mockResolvedValue(null);
    const res = await request(app).get("/games/1");
    expect(res.status).toBe(200);
  });

  test("GET /games/:gameId - server error", async () => {
    Game.findByPk.mockRejectedValue(new Error("Server error"));
    const res = await request(app).get("/games/1");
    expect(res.status).toBe(500);
  });

  test("POST /games - missing fields", async () => {
    const res = await request(app)
      .post("/games")
      .send({ title: "" })
      .set("Authorization", `Bearer ${userToken}`);
    expect(res.status).toBe(400);
  });

  test("DELETE /games/:id - unauthorized access", async () => {
    const res = await request(app).delete("/games/1");
    expect(res.status).toBe(401);
  });

  test("GET /games/:id - invalid ID format", async () => {
    const res = await request(app).get("/games/invalid-id");
    expect(res.status).toBe(400);
  });
});

describe("Wishlist Routes", () => {
  test("POST /games/:gameId/wishlist - should add to wishlist", async () => {
    Game.findOne.mockResolvedValue({ id: 1, name: "Test Game" });
    Wishlist.findOne.mockResolvedValue(null);
    Wishlist.create.mockResolvedValue({});
    const res = await request(app)
      .post("/games/1/wishlist")
      .set("Authorization", `Bearer ${userToken}`);
    expect(res.status).toBe(201);
  });

  test("DELETE /games/:gameId/wishlist - should remove from wishlist", async () => {
    Wishlist.findOne.mockResolvedValue({ id: 1 });
    Wishlist.destroy.mockResolvedValue(1);
    const res = await request(app)
      .delete("/games/1/wishlist")
      .set("Authorization", `Bearer ${userToken}`);
    expect(res.status).toBe(200);
  });

  test("POST /games/:gameId/wishlist - server error", async () => {
    Wishlist.create.mockRejectedValue(new Error("Server error"));
    const res = await request(app)
      .post("/games/1/wishlist")
      .set("Authorization", `Bearer ${userToken}`);
    expect(res.status).toBe(500);
  });

  test("DELETE /games/:gameId/wishlist - server error", async () => {
    Wishlist.destroy.mockRejectedValue(new Error("Server error"));
    const res = await request(app)
      .delete("/games/1/wishlist")
      .set("Authorization", `Bearer ${userToken}`);
    expect(res.status).toBe(500);
  });

  test("POST /wishlist - duplicate entry", async () => {
    Wishlist.findOne.mockResolvedValue({ id: 1 });
    const res = await request(app)
      .post("/wishlist")
      .send({ userId: 1, gameId: 2 })
      .set("Authorization", `Bearer ${userToken}`);
    expect(res.status).toBe(400);
  });

  test("DELETE /wishlist/:id - invalid ID format", async () => {
    const res = await request(app)
      .delete("/wishlist/invalid-id")
      .set("Authorization", `Bearer ${userToken}`);
    expect(res.status).toBe(400);
  });

  test("GET /wishlist - unauthorized access", async () => {
    const res = await request(app).get("/wishlist");
    expect(res.status).toBe(401);
  });
});

describe("Game Controller Additional Tests", () => {
  test("PUT /games/:id - should update a game", async () => {
    Game.update.mockResolvedValue([1]); // 1 means successful update
    const res = await request(app)
      .put("/games/1")
      .send({ title: "Updated Game" })
      .set("Authorization", `Bearer ${userToken}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("message", "Game updated successfully!");
  });

  test("PUT /games/:id - game not found", async () => {
    Game.update.mockResolvedValue([0]); // 0 means no rows updated
    const res = await request(app)
      .put("/games/99")
      .send({ title: "Updated Game" })
      .set("Authorization", `Bearer ${userToken}`);
    expect(res.status).toBe(404);
  });

  test("PUT /games/:id - server error", async () => {
    Game.update.mockRejectedValue(new Error("Server error"));
    const res = await request(app)
      .put("/games/1")
      .send({ title: "Updated Game" })
      .set("Authorization", `Bearer ${userToken}`);
    expect(res.status).toBe(500);
  });
});

describe("User Controller Additional Tests", () => {
  test("GET /user - server error", async () => {
    User.findOne.mockRejectedValue(new Error("Server error"));
    const res = await request(app)
      .get("/user")
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(500);
  });

  test("POST /user/addPreferences - server error", async () => {
    User.update.mockRejectedValue(new Error("Server error"));
    const res = await request(app)
      .post("/user/addPreferences")
      .send({ preferedCategory: "RPG", hatedCategory: "Horror" })
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(500);
  });

  test("DELETE /user/delete - server error", async () => {
    User.destroy.mockRejectedValue(new Error("Server error"));
    const res = await request(app)
      .delete("/user/delete")
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(500);
  });
});

describe("Wishlist Controller Additional Tests", () => {
  test("POST /wishlist - server error", async () => {
    Wishlist.create.mockRejectedValue(new Error("Server error"));
    const res = await request(app)
      .post("/wishlist")
      .send({ userId: 1, gameId: 2 })
      .set("Authorization", `Bearer ${userToken}`);
    expect(res.status).toBe(500);
  });

  test("DELETE /wishlist/:id - server error", async () => {
    Wishlist.destroy.mockRejectedValue(new Error("Server error"));
    const res = await request(app)
      .delete("/wishlist/1")
      .set("Authorization", `Bearer ${userToken}`);
    expect(res.status).toBe(500);
  });

  test("GET /wishlist - server error", async () => {
    Wishlist.findAll.mockRejectedValue(new Error("Server error"));
    const res = await request(app)
      .get("/wishlist")
      .set("Authorization", `Bearer ${userToken}`);
    expect(res.status).toBe(500);
  });
});
