const heroCanvas = function () {
    // Selects the canvas element from the HTML file.
    const canvas = document.getElementById("hero-canvas");
    // If the canvas element is not found, the function stops.
    if (!canvas) return;

    // Gets the 2D rendering context to allow drawing on the canvas.
    const ctx = canvas.getContext("2d");

    // Defines an array of colors for the moving dots.
    const colorDot = [
        "rgb(168, 85, 247)", // purple
        "rgb(59, 130, 246)", // blue
        "rgb(236, 72, 153)", // pink
    ];

    // This color variable seems to be a leftover and is not used to draw lines.
    const color = "rgb(168, 85, 247)";

    // Gets the welcome section element to determine the canvas's size.
    const welcomeSection = document.getElementById("welcome-section");
    // Gets the size and position of the welcome section.
    const welcomeRect = welcomeSection.getBoundingClientRect();

    // Sets the canvas dimensions to match the welcome section.
    canvas.width = welcomeRect.width;
    canvas.height = welcomeRect.height;
    // Sets the line width for drawing connections between dots.
    ctx.lineWidth = 0.3;
    // Sets the stroke color for the lines. This color is not used due to a later override.
    ctx.strokeStyle = color;

    // Initializes the mouse position at the center of the canvas.
    let mousePosition = { x: canvas.width / 2, y: canvas.height / 2 };

    // Gets the current window width to adjust the number of dots.
    const windowSize = window.innerWidth;
    let dots;

    // Defines different settings for the dots based on the screen size.
    // This is a responsive logic to optimize performance on smaller devices.
    if (windowSize > 1600) {
        dots = { nb: 600, distance: 70, d_radius: 300, array: [] };
    } else if (windowSize > 1300) {
        dots = { nb: 575, distance: 60, d_radius: 280, array: [] };
    } else if (windowSize > 1100) {
        dots = { nb: 500, distance: 55, d_radius: 250, array: [] };
    } else if (windowSize > 800) {
        dots = { nb: 300, distance: 0, d_radius: 0, array: [] };
    } else if (windowSize > 600) {
        dots = { nb: 200, distance: 0, d_radius: 0, array: [] };
    } else {
        dots = { nb: 100, distance: 0, d_radius: 0, array: [] };
    }

    // Constructor function for a single dot.
    function Dot() {
        // Assigns random initial positions, velocities, and a radius.
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = -0.5 + Math.random();
        this.vy = -0.5 + Math.random();
        this.radius = Math.random() * 1.5;
        // Assigns a random color from the predefined `colorDot` array.
        this.colour = colorDot[Math.floor(Math.random() * colorDot.length)];
    }

    // Defines methods for the Dot prototype.
    Dot.prototype = {
        // Draws the dot on the canvas.
        create: function () {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
            // Calculates the distance of the dot from the mouse.
            const dotDistance =
                ((this.x - mousePosition.x) ** 2 +
                    (this.y - mousePosition.y) ** 2) ** 0.5;
            const distanceRatio = dotDistance / (windowSize / 1.7);
            // Sets the fill color with a transparency that decreases as the dot moves away from the mouse.
            ctx.fillStyle = this.colour.slice(0, -1) + `,${1 - distanceRatio})`;
            ctx.fill();
        },

        // Updates the dot's position to create movement.
        animate: function () {
            for (let i = 1; i < dots.nb; i++) {
                const dot = dots.array[i];
                // Reverses the dot's velocity if it hits the canvas boundaries.
                if (dot.y < 0 || dot.y > canvas.height) dot.vy = -dot.vy;
                if (dot.x < 0 || dot.x > canvas.width) dot.vx = -dot.vx;
                // Updates the dot's position.
                dot.x += dot.vx;
                dot.y += dot.vy;
            }
        },

        // Draws lines between nearby dots.
        line: function () {
            for (let i = 0; i < dots.nb; i++) {
                for (let j = 0; j < dots.nb; j++) {
                    const i_dot = dots.array[i];
                    const j_dot = dots.array[j];
                    // Checks if dots are within a certain distance of each other.
                    if (
                        Math.abs(i_dot.x - j_dot.x) < dots.distance &&
                        Math.abs(i_dot.y - j_dot.y) < dots.distance
                    ) {
                        // Checks if the dot is within the "detection radius" of the mouse.
                        if (
                            Math.abs(i_dot.x - mousePosition.x) < dots.d_radius &&
                            Math.abs(i_dot.y - mousePosition.y) < dots.d_radius
                        ) {
                            // Draws a line between the dots.
                            ctx.beginPath();
                            ctx.moveTo(i_dot.x, i_dot.y);
                            ctx.lineTo(j_dot.x, j_dot.y);
                            // Calculates the distance of the dot from the mouse to set line transparency.
                            const dotDistance =
                                ((i_dot.x - mousePosition.x) ** 2 +
                                    (i_dot.y - mousePosition.y) ** 2) ** 0.5;
                            let distanceRatio = dotDistance / dots.d_radius;
                            // Adjusts the ratio to make the lines more visible near the mouse.
                            distanceRatio = Math.max(distanceRatio - 0.3, 0);
                            // Sets the stroke color with transparency that changes based on mouse distance.
                            ctx.strokeStyle = `rgb(81, 162, 233, ${1 - distanceRatio})`;
                            ctx.stroke();
                            ctx.closePath();
                        }
                    }
                }
            }
        },
    };

    // Main function to create and update the dots.
    function createDots() {
        // Clears the entire canvas before drawing the new frame.
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // Creates new dots if the total number of dots hasn't been reached yet.
        for (let i = 0; i < dots.nb; i++) {
            if (!dots.array[i]) dots.array.push(new Dot());
            const dot = dots.array[i];
            dot.create();
        }

        // Sets the first dot's properties to follow the mouse.
        dots.array[0].radius = 1.5;
        dots.array[0].colour = "#51a2e9";

        // Draws lines and animates the dots.
        dots.array[0].line();
        dots.array[0].animate();
    }

    // Event listener for mouse movement on the window.
    window.onmousemove = function (e) {
        // Correctly calculates the mouse position relative to the canvas.
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        // Updates the `mousePosition` object with the new coordinates.
        mousePosition.x = mouseX;
        mousePosition.y = mouseY;

        // Updates the position of the first dot to follow the mouse.
        try {
            dots.array[0].x = mouseX;
            dots.array[0].y = mouseY;
        } catch {}
    };

    // Sets up a timer to continuously draw new frames, creating an animation.
    const draw = setInterval(createDots, 1000 / 30);

    // Event listener for window resize.
    window.addEventListener("resize", () => {
        // Clears the current animation loop.
        clearInterval(draw);
        // Re-initializes the canvas, dots, and animation with new dimensions.
        heroCanvas(); // reinit safely
    });
};

// Exports the function so it can be used in other modules.
export default heroCanvas;