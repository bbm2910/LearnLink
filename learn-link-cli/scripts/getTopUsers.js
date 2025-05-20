document.addEventListener("DOMContentLoaded", () => {
  fetch("http://localhost:3000/api/users/top-users")
    .then((response) => response.json())
    .then((users) => {
      const userList = document.getElementById("user-list");
      const topFiveUsers = users.slice(0, 5);

      topFiveUsers.forEach((user) => {
        const li = document.createElement("li");
        li.classList.add(
          "list-group-item",
          "d-flex",
          "justify-content-between",
          "align-items-center"
        );

        // Create link inside list item
        const link = document.createElement("a");
        link.href = `user-profile.html?userId=${user.user_id}`;
        link.textContent = `${user.first_name} ${user.last_name}`;
        link.style.textDecoration = "none";
        // link.style.color = "inherit";

        li.appendChild(link);

        const badge = document.createElement("span");
        badge.classList.add("badge", "rounded-pill");
        badge.textContent = `${user.sessions_taught} sessions`;

        li.appendChild(badge);
        userList.appendChild(li);
      });
    })
    .catch((error) => console.error("Error loading top users:", error));
});
