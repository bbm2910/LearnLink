document.addEventListener("DOMContentLoaded", () => {
  fetch("http://localhost:3000/users/last-session-summary")
    .then((response) => response.json())
    .then((sessionSummary) => {
      const skill = document.getElementById("last-session-summary-skill");
      const date = document.getElementById("last-session-summary-date");

      skill.append(sessionSummary.skill);
      date.append(sessionSummary.date);
    })
    .catch((error) => console.error("Error loading Session Summary:", error));
});
