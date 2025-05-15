document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("token");

  if (!token) {
    alert("Not logged in!");
    window.location.href = "signIn.html";
    return;
  }

  try {
    const response = await fetch("http://localhost:3000/users/profile", {
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
    console.log(data); //  for debugging

    document.getElementById(
      "name"
    ).textContent = `${data.first_name} ${data.last_name}`;
    document.getElementById("email").textContent = data.email;
    document.getElementById("postcode").textContent = data.postcode;
  } catch (err) {
    console.error("Error fetching profile:", err);
    alert("Error loading profile");
  }
});
