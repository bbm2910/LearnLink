
const formatSkillsData = (aggregatedData) => {
  const skillNames = aggregatedData.map( (o) => o.skill_name);
  const learnerCounts = aggregatedData.map( (o) => o.number_of_learners);

  return {
      skills: skillNames,
      learners: learnerCounts
  }
};

module.exports = {
  formatSkillsData
}