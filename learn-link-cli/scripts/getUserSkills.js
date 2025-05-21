async function loadUserSkills(userId) {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Authentication token not found");
    }

    const response = await fetch(
      `http://localhost:3000/api/skills/user/${userId}/skills`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const skills = await response.json();
    const skillsList = document.querySelector(".card-body .list-group");
    skillsList.innerHTML = ""; // Clear existing items

    console.log("Complete API response:", skills);

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
            <div class="text-muted small">Category: ${
              skill.skill_cat || "General"
            }</div>
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
            <div class="text-muted small">Category: ${
              skill.skill_cat || "General"
            }</div>
          </div>
          <span class="badge bg-primary rounded-pill">Learning</span>
        `;
        skillsList.appendChild(li);
      });
    }

    if (
      (!skills.teaching || skills.teaching.length === 0) &&
      (!skills.learning || skills.learning.length === 0)
    ) {
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
