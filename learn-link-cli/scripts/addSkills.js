document.addEventListener("DOMContentLoaded", () => {
  // Get save button from modal
  const saveSkillBtn = document.getElementById("saveSkillBtn");
  if (!saveSkillBtn) {
    console.error("Save skill button not found");
    return;
  }

  saveSkillBtn.addEventListener("click", async () => {
    const skillType = document.getElementById("skillType").value;
    const skillName = document.getElementById("skillName").value;
    const skillDesc = document.getElementById("skillDesc").value;
    const skillCategory =
      document.getElementById("skillCategory").value || "General Skill";

    // Form validation
    if (!skillType || !skillName || !skillDesc) {
      alert("Please fill in all required fields");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Not logged in!");
      window.location.href = "signIn.html";
      return;
    }

    try {
      // 1. create the skill in the skills table
      const skillResponse = await fetch("http://localhost:3000/api/skills", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          skill_cat: skillCategory,
          skill_name: skillName,
          skill_desc: skillDesc,
        }),
      });

      if (!skillResponse.ok) {
        throw new Error("Failed to create skill");
      }

      const newSkill = await skillResponse.json();

      // 2. add the skill to the user's teaching or learning list
      const userInfo = parseJwt(token);
      const userId = userInfo.user_id;

      const addUserSkillResponse = await fetch(
        `http://localhost:3000/api/skills/user/${userId}/add`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            skill_id: newSkill.skill_id,
            skill_type: skillType,
          }),
        }
      );

      if (!addUserSkillResponse.ok) {
        throw new Error("Failed to add skill to user");
      }

      // Success! Close the modal and refresh skills
      const modal = bootstrap.Modal.getInstance(
        document.getElementById("exampleModal")
      );
      modal.hide();

      // Clear form
      document.getElementById("skillType").value = "";
      document.getElementById("skillName").value = "";
      document.getElementById("skillDesc").value = "";
      document.getElementById("skillCategory").value = "";

      // Reload skills
      loadUserSkills(userId);

      // Show success message -- do we want this as a feature?
      //   alert("Skill added successfully!");
    } catch (error) {
      console.error("Error adding skill:", error);
      alert("Error adding skill: " + error.message);
    }
  });
});

// Function to parse JWT token
function parseJwt(token) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error("Error parsing JWT", e);
    return {};
  }
}
