// bgCanvas.js
export default function canvasDotsBg() {
  const canvas = document.getElementById("bg-canvas");
  if (!canvas) return; // stop if element not found

  const ctx = canvas.getContext("2d");
  const colorDot = [
    "rgb(168, 85, 247)", // purple
    "rgb(59, 130, 246)", // blue
    "rgb(236, 72, 153)", // pink
  ];

  canvas.width = document.body.scrollWidth;
  canvas.height = window.innerHeight;
  canvas.style.display = "block";
  ctx.lineWidth = 0.3;

  let mousePosition = {
    x: (30 * canvas.width) / 100,
    y: (30 * canvas.height) / 100,
  };

  const windowSize = window.innerWidth;
  let dots;

  if (windowSize > 1600) dots = { nb: 100, array: [] };
  else if (windowSize > 1300) dots = { nb: 75, array: [] };
  else if (windowSize > 1100) dots = { nb: 50, array: [] };
  else {
    dots = { nb: 1, array: [] };
    ctx.globalAlpha = 0;
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

      const top =
        (window.pageYOffset || document.scrollTop) - (document.clientTop || 0);

      const dotDistance =
        ((this.x - mousePosition.x) ** 2 +
          (this.y - mousePosition.y + top) ** 2) ** 0.5;
      const distanceRatio = dotDistance / (windowSize / 2);

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
  };

  function createDots() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < dots.nb; i++) {
      if (!dots.array[i]) dots.array.push(new Dot());
      const dot = dots.array[i];
      dot.create();
    }
    if (dots.array[0]) {
      dots.array[0].radius = 1.5;
      dots.array[0].colour = "#51a2e9";
      dots.array[0].animate();
    }
  }

  window.addEventListener("scroll", () => {
    mousePosition.x = window.innerWidth / 2;
    mousePosition.y = window.innerHeight / 2;

    const top =
      (window.pageYOffset || document.scrollTop) - (document.clientTop || 0);
    mousePosition.y += top;
  });

  const draw = setInterval(createDots, 1000 / 30);

  window.addEventListener("resize", () => {
    clearInterval(draw);
    canvasDotsBg(); // safely re-init
  });
}
