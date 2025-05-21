document.getElementById("signinForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const form = new FormData(e.target);

  const options = {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: form.get("email"),
      password: form.get("password"),
    }),
  };

  const response = await fetch("http://localhost:3000/api/users/login", options);

  const data = await response.json();
  console.log(data);

  if (response.status == 200) {
    localStorage.setItem("token", data.token);
    localStorage.setItem("user_id", data.user.id)
    window.location.assign("dashboard-skills.html");
  } else {
    alert(data.error);
  }
});
