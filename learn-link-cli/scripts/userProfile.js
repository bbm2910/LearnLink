document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const userId = params.get("userId");

  if (userId) {
    // Fetch user details using the userId
    fetch(`http://localhost:3000/api/users/${userId}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((user) => {
        // Update the profile page with user details
        document.querySelector(
          ".card-body h4"
        ).textContent = `${user.first_name} ${user.last_name}`;
        document.querySelector(".text-secondary.mb-1 ").textContent =
          user.email || "N/A";
        document.querySelector(".text-muted.font-size-sm").textContent =
          user.postcode || "N/A";

        // Dynamically set the "Send Email" button
        const sendEmailButton = document.getElementById("send-email");
        if (user.email) {
          sendEmailButton.addEventListener("click", () => {
            window.location.href = `mailto:${user.email}`;
          });
        } else {
          sendEmailButton.disabled = true;
        }

        const messageBtn = document.getElementById("messageBtn");

        if (user.email && user.first_name && user.last_name) {
          const fullName = `${user.first_name} ${user.last_name}`;
          messageBtn.addEventListener("click", () => {
            // Redirect with both email and name
            window.location.href = `dashboard-messages.html?email=${encodeURIComponent(
              user.email
            )}&name=${encodeURIComponent(fullName)}`;
          });
        } else {
          messageBtn.disabled = true;
        }

        //  Load the user's skills after loading their profile
        loadUserSkills(userId);
      })
      .catch((error) => console.error("Error loading user details:", error));
  } else {
    console.error("No userId found in the URL");
  }
});
