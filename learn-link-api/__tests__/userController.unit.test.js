const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../models/User");
const userController = require("../controllers/userController");

// Mock dependencies
jest.mock("bcrypt");
jest.mock("jsonwebtoken");
jest.mock("../models/User");

// Mock res
const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("User Controller Unit Tests", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("register", () => {
    it("should register a user and return a token", async () => {
      const req = {
        body: {
          first_name: "Alice",
          last_name: "Smith",
          email: "alice@example.com",
          password: "securepass",
          postcode: "12345",
        },
      };
      const res = mockRes();

      const salt = "salt";
      const hashedPassword = "hashedPassword";
      const mockUser = {
        user_id: 1,
        email: "alice@example.com",
      };

      bcrypt.genSalt.mockResolvedValue(salt);
      bcrypt.hash.mockResolvedValue(hashedPassword);
      User.create.mockResolvedValue(mockUser);
      jwt.sign.mockImplementation((payload, secret, opts, cb) =>
        cb(null, "mockToken")
      );

      await userController.register(req, res);

      expect(bcrypt.genSalt).toHaveBeenCalled();
      expect(bcrypt.hash).toHaveBeenCalledWith("securepass", salt);
      expect(User.create).toHaveBeenCalledWith({
        ...req.body,
        password: hashedPassword,
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ token: "mockToken" });
    });

    it("should handle token generation error", async () => {
      const req = { body: { email: "test@test.com", password: "pass" } };
      const res = mockRes();

      bcrypt.genSalt.mockResolvedValue("salt");
      bcrypt.hash.mockResolvedValue("hashed");
      User.create.mockResolvedValue({ user_id: 1, email: "test@test.com" });
      jwt.sign.mockImplementation((payload, secret, opts, cb) =>
        cb(new Error("Token error"), null)
      );

      await userController.register(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Token generation failed" });
    });
  });

  describe("userLogin", () => {
    it("should login a user and return a token", async () => {
      const req = {
        body: {
          email: "test@example.com",
          password: "password123",
        },
      };
      const res = mockRes();

      const user = {
        user_id: 1,
        email: "test@example.com",
        password: "hashedPassword",
      };

      User.getOneByEmail.mockResolvedValue(user);
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockImplementation((payload, secret, opts, cb) =>
        cb(null, "mockLoginToken")
      );

      await userController.userLogin(req, res);

      expect(User.getOneByEmail).toHaveBeenCalledWith("test@example.com");
      expect(bcrypt.compare).toHaveBeenCalledWith("password123", "hashedPassword");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        token: "mockLoginToken",
        user: {
          id: user.user_id,
          email: user.email,
        },
      });
    });

    it("should reject wrong password", async () => {
      const req = { body: { email: "test@test.com", password: "wrong" } };
      const res = mockRes();

      User.getOneByEmail.mockResolvedValue({ user_id: 1, email: "test@test.com", password: "hashed" });
      bcrypt.compare.mockResolvedValue(false);

      await userController.userLogin(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: "User could not be authenticated" });
    });

    it("should handle missing user", async () => {
      const req = { body: { email: "unknown@test.com", password: "pass" } };
      const res = mockRes();

      User.getOneByEmail.mockRejectedValue(new Error("No user with this email"));

      await userController.userLogin(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: "No user with this email" });
    });
  });

  describe("getProfile", () => {
    it("should return user profile", async () => {
      const req = { user: { user_id: 1 } };
      const res = mockRes();
      const user = {
        first_name: "John",
        last_name: "Doe",
        email: "john@example.com",
        postcode: "12345",
      };

      User.getUserById.mockResolvedValue(user);

      await userController.getProfile(req, res);

      expect(User.getUserById).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        postcode: user.postcode,
      });
    });

    it("should handle user not found", async () => {
      const req = { user: { user_id: 99 } };
      const res = mockRes();

      User.getUserById.mockResolvedValue(null);

      await userController.getProfile(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: "User not found." });
    });
  });
});
