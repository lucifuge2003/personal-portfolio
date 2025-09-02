const heroCanvas = function () {
    const canvas = document.getElementById("hero-canvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const colorDot = [
        "rgb(168, 85, 247)", // purple
        "rgb(59, 130, 246)", // blue
        "rgb(236, 72, 153)", // pink
    ];
    const color = "rgb(168, 85, 247)";

    const welcomeSection = document.getElementById("welcome-section");
    const welcomeRect = welcomeSection.getBoundingClientRect();

    canvas.width = welcomeRect.width;
    canvas.height = welcomeRect.height;
    ctx.lineWidth = 0.3;
    ctx.strokeStyle = color;

    let mousePosition = { x: canvas.width / 2, y: canvas.height / 2 };

    const windowSize = window.innerWidth;
    let dots;

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

    function Dot() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = -0.5 + Math.random();
        this.vy = -0.5 + Math.random();
        this.radius = Math.random() * 1.5;
        this.colour = colorDot[Math.floor(Math.random() * colorDot.length)];
    }

    Dot.prototype = {
        create: function () {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
            const dotDistance =
                ((this.x - mousePosition.x) ** 2 +
                    (this.y - mousePosition.y) ** 2) ** 0.5;
            const distanceRatio = dotDistance / (windowSize / 1.7);
            ctx.fillStyle = this.colour.slice(0, -1) + `,${1 - distanceRatio})`;
            ctx.fill();
        },

        animate: function () {
            for (let i = 1; i < dots.nb; i++) {
                const dot = dots.array[i];
                if (dot.y < 0 || dot.y > canvas.height) dot.vy = -dot.vy;
                if (dot.x < 0 || dot.x > canvas.width) dot.vx = -dot.vx;
                dot.x += dot.vx;
                dot.y += dot.vy;
            }
        },

        line: function () {
            for (let i = 0; i < dots.nb; i++) {
                for (let j = 0; j < dots.nb; j++) {
                    const i_dot = dots.array[i];
                    const j_dot = dots.array[j];

                    if (
                        Math.abs(i_dot.x - j_dot.x) < dots.distance &&
                        Math.abs(i_dot.y - j_dot.y) < dots.distance
                    ) {
                        if (
                            Math.abs(i_dot.x - mousePosition.x) < dots.d_radius &&
                            Math.abs(i_dot.y - mousePosition.y) < dots.d_radius
                        ) {
                            ctx.beginPath();
                            ctx.moveTo(i_dot.x, i_dot.y);
                            ctx.lineTo(j_dot.x, j_dot.y);
                            const dotDistance =
                                ((i_dot.x - mousePosition.x) ** 2 +
                                    (i_dot.y - mousePosition.y) ** 2) ** 0.5;
                            let distanceRatio = dotDistance / dots.d_radius;
                            distanceRatio = Math.max(distanceRatio - 0.3, 0);
                            ctx.strokeStyle = `rgb(81, 162, 233, ${1 - distanceRatio})`;
                            ctx.stroke();
                            ctx.closePath();
                        }
                    }
                }
            }
        },
    };

    function createDots() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < dots.nb; i++) {
            if (!dots.array[i]) dots.array.push(new Dot());
            const dot = dots.array[i];
            dot.create();
        }

        dots.array[0].radius = 1.5;
        dots.array[0].colour = "#51a2e9";

        dots.array[0].line();
        dots.array[0].animate();
    }

    // Use window.onmousemove instead of adding a listener to the canvas
    window.onmousemove = function (e) {
        // Correctly calculate mouse position relative to the canvas
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        mousePosition.x = mouseX;
        mousePosition.y = mouseY;

        try {
            dots.array[0].x = mouseX;
            dots.array[0].y = mouseY;
        } catch {}
    };

    const draw = setInterval(createDots, 1000 / 30);

    window.addEventListener("resize", () => {
        clearInterval(draw);
        heroCanvas(); // reinit safely
    });
};

export default heroCanvas;