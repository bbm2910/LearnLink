document.addEventListener("DOMContentLoaded", () => {
  fetch("http://localhost:3000/api/users/top-users")
    .then((response) => response.json())
    .then((users) => {
      const userList = document.getElementById("user-list");

      // Limit to max 5 users?! Decide on this later
      const topFiveUsers = users.slice(0, 5);

      topFiveUsers.forEach((user) => {
        const li = document.createElement("li");
        li.classList.add(
          "list-group-item",
          "d-flex",
          "justify-content-between",
          "align-items-center"
        );

        li.textContent = `${user.first_name} ${user.last_name}`;

        const badge = document.createElement("span");
        badge.classList.add("badge", "rounded-pill");
        badge.textContent = `${user.sessions_taught} sessions`;

        li.appendChild(badge);
        userList.appendChild(li);
      });
    })
    .catch((error) => console.error("Error loading top users:", error));
});
