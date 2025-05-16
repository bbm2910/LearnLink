const db = require("../database/connect");
class Skill {
  constructor({ skill_id, skill_name, skill_desc }) {
    this.skill_id = skill_id;
    this.skill_name = skill_name;
    this.skill_desc = skill_desc;
  }

  static async create(data) {
    const { skill_name, skill_desc } = data;
    let response = await db.query(
      "INSERT INTO dim_skill (skill_name, skill_desc) VALUES ($1, $2) returning skill_id",
      [skill_name, skill_desc]
    );
    const newId = response.rows[0].skill_id;
    const newSkill = await Skill.getOneById(newId);
    return newSkill;
  }

  static getOneById = async (skill_id) => {
    const response = await db.query(
      "SELECT * FROM dim_user WHERE skill_id = $1;",
      [skill_id]
    );
    if (response.rows.length != 1) {
      throw Error("Unable to locate skill");
    }
    return new Skill(response.rows[0]);
  };

  static async search(query) {
    const formattedQuery = `%${query.toLowerCase()}%`;
    const response = await db.query(
      `SELECT * FROM dim_skill 
            WHERE LOWER(skill_name) LIKE $1 
                OR LOWER(skill_desc) LIKE $1`,
      [formattedQuery]
    );
    return response.rows.map((row) => new Skill(row));
  }
  static async getUserSkills(userId) {
    // Get teaching skills
    const teachingQuery = await db.query(
      `SELECT s.skill_id, s.skill_cat, s.skill_name, s.skill_desc, 'teaching' as skill_type
       FROM dim_skill s
       JOIN facts_teaching t ON 
         s.skill_id = t.skill_1_id OR 
         s.skill_id = t.skill_2_id OR 
         s.skill_id = t.skill_3_id OR 
         s.skill_id = t.skill_4_id OR 
         s.skill_id = t.skill_5_id
       WHERE t.user_id = $1`,
      [userId]
    );

    // Get learning skills
    const learningQuery = await db.query(
      `SELECT s.skill_id, s.skill_cat, s.skill_name, s.skill_desc, 'learning' as skill_type
       FROM dim_skill s
       JOIN facts_learning l ON 
         s.skill_id = l.skill_1_id OR 
         s.skill_id = l.skill_2_id OR 
         s.skill_id = l.skill_3_id OR 
         s.skill_id = l.skill_4_id OR 
         s.skill_id = l.skill_5_id
       WHERE l.user_id = $1`,
      [userId]
    );

    return {
      teaching: teachingQuery.rows.map((row) => new Skill(row)),
      learning: learningQuery.rows.map((row) => new Skill(row)),
    };
  }
}

module.exports = {
  Skill,
};
