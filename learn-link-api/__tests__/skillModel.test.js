const { Skill } = require('../models/Skill');
const db = require('../database/connect');

jest.mock('../database/connect');

describe('Skill model', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should insert a skill and return a Skill instance', async () => {
      const mockId = 42;
      const mockSkill = {
        skill_id: mockId,
        skill_cat: 'Technical',
        skill_name: 'Node.js',
        skill_desc: 'JavaScript runtime'
      };

      db.query
        .mockResolvedValueOnce({ rows: [{ skill_id: mockId }] }) // insert
        .mockResolvedValueOnce({ rows: [mockSkill] }); // getOneById

      const result = await Skill.create({
        skill_cat: 'Technical',
        skill_name: 'Node.js',
        skill_desc: 'JavaScript runtime'
      });

      expect(db.query).toHaveBeenCalledTimes(2);
      expect(result).toBeInstanceOf(Skill);
      expect(result.skill_name).toBe('Node.js');
    });
  });

  describe('getOneById', () => {
    it('should return a Skill instance for a valid ID', async () => {
      const mockSkill = {
        skill_id: 1,
        skill_cat: 'Soft',
        skill_name: 'Communication',
        skill_desc: 'Clear exchange of information'
      };

      db.query.mockResolvedValueOnce({ rows: [mockSkill] });

      const result = await Skill.getOneById(1);

      expect(db.query).toHaveBeenCalledWith(expect.stringContaining('SELECT * FROM dim_skill'), [1]);
      expect(result).toBeInstanceOf(Skill);
      expect(result.skill_name).toBe('Communication');
    });

    it('should throw an error for invalid ID', async () => {
      db.query.mockResolvedValueOnce({ rows: [] });

      await expect(Skill.getOneById(999)).rejects.toThrow('Unable to locate skill');
    });
  });

  describe('search', () => {
    it('should return skills matching the search query', async () => {
      const mockSkills = [
        { skill_id: 1, skill_cat: 'Tech', skill_name: 'Python', skill_desc: 'Programming language' },
        { skill_id: 2, skill_cat: 'Tech', skill_name: 'PySpark', skill_desc: 'Big data framework' }
      ];

      db.query.mockResolvedValueOnce({ rows: mockSkills });

      const result = await Skill.search('py');

      expect(db.query).toHaveBeenCalledWith(expect.any(String), ['%py%']);
      expect(result.length).toBe(2);
      expect(result[0]).toBeInstanceOf(Skill);
    });
  });

  describe('getUserSkills', () => {
    it('should return user skills split by teaching and learning', async () => {
      const teachingSkills = [
        { skill_id: 1, skill_cat: 'Tech', skill_name: 'React', skill_desc: 'UI library' }
      ];
      const learningSkills = [
        { skill_id: 2, skill_cat: 'Tech', skill_name: 'Docker', skill_desc: 'Containerization' }
      ];

      db.query
        .mockResolvedValueOnce({ rows: teachingSkills }) // teaching
        .mockResolvedValueOnce({ rows: learningSkills }); // learning

      const result = await Skill.getUserSkills(101);

      expect(db.query).toHaveBeenCalledTimes(2);
      expect(result.teaching[0]).toBeInstanceOf(Skill);
      expect(result.learning[0]).toBeInstanceOf(Skill);
    });
  });

  describe('getTopSkillsInfo', () => {
    it('should return top skills with learner counts', async () => {
      const mockTopSkills = [
        { skill_name: 'JavaScript', number_of_learners: 12 },
        { skill_name: 'Python', number_of_learners: 10 }
      ];

      db.query.mockResolvedValueOnce({ rows: mockTopSkills });

      const result = await Skill.getTopSkillsInfo();

      expect(db.query).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockTopSkills);
    });

    it('should throw if no skills data available', async () => {
      db.query.mockResolvedValueOnce({ rows: [] });

      await expect(Skill.getTopSkillsInfo()).rejects.toThrow('No skills information available.');
    });
  });

  describe('getCurrentSkillsInfo', () => {
    it('should return current skills info for a user', async () => {
      const mockData = [
        {
          user_id: 101,
          first_name: 'Jane',
          last_name: 'Doe',
          skill_name: 'SQL',
          number_of_sessions: 3
        }
      ];

      db.query.mockResolvedValueOnce({ rows: mockData });

      const result = await Skill.getCurrentSkillsInfo(101);

      expect(db.query).toHaveBeenCalledWith(expect.any(String), [101]);
      expect(result).toEqual(mockData);
    });

    it('should throw if no skills info found', async () => {
      db.query.mockResolvedValueOnce({ rows: [] });

      await expect(Skill.getCurrentSkillsInfo(202)).rejects.toThrow('No skills information available.');
    });
  });

});
