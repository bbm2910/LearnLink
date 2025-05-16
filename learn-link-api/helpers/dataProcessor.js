const formatTopSkillsData = (dbQueryResult) => {
  const skillNames = dbQueryResult.map( (o) => o.skill_name);
<<<<<<< HEAD
  const learnerCounts = dbQueryResult.map( (o) => parseInt(o.number_of_learners));
=======
  const learnerCounts = dbQueryResult.map( (o) => o.number_of_learners);
>>>>>>> ec79b29 (Data helper functions)

  return {
    skills: skillNames,
    learners: learnerCounts
  }
};

const formatCurrentSkillsData = (dbQueryResult) => {
  const skillNames = dbQueryResult.map( (o) => o.skill_name);
<<<<<<< HEAD
  const learningSessionCounts = dbQueryResult.map( (o) => parseInt(o.number_of_sessions));
=======
  const learningSessionCounts = dbQueryResult.map( (o) => o.number_of_sessions);
>>>>>>> ec79b29 (Data helper functions)

  return {
    skills: skillNames,
    learning_sessions: learningSessionCounts
  }
};

module.exports = {
  formatTopSkillsData,
  formatCurrentSkillsData
}