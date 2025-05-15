document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const userId = params.get("userId");

  if (userId) {
    // Fetch user details using the userId
    fetch(`http://localhost:3000/users/${userId}`)
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
        document.querySelector(".text-secondary.mb-1").textContent =
          user.email || "N/A"; // Display email
        document.querySelector(".text-muted.font-size-sm").textContent =
          user.postcode || "N/A"; // Display postcode
        document.querySelector(
          ".list-group-item:nth-child(1) .text-secondary"
        ).textContent = user.website || "N/A";
        document.querySelector(
          ".list-group-item:nth-child(2) .text-secondary"
        ).textContent = user.github || "N/A";
        document.querySelector(
          ".list-group-item:nth-child(3) .text-secondary"
        ).textContent = user.twitter || "N/A";
        document.querySelector(
          ".list-group-item:nth-child(4) .text-secondary"
        ).textContent = user.instagram || "N/A";
        document.querySelector(
          ".list-group-item:nth-child(5) .text-secondary"
        ).textContent = user.facebook || "N/A";
      })
      .catch((error) => console.error("Error loading user details:", error));
  } else {
    console.error("No userId found in the URL");
  }
});
