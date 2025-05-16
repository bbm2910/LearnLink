document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.getElementById("searchInput");
    const resultsList = document.getElementById("resultsList");
  
    let debounceTimeout;
  
    searchInput.addEventListener("input", () => {
      const query = searchInput.value.trim();
  
      clearTimeout(debounceTimeout);
  
      if (query.length === 0) {
        resultsList.innerHTML = "";
        return;
      }
  
      debounceTimeout = setTimeout(() => {
        fetchSkills(query);
      }, 300);
    });
  
    async function fetchSkills(query) {
      try {
        const response = await fetch(`/api/skills?q=${encodeURIComponent(query)}`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
  
        const skills = await response.json();
        displayResults(skills, query);
      } catch (error) {
        console.error("Error fetching skills:", error);
        resultsList.innerHTML = `<li class="list-group-item text-danger">Failed to load results.</li>`;
      }
    }
  
    function highlightMatch(text, query) {
      const regex = new RegExp(`(${query})`, "gi");
      return text.replace(regex, "<mark>$1</mark>");
    }
  
    function displayResults(skills, query) {
      resultsList.innerHTML = "";
  
      if (skills.length === 0) {
        resultsList.innerHTML = `<li class="list-group-item text-muted">No skills found.</li>`;
        return;
      }
  
      for (const skill of skills) {
        const li = document.createElement("li");
        li.classList.add("list-group-item");
  
        li.innerHTML = `
          <strong>${highlightMatch(skill.skill_name, query)}</strong><br />
          <small>${highlightMatch(skill.skill_desc, query)}</small>
        `;
  
        resultsList.appendChild(li);
      }
    }
  });
  