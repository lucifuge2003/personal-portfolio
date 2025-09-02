/**
 * @fileoverview This script generates a background animation of moving,
 * interconnected dots on a canvas element with the ID 'bg-canvas'.
 * The dot positions and connections are influenced by the user's scroll position,
 * creating a dynamic background effect.
 *
 * It is designed to be self-initializing and responsive to window resizing.
 * @exports {function} canvasDotsBg
 */

export default function canvasDotsBg() {
  // Get the canvas element and its 2D rendering context.
  const canvas = document.getElementById("bg-canvas");
  // Safely exit the function if the canvas element is not found to prevent errors.
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  // An array of colors for the dots.
  const colorDot = [
    "rgb(168, 85, 247)", // purple
    "rgb(59, 130, 246)", // blue
    "rgb(236, 72, 153)", // pink
  ], color = 'rgb(168, 85, 247)';

  /**
   * Sets the canvas dimensions to match the document's scrollable area
   * below a specific hero section, ensuring the canvas covers the full
   * background.
   */
  function setCanvasSize() {
    const hero = document.getElementById("hero-section");
    const heroHeight = hero ? hero.offsetHeight : 0;

    // Set canvas width to the document's full scrollable width.
    canvas.width = document.documentElement.scrollWidth;
    // Set canvas height to the document's full scrollable height minus the hero section's height.
    canvas.height = document.documentElement.scrollHeight - heroHeight;

    // Position the canvas to start right after the hero section.
    canvas.style.top = `${heroHeight}px`;
  }

  // Initial call to set the canvas size.
  setCanvasSize();

  // Make sure the canvas is visible as a block-level element.
  canvas.style.display = "block";
  // Set the default line width for drawing dot trails.
  ctx.lineWidth = 0.3;

  // Initialize a position object for a "ghost" dot that follows the scroll center.
  let mousePosition = {
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
  };

  const windowSize = window.innerWidth;
  let dots;

  // Configuration based on window size to adjust dot density.
  if (windowSize > 1600) dots = { nb: 100, array: [] }; // Lots of dots on large screens.
  else if (windowSize > 1300) dots = { nb: 75, array: [] };
  else if (windowSize > 1100) dots = { nb: 50, array: [] };
  else if (windowSize > 800) dots = { nb: 1, array: [] }; // Reduced dots on smaller screens for performance.
  else dots = { nb: 1, array: [] };

  /**
   * Represents a single dot particle with position, velocity, and properties.
   * @constructor
   */
  function Dot() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    // Random velocity for movement.
    this.vx = -0.5 + Math.random();
    this.vy = -0.5 + Math.random();
    // Slightly larger radius for a more visible effect.
    this.radius = Math.random() * 1.5;
    // Assign a random color from the defined color palette.
    this.colour = colorDot[Math.floor(Math.random() * colorDot.length)];
  }

  // ---

  /**
   * Defines the prototype methods for the Dot object.
   */
  Dot.prototype = {
    /**
     * Draws the dot on the canvas. The dot's opacity fades based on its
     * distance from the "ghost" dot's position.
     */
    create: function () {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);

      // Calculate the distance from the dot to the mouse position.
      const dotDistance =
        ((this.x - mousePosition.x) ** 2 +
          (this.y - mousePosition.y) ** 2) ** 0.5;
      // Calculate a distance ratio for a softer fade effect.
      let distanceRatio = dotDistance / (windowSize / 1.5);

      // Clamp the ratio to prevent the dot from completely vanishing.
      if (distanceRatio > 1) distanceRatio = 1;

      // Set the fill style with a color and a calculated opacity.
      ctx.fillStyle = this.colour.slice(0, -1) + `,${1 - distanceRatio * 0.7})`;
      ctx.fill();
    },

    /**
     * Animates the dot's movement, including boundary collision detection
     * to keep dots within the canvas.
     */
    animate: function () {
      // Loop through all dots except the first one (which follows the cursor).
      for (let i = 1; i < dots.nb; i++) {
        const dot = dots.array[i];
        // Reverse velocity if the dot hits a vertical or horizontal edge.
        if (dot.y < 0 || dot.y > canvas.height) dot.vy = -dot.vy;
        if (dot.x < 0 || dot.x > canvas.width) dot.vx = -dot.vx;
        // Update the dot's position.
        dot.x += dot.vx;
        dot.y += dot.vy;
      }
    },
  };

  // ---

  /**
   * The main animation loop that creates, updates, and renders all the dots.
   */
  function createDots() {
    // Clear the canvas on each frame.
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < dots.nb; i++) {
      // Create a new dot if it doesn't already exist.
      if (!dots.array[i]) dots.array.push(new Dot());
      const dot = dots.array[i];
      dot.create();
    }
    // Set properties for the first dot, if it exists, to make it distinct.
    if (dots.array[0]) {
      dots.array[0].radius = 2;
      dots.array[0].colour = "#51a2e9";
      dots.array[0].animate();
    }
  }

  // Mouse position is linked to the center of the viewport, relative to the scroll position.
  window.addEventListener("scroll", () => {
    // Keep the X position centered horizontally.
    mousePosition.x = window.innerWidth / 2;
    // Update the Y position based on the vertical scroll and viewport center.
    mousePosition.y = window.scrollY + window.innerHeight / 2;
  });

  // Start the animation loop.
  const draw = setInterval(createDots, 1000 / 30); // 30 frames per second.

  // 🔹 Handle window resizing to maintain a responsive design.
  window.addEventListener("resize", () => {
    // Clear the existing animation loop.
    clearInterval(draw);
    // Recalculate and set the canvas size.
    setCanvasSize();
    // Recursively call the function to re-initialize the animation with new dimensions.
    canvasDotsBg();
  });
}