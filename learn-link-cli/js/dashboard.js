function showContent(section) {
  // Hide
  const sections = document.querySelectorAll(".content-section");
  sections.forEach((section) => section.classList.remove("active"));

  // Show
  const selectedSection = document.getElementById(section);
  if (selectedSection) {
    selectedSection.classList.add("active");
  }
}
