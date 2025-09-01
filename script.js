window.addEventListener("scroll", () => {
  const navbar = document.getElementById("navbar");
  const welcome = document.getElementById("welcome-section");

  // Get the bottom edge of the welcome section
  const welcomeBottom = welcome.offsetTop + welcome.offsetHeight;

  if (window.scrollY > welcomeBottom - 50) {
    navbar.classList.add("visible");
  } else {
    navbar.classList.remove("visible");
  }
});
