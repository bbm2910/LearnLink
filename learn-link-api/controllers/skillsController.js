const axios = require("axios");

const { Skill } = require("../models/Skill");
const { formatCurrentSkillsData, formatTopSkillsData } = require("../helpers/dataProcessor");

const currentSkillsInfo = async (req, res) => {
    try {
        // Retrieve data for visualisation from database
        const skillsData = await Skill.getCurrentSkillsInfo(3);

        // Format into separate arrays
        const formattedData = formatCurrentSkillsData(skillsData);

        // Send request to Python data API
        const response = await axios.post("http://localhost:3005/current-skills-chart", formattedData);

        console.log("response.data currentSkillsInfo");
        console.log(response.data);

        // Return JSON response
        res.status(200).json({
            success: true,
            visualisation: response.data
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

const topSkillsInfo = async (req, res) => {
    try {
        // Retrieve data for visualisation from database
        const skillsData = await Skill.getTopSkillsInfo();

        // Format into separate arrays
        const formattedData = formatTopSkillsData(skillsData);

        // Send request to Python data API
        const response = await axios.post("http://localhost:3005/top-skills-chart", formattedData);

        // Return JSON response
        res.status(200).json({
            success: true,
            visualisation: response.data
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

module.exports = {
    currentSkillsInfo,
    topSkillsInfo
};