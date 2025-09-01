window.addEventListener("scroll", () => {
    const navbar = document.getElementById("navbar");
    const welcome = document.getElementById("welcome-section");
    // When scrolled past the welcome section
    if (window.scrollY > welcome.offsetHeight - 50) {
        navbar.classList.add("visible");
    } else {
        navbar.classList.remove("visible");
    }
});
