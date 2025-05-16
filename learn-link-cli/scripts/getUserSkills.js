// Function to fetch and display user skills
async function loadUserSkills(userId) {
  try {
    const response = await fetch(
      `http://localhost:3000/skills/user/${userId}/skills`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const skills = await response.json();

    const skillsList = document.querySelector(".card-body .list-group");
    skillsList.innerHTML = ""; // Clear existing items

    console.log("Complete API response:", skills);
    if (skills.teaching && skills.teaching.length > 0) {
      console.log("First teaching skill:", skills.teaching[0]);
      console.log("skill_cat value:", skills.teaching[0].skill_cat);
      console.log("Properties available:", Object.keys(skills.teaching[0]));
    }
    // Add teaching skills
    if (skills.teaching && skills.teaching.length > 0) {
      skills.teaching.forEach((skill) => {
        const li = document.createElement("li");
        li.className =
          "list-group-item d-flex justify-content-between align-items-center";

        li.innerHTML = `
      <div>
        <span class="skill-name fw-bold">${skill.skill_name}</span>: 
        <span class="skill-desc text-muted">${skill.skill_desc}</span>
      </div>
      <span class="badge bg-success rounded-pill">Teaching</span>
    `;

        skillsList.appendChild(li);
      });
    }

    // Add learning skills
    if (skills.learning && skills.learning.length > 0) {
      skills.learning.forEach((skill) => {
        const li = document.createElement("li");
        li.className =
          "list-group-item d-flex justify-content-between align-items-center";

        li.innerHTML = `
      <div>
        <span class="skill-name fw-bold">${skill.skill_name}</span>: 
        <span class="skill-desc text-muted">${skill.skill_desc}</span>
      </div>
      <span class="badge skills-learning rounded-pill">Learning</span>
    `;

        skillsList.appendChild(li);
      });
    }

    if (skillsList.children.length === 0) {
      const li = document.createElement("li");
      li.className = "list-group-item";
      li.textContent = "No skills found for this user";
      skillsList.appendChild(li);
    }
  } catch (error) {
    console.error("Error loading skills:", error);

    // Show error message in the skills card
    const skillsList = document.querySelector(".card-body .list-group");
    skillsList.innerHTML = "";

    const errorItem = document.createElement("li");
    errorItem.className = "list-group-item text-danger";
    errorItem.textContent = "Error loading skills. Please try again later.";
    skillsList.appendChild(errorItem);
  }
}

// Function to get the current user ID (depends on your authentication system)
function getCurrentUserId() {
  // Option 1: Get from URL parameter
  const urlParams = new URLSearchParams(window.location.search);
  const userIdFromUrl = urlParams.get("userId");
  if (userIdFromUrl) return userIdFromUrl;

  // Option 2: Get from a data attribute in the HTML
  const userIdEl = document.getElementById("user-data");
  if (userIdEl && userIdEl.dataset.userId) {
    return userIdEl.dataset.userId;
  }

  // Fallback or default user ID (if viewing your own profile)
  return 1; // Replace with appropriate default
}

// Initialize when the page loads
document.addEventListener("DOMContentLoaded", () => {
  const userId = getCurrentUserId();
  loadUserSkills(userId);
});
