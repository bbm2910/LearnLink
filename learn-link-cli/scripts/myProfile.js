document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("Not logged in!");
    window.location.href = "signIn.html";
    return;
  }

  try {
    const response = await fetch("http://localhost:3000/api/users/profile", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Could not fetch profile");
    }

    console.log("Token:", token);
    const data = await response.json();
    console.log(data); // for debugging

    document.getElementById(
      "name"
    ).textContent = `${data.first_name} ${data.last_name}`;
    document.getElementById("email").textContent = data.email;
    document.getElementById("postcode").textContent = data.postcode;

    // Get user ID from token and load skills
    const userInfo = parseJwt(token);
    const userId = userInfo.user_id;
    loadUserSkills(userId);
  } catch (err) {
    console.error("Error fetching profile:", err);
    alert("Error loading profile");
  }
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
