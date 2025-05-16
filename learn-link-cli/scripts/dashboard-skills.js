const barChartSection = document.getElementById("bar-chart");
const pieChartSection = document.getElementById("pie-chart");

const renderCurrentUserSkillsChart = async () => {
  try {
    const options = {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        authorisation: localStorage.getItem("token"),
      },
    };

    const response = await fetch("http://localhost:3000/skills/current", options);
    const responseData = await response.json();

    if (responseData.success) {
      barChartSection.innerHTML = responseData.visualisation.visualisation_html;
    }
  } catch (err) {
    console.log(err);
  }
};

const renderTopUsersSkillsChart = async () => {
  try {
    const options = {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        authorisation: localStorage.getItem("token"),
      },
    };

    const response = await fetch("http://localhost:3000/skills/trending", options);
    const responseData = await response.json();

    if (responseData.success) {
      pieChartSection.innerHTML = responseData.visualisation.visualisation_html;
    }
  } catch (err) {
    console.log(err);
  }
};

renderCurrentUserSkillsChart();
renderTopUsersSkillsChart();