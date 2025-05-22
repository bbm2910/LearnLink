const skillController = require("../controllers/skillController");
const { Skill } = require("../models/Skill");
const db = require("../database/connect");
const axios = require("axios");

jest.mock("../models/Skill");
jest.mock("../database/connect");
jest.mock("axios");

describe("skillController", () => {
  let res, req;

  beforeEach(() => {
    req = { params: {}, query: {}, body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.clearAllMocks();
  });

  describe("createSkill", () => {
    it("responds with 201 and new skill on success", async () => {
      const fakeSkill = { skill_id: 1, skill_name: "JavaScript" };
      Skill.create.mockResolvedValue(fakeSkill);

      req.body = { skill_name: "JavaScript" };
      await skillController.createSkill(req, res);

      expect(Skill.create).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(fakeSkill);
    });

    it("responds with 400 on error", async () => {
      Skill.create.mockRejectedValue(new Error("fail"));
      await skillController.createSkill(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: "fail" });
    });
  });

  describe("getSkillById", () => {
    it("returns skill on success", async () => {
      const fakeSkill = { skill_id: 1 };
      req.params.id = 1;
      Skill.getOneById.mockResolvedValue(fakeSkill);

      await skillController.getSkillById(req, res);

      expect(Skill.getOneById).toHaveBeenCalledWith(1);
      expect(res.json).toHaveBeenCalledWith(fakeSkill);
    });

    it("returns 404 if skill not found", async () => {
      Skill.getOneById.mockRejectedValue(new Error("not found"));
      await skillController.getSkillById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: "not found" });
    });
  });

  describe("searchSkills", () => {
    it("returns search results", async () => {
      const results = [{ skill_id: 1 }];
      req.query.q = "js";
      Skill.search.mockResolvedValue(results);

      await skillController.searchSkills(req, res);

      expect(Skill.search).toHaveBeenCalledWith("js");
      expect(res.json).toHaveBeenCalledWith(results);
    });

    it("handles error with 500", async () => {
      Skill.search.mockRejectedValue(new Error("fail"));
      await skillController.searchSkills(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "fail" });
    });
  });

  describe("getUserSkills", () => {
    it("returns skills for valid userId", async () => {
      const userId = 123;
      req.params.userId = `${userId}`;
      const skills = { teaching: [], learning: [] };
      Skill.getUserSkills.mockResolvedValue(skills);

      await skillController.getUserSkills(req, res);

      expect(Skill.getUserSkills).toHaveBeenCalledWith(userId);
      expect(res.json).toHaveBeenCalledWith(skills);
    });

    it("returns 400 for invalid userId", async () => {
      req.params.userId = "abc";
      await skillController.getUserSkills(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: "Invalid user ID" });
    });

    it("handles error with 500", async () => {
      req.params.userId = "123";
      Skill.getUserSkills.mockRejectedValue(new Error("fail"));

      await skillController.getUserSkills(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: "Failed to fetch user skills",
      });
    });
  });

  describe("addUserSkill", () => {
    const userId = 1;
    const skill_id = 2;
    const skill_type = "teaching";

    beforeEach(() => {
      req.params.userId = `${userId}`;
      req.body = { skill_id, skill_type };
    });

    it("returns 400 if missing fields or invalid skill_type", async () => {
      req.params.userId = "abc";
      await skillController.addUserSkill(req, res);
      expect(res.status).toHaveBeenCalledWith(400);

      req.params.userId = "1";
      req.body.skill_type = "invalid";
      await skillController.addUserSkill(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("returns 404 if user or skill not found", async () => {
      // User not found
      db.query.mockResolvedValueOnce({ rows: [] });
      await skillController.addUserSkill(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: "User not found" });

      // Skill not found
      db.query.mockResolvedValueOnce({ rows: [{ user_id }] }); // user found
      db.query.mockResolvedValueOnce({ rows: [] }); // skill not found
      await skillController.addUserSkill(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: "Skill not found" });
    });

    it("inserts skill if no previous entry", async () => {
      db.query
        .mockResolvedValueOnce({ rows: [{ user_id }] }) // userCheck
        .mockResolvedValueOnce({ rows: [{ skill_id }] }) // skillCheck
        .mockResolvedValueOnce({ rows: [] }) // userEntryCheck empty
        .mockResolvedValueOnce({ rows: [{ user_id, skill_1_id: skill_id }] }); // insert

      await skillController.addUserSkill(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: expect.stringContaining("Skill successfully added"),
          data: expect.objectContaining({ user_id }),
        })
      );
    });

    it("updates skill if previous entry with empty skill slot", async () => {
      const userEntry = { user_id, skill_1_id: 1, skill_2_id: null };
      db.query
        .mockResolvedValueOnce({ rows: [{ user_id }] }) // userCheck
        .mockResolvedValueOnce({ rows: [{ skill_id }] }) // skillCheck
        .mockResolvedValueOnce({ rows: [userEntry] }) // userEntryCheck
        .mockResolvedValueOnce({ rows: [{ user_id, skill_2_id: skill_id }] }); // update

      await skillController.addUserSkill(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: expect.stringContaining("Skill successfully added"),
          data: expect.objectContaining({ user_id }),
        })
      );
    });

    it("returns 400 if max skills reached", async () => {
      const fullEntry = {
        user_id,
        skill_1_id: 1,
        skill_2_id: 2,
        skill_3_id: 3,
        skill_4_id: 4,
        skill_5_id: 5,
      };
      db.query
        .mockResolvedValueOnce({ rows: [{ user_id }] }) // userCheck
        .mockResolvedValueOnce({ rows: [{ skill_id }] }) // skillCheck
        .mockResolvedValueOnce({ rows: [fullEntry] }); // userEntryCheck full

      await skillController.addUserSkill(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: expect.stringContaining(
            "Maximum number of teaching skills reached"
          ),
        })
      );
    });

    it("handles unexpected error with 500", async () => {
      db.query.mockRejectedValue(new Error("fail"));
      await skillController.addUserSkill(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: "Failed to add skill to user",
      });
    });
  });

  describe("getAllSkillTeachers", () => {
    it("returns 200 and data when query present", async () => {
      req.query.q = "js";
      const fakeData = [{ user_id: 1 }];
      Skill.getSkillTeachers.mockResolvedValue(fakeData);

      await skillController.getAllSkillTeachers(req, res);

      expect(Skill.getSkillTeachers).toHaveBeenCalledWith("js");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(fakeData);
    });

    it("returns 500 if query missing or error thrown", async () => {
      req.query.q = "";
      await skillController.getAllSkillTeachers(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: "Invalid search term provided.",
      });
    });
  });

  describe("currentUserSkillsInfo", () => {
    it("fetches skills, formats, posts to service and returns 200", async () => {
      req.params.userId = "1";
      const skillsData = [{ skill_name: "js" }];
      const formattedData = { formatted: true };
      Skill.getCurrentSkillsInfo.mockResolvedValue(skillsData);

      const dataProcessor = require("../helpers/dataProcessor");
      jest
        .spyOn(dataProcessor, "formatCurrentSkillsData")
        .mockReturnValue(formattedData);

      axios.post.mockResolvedValue({ data: { chart: "chartData" } });

      await skillController.currentUserSkillsInfo(req, res);

      expect(Skill.getCurrentSkillsInfo).toHaveBeenCalledWith("1");
      expect(dataProcessor.formatCurrentSkillsData).toHaveBeenCalledWith(
        skillsData
      );
      expect(axios.post).toHaveBeenCalledWith(
        "http://localhost:3005/current-skills-chart",
        formattedData
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        visualisation: { chart: "chartData" },
      });
    });

    it("returns 500 on error", async () => {
      Skill.getCurrentSkillsInfo.mockRejectedValue(new Error("fail"));
      await skillController.currentUserSkillsInfo(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "fail" });
    });
  });

  describe("topSkillsInfo", () => {
    it("fetches top skills, formats, posts to service and returns 200", async () => {
      const skillsData = [{ skill_name: "js" }];
      const formattedData = { formatted: true };
      Skill.getTopSkillsInfo.mockResolvedValue(skillsData);

      const dataProcessor = require("../helpers/dataProcessor");
      jest
        .spyOn(dataProcessor, "formatTopSkillsData")
        .mockReturnValue(formattedData);

      axios.post.mockResolvedValue({ data: { chart: "chartData" } });

      await skillController.topSkillsInfo(req, res);

      expect(Skill.getTopSkillsInfo).toHaveBeenCalled();
      expect(dataProcessor.formatTopSkillsData).toHaveBeenCalledWith(
        skillsData
      );
      expect(axios.post).toHaveBeenCalledWith(
        "http://localhost:3005/top-skills-chart",
        formattedData
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        visualisation: { chart: "chartData" },
      });
    });

    it("returns 500 on error", async () => {
      Skill.getTopSkillsInfo.mockRejectedValue(new Error("fail"));
      await skillController.topSkillsInfo(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "fail" });
    });
  });
});
