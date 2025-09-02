const sections = document.querySelectorAll("section[id]");

// Create an Intersection Observer
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      const navLink = document.querySelector(`#nav-${entry.target.id}`);
      if (entry.isIntersecting) {
        // Remove 'active' from all links
        document.querySelectorAll("#navbar a").forEach((link) => {
          link.classList.remove("active");
        });
        // Add 'active' to the current link
        if (navLink) {
          navLink.classList.add("active");
        }
      }
    });
  },
  {
    // Set an offset from the top of the viewport to trigger the change earlier
    rootMargin: "-50% 0px -50% 0px",
  }
);

// Tell the observer to watch each section
sections.forEach((section) => {
  observer.observe(section);
});
