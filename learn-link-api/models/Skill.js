const db = require('../database/connect')
class Skill {
    constructor({skill_id, skill_name, skill_desc}){
        this.skill_id = skill_id;
        this.skill_name = skill_name;
        this.skill_desc = skill_desc;
    }

    static async create(data) {
        const {skill_name, skill_desc} = data;
        let response = await db.query(
            "INSERT INTO dim_skill (skill_name, skill_desc) VALUES ($1, $2) returning skill_id",
            [skill_name, skill_desc]
        );
        const newId = response.rows[0].skill_id;
        const newSkill = await Skill.getOneById(newId);
        return newSkill
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
        return response.rows.map(row => new Skill(row));
    }

  // For "Top Skills" pie chart visualisation
  static getTopSkillsInfo = async () => {
    const response = await db.query(
      // Return top 5 skills being learned
      `SELECT ds.skill_name, 
      COUNT(DISTINCT fs.learner_id) AS number_of_learners 
      FROM facts_session fs 
      JOIN dim_skill ds ON fs.skill_id = ds.skill_id 
      WHERE fs.learner_id IS NOT NULL 
      GROUP BY ds.skill_name 
      ORDER BY number_of_learners DESC 
      LIMIT 5;`
    );

    if(response.rows.length === 0) {
      throw Error("No skills information available.");
    }

    return response.rows;
  }

  // For "Current Skills" bar chart visualisation
  static getCurrentSkillsInfo = async (user_id) => {
    const response = await db.query(
        `SELECT
        du.user_id,
        ds.skill_name,
        COUNT(fs.skill_id) AS number_of_sessions
        FROM
            dim_user du
        JOIN
            facts_session fs ON du.user_id = fs.learner_id
        JOIN
            dim_skill ds ON fs.skill_id = ds.skill_id
        WHERE
            du.user_id = $1
        GROUP BY
            du.user_id, ds.skill_name
        ORDER BY
            ds.skill_name;`, [user_id]
    );


    if(response.rows.length === 0) {
      throw Error("No skills information available.");
    }

    return response.rows;
  }

}

module.exports = {
    Skill,
  };