const skillController = require("../controllers/skillController");
const { Skill } = require("../models/Skill");
const axios = require("axios");
const {
  formatCurrentSkillsData,
  formatTopSkillsData,
} = require("../helpers/dataProcessor");

// Mock dependencies
jest.mock("../models/Skill");
jest.mock("axios");
jest.mock("../helpers/dataProcessor");

// Helper to mock res
const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("Skill Controller Unit Tests", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("createSkill", () => {
    it("should create a new skill", async () => {
      const req = { body: { name: "Node.js" } };
      const res = mockRes();
      const mockSkill = { id: 1, name: "Node.js" };

      Skill.create.mockResolvedValue(mockSkill);

      await skillController.createSkill(req, res);

      expect(Skill.create).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockSkill);
    });
  });

  describe("getSkillById", () => {
    it("should return a skill by ID", async () => {
      const req = { params: { id: "1" } };
      const res = mockRes();
      const mockSkill = { id: 1, name: "React" };

      Skill.getOneById.mockResolvedValue(mockSkill);

      await skillController.getSkillById(req, res);

      expect(Skill.getOneById).toHaveBeenCalledWith("1");
      expect(res.json).toHaveBeenCalledWith(mockSkill);
    });
  });

  describe("searchSkills", () => {
    it("should return matching skills", async () => {
      const req = { query: { q: "react" } };
      const res = mockRes();
      const mockResults = [{ id: 1, name: "React" }];

      Skill.search.mockResolvedValue(mockResults);

      await skillController.searchSkills(req, res);

      expect(Skill.search).toHaveBeenCalledWith("react");
      expect(res.json).toHaveBeenCalledWith(mockResults);
    });
  });

  describe("getUserSkills", () => {
    it("should return 400 if user ID is invalid", async () => {
      const req = { params: { userId: "abc" } };
      const res = mockRes();

      await skillController.getUserSkills(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: "Invalid user ID" });
    });

    it("should return skills for a valid user", async () => {
      const req = { params: { userId: "1" } };
      const res = mockRes();
      const mockSkills = [{ name: "JavaScript" }];

      Skill.getUserSkills.mockResolvedValue(mockSkills);

      await skillController.getUserSkills(req, res);

      expect(Skill.getUserSkills).toHaveBeenCalledWith(1);
      expect(res.json).toHaveBeenCalledWith(mockSkills);
    });
  });

  describe("currentUserSkillsInfo", () => {
    it("should return skill visualisation for user", async () => {
      const req = { params: { userId: "1" } };
      const res = mockRes();
      const skillsData = [{ skill: "JavaScript", level: 5 }];
      const formatted = { labels: ["JavaScript"], values: [5] };

      Skill.getCurrentSkillsInfo.mockResolvedValue(skillsData);
      formatCurrentSkillsData.mockReturnValue(formatted);
      axios.post.mockResolvedValue({ data: { chart: "mockChart" } });

      await skillController.currentUserSkillsInfo(req, res);

      expect(Skill.getCurrentSkillsInfo).toHaveBeenCalledWith("1");
      expect(formatCurrentSkillsData).toHaveBeenCalledWith(skillsData);
      expect(axios.post).toHaveBeenCalledWith(
        "http://localhost:3005/current-skills-chart",
        formatted
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        visualisation: { chart: "mockChart" },
      });
    });
  });

  describe("topSkillsInfo", () => {
    it("should return visualisation for top skills", async () => {
      const req = {};
      const res = mockRes();
      const skillsData = [{ skill: "Python", popularity: 80 }];
      const formatted = { labels: ["Python"], values: [80] };

      Skill.getTopSkillsInfo.mockResolvedValue(skillsData);
      formatTopSkillsData.mockReturnValue(formatted);
      axios.post.mockResolvedValue({ data: { chart: "topMockChart" } });

      await skillController.topSkillsInfo(req, res);

      expect(Skill.getTopSkillsInfo).toHaveBeenCalled();
      expect(formatTopSkillsData).toHaveBeenCalledWith(skillsData);
      expect(axios.post).toHaveBeenCalledWith(
        "http://localhost:3005/top-skills-chart",
        formatted
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        visualisation: { chart: "topMockChart" },
      });
    });
  });
});
