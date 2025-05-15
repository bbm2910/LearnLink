document.getElementById("signupForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const form = new FormData(e.target);

  const userData = {
    first_name: form.get("first_name"),
    last_name: form.get("last_name"),
    email: form.get("email"),
    password: form.get("password"),
    postcode: form.get("postcode"),
  };

  const options = {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  };

  try {
    const response = await fetch(
      "http://localhost:3000/users/register",
      options
    );
    const data = await response.json();

    if (response.status === 201) {
      localStorage.setItem("token", data.token);
      window.location.assign("signIn.html");
    } else {
      // Show an error message - I used it for debug
      alert(data.error || "Registration failed. Please try again.");
    }
  } catch (error) {
    console.error("Error during registration:", error);
    alert("Something went wrong. Please try again later.");
  }
});
