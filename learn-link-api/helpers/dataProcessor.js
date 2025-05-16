const formatTopSkillsData = (dbQueryResult) => {
  const skillNames = dbQueryResult.map( (o) => o.skill_name);
  const learnerCounts = dbQueryResult.map( (o) => o.number_of_learners);

  return {
    skills: skillNames,
    learners: learnerCounts
  }
};

const formatCurrentSkillsData = (dbQueryResult) => {
  const skillNames = dbQueryResult.map( (o) => o.skill_name);
  const learningSessionCounts = dbQueryResult.map( (o) => o.number_of_sessions);

  return {
    skills: skillNames,
    learning_sessions: learningSessionCounts
  }
};

module.exports = {
  formatTopSkillsData,
  formatCurrentSkillsData
}