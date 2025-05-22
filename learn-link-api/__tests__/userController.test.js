const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userController = require("../controllers/userController");
const { User } = require("../models/User");

jest.mock("../models/User");
jest.mock("bcrypt");
jest.mock("jsonwebtoken");

describe("userController", () => {
  let req, res;

  beforeEach(() => {
    req = { body: {}, params: {}, query: {}, user: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.clearAllMocks();
  });

  describe("register", () => {
    it("creates user, generates token, returns 201", async () => {
      req.body = { email: "test@example.com", password: "pass" };
      bcrypt.genSalt.mockResolvedValue("salt");
      bcrypt.hash.mockResolvedValue("hashedPass");
      User.create.mockResolvedValue({ user_id: 1, email: "test@example.com" });
      jwt.sign.mockImplementation((payload, secret, options, cb) =>
        cb(null, "token123")
      );

      await userController.register(req, res);

      expect(bcrypt.genSalt).toHaveBeenCalled();
      expect(bcrypt.hash).toHaveBeenCalledWith("pass", "salt");
      expect(User.create).toHaveBeenCalledWith(
        expect.objectContaining({
          email: "test@example.com",
          password: "hashedPass",
        })
      );
      expect(jwt.sign).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ token: "token123" });
    });

    it("returns 400 if error thrown", async () => {
      bcrypt.genSalt.mockRejectedValue(new Error("fail"));
      await userController.register(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: "fail" });
    });

    it("returns 500 if token generation fails", async () => {
      req.body = { email: "test@example.com", password: "pass" };
      bcrypt.genSalt.mockResolvedValue("salt");
      bcrypt.hash.mockResolvedValue("hashedPass");
      User.create.mockResolvedValue({ user_id: 1, email: "test@example.com" });
      jwt.sign.mockImplementation((payload, secret, options, cb) =>
        cb(new Error("token error"), null)
      );

      await userController.register(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: "Token generation failed",
      });
    });
  });

  describe("userLogin", () => {
    it("logs in user and returns token and user info", async () => {
      req.body = { email: "test@example.com", password: "pass" };
      const fakeUser = {
        user_id: 1,
        email: "test@example.com",
        password: "hashedPass",
      };
      User.getOneByEmail.mockResolvedValue(fakeUser);
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockImplementation((payload, secret, options, cb) =>
        cb(null, "token123")
      );

      await userController.userLogin(req, res);

      expect(User.getOneByEmail).toHaveBeenCalledWith("test@example.com");
      expect(bcrypt.compare).toHaveBeenCalledWith("pass", "hashedPass");
      expect(jwt.sign).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        token: "token123",
        user: { id: 1, email: "test@example.com" },
      });
    });

    it("returns 401 if no user found", async () => {
      req.body = { email: "notfound@example.com", password: "pass" };
      User.getOneByEmail.mockResolvedValue(null);

      await userController.userLogin(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        error: "No user with this email",
      });
    });

    it("returns 401 if password does not match", async () => {
      req.body = { email: "test@example.com", password: "wrongpass" };
      User.getOneByEmail.mockResolvedValue({
        user_id: 1,
        email: "test@example.com",
        password: "hashedPass",
      });
      bcrypt.compare.mockResolvedValue(false);

      await userController.userLogin(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        error: "User could not be authenticated",
      });
    });

    it("returns 401 if token generation error", async () => {
      req.body = { email: "test@example.com", password: "pass" };
      User.getOneByEmail.mockResolvedValue({
        user_id: 1,
        email: "test@example.com",
        password: "hashedPass",
      });
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockImplementation((payload, secret, options, cb) =>
        cb(new Error("token fail"), null)
      );

      await userController.userLogin(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        error: "Error in token generation",
      });
    });
  });

  describe("getProfile", () => {
    it("returns user profile if found", async () => {
      req.user = { user_id: 1 };
      User.getUserById.mockResolvedValue({
        first_name: "John",
        last_name: "Doe",
        email: "john@example.com",
        postcode: "12345",
      });

      await userController.getProfile(req, res);

      expect(User.getUserById).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        first_name: "John",
        last_name: "Doe",
        email: "john@example.com",
        postcode: "12345",
      });
    });

    it("returns 404 if user not found", async () => {
      req.user = { user_id: 1 };
      User.getUserById.mockResolvedValue(null);

      await userController.getProfile(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: "User not found." });
    });

    it("returns 500 on error", async () => {
      req.user = { user_id: 1 };
      User.getUserById.mockRejectedValue(new Error("fail"));

      await userController.getProfile(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: "Failed to get user profile.",
      });
    });
  });

  describe("getTopUsers", () => {
    it("returns top users", async () => {
      const topUsers = [{ user_id: 1, email: "a@example.com" }];
      User.getTopUsers.mockResolvedValue(topUsers);

      await userController.getTopUsers(req, res);

      expect(User.getTopUsers).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(topUsers);
    });

    it("returns 500 on error", async () => {
      User.getTopUsers.mockRejectedValue(new Error("fail"));

      await userController.getTopUsers(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: "Failed to fetch top users.",
      });
    });
  });

  describe("getUserById", () => {
    it("returns user info if found", async () => {
      req.params.userId = "1";
      User.getUserById.mockResolvedValue({
        user_id: 1,
        first_name: "John",
        last_name: "Doe",
        email: "john@example.com",
        postcode: "12345",
        profession: "Developer",
        location: "UK",
        website: "site.com",
        github: "github",
        twitter: "twitter",
        instagram: "instagram",
        facebook: "facebook",
      });

      await userController.getUserById(req, res);

      expect(User.getUserById).toHaveBeenCalledWith("1");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        id: 1,
        first_name: "John",
        last_name: "Doe",
        email: "john@example.com",
        postcode: "12345",
        profession: "Developer",
        location: "UK",
        website: "site.com",
        github: "github",
        twitter: "twitter",
        instagram: "instagram",
        facebook: "facebook",
      });
    });

    it("returns defaults for missing optional fields", async () => {
      req.params.userId = "1";
      User.getUserById.mockResolvedValue({
        user_id: 1,
        first_name: "John",
        last_name: "Doe",
        email: "john@example.com",
        postcode: "12345",
      });

      await userController.getUserById(req, res);

      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          profession: "N/A",
          location: "N/A",
          website: "N/A",
          github: "N/A",
          twitter: "N/A",
          instagram: "N/A",
          facebook: "N/A",
        })
      );
    });

    it("returns 404 if user not found", async () => {
      req.params.userId = "1";
      User.getUserById.mockResolvedValue(null);

      await userController.getUserById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: "User not found." });
    });

    it("returns 500 on error", async () => {
      req.params.userId = "1";
      User.getUserById.mockRejectedValue(new Error("fail"));

      await userController.getUserById(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: "Failed to fetch user details.",
      });
    });
  });

  describe("getUserByEmail", () => {
    it("returns user info if found", async () => {
      req.query.email = "test@example.com";
      User.getOneByEmail.mockResolvedValue({
        user_id: 1,
        email: "test@example.com",
      });

      await userController.getUserByEmail(req, res);

      expect(User.getOneByEmail).toHaveBeenCalledWith("test@example.com");
      expect(res.json).toHaveBeenCalledWith({
        id: 1,
        email: "test@example.com",
      });
    });

    it("returns 404 if not found", async () => {
      req.query.email = "notfound@example.com";
      User.getOneByEmail.mockResolvedValue(null);

      await userController.getUserByEmail(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: "User not found" });
    });

    it("returns 500 on error", async () => {
      req.query.email = "fail@example.com";
      User.getOneByEmail.mockRejectedValue(new Error("fail"));

      await userController.getUserByEmail(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: "Failed to fetch email ",
      });
    });
  });

  describe("getLastSessionSummary", () => {
    it("returns last session summary with formatted date", async () => {
      await userController.getLastSessionSummary(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalled();
      const arg = res.json.mock.calls[0][0];
      expect(arg.skill).toBe("Javascript");
      expect(typeof arg.date).toBe("string");
    });

    it("returns 500 on error", async () => {
      // Simulate error by temporarily mocking Date
      const originalDate = global.Date;
      global.Date = class {
        constructor() {
          throw new Error("fail");
        }
      };

      await userController.getLastSessionSummary(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: "Failed to last session summary.",
      });

      global.Date = originalDate;
    });
  });
});
