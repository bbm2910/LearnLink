document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const email = params.get("email");
  const name = params.get("name");

  if (email) {
    document.getElementById("recipientEmail").value = email;
  }

  if (name) {
    document.getElementById("recipientName").textContent = name;
  } else {
    document.getElementById("recipientName").textContent = "Recipient";
  }
});
