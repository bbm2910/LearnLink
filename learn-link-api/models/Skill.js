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
}

module.exports = {
    Skill,
  };