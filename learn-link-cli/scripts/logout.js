document.querySelector(".logout-btn").addEventListener("click", () => {
  localStorage.removeItem("token");
  window.location.assign("index.html");
});
