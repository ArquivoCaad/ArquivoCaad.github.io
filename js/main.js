document.addEventListener('DOMContentLoaded', () => {
  const projects = document.querySelectorAll('.project');
  projects.forEach(project => {
      project.addEventListener('mouseenter', () => {
          project.style.transform = 'scale(1.05) rotateY(5deg)';
      });

      project.addEventListener('mouseleave', () => {
          project.style.transform = 'scale(1) rotateY(0)';
      });
  });

const camadas = document.querySelectorAll(".camada");

window.addEventListener("mousemove", (e) => {
  const { innerWidth } = window;

  // posição do mouse normalizada (-0.5 a 0.5)
  const mouseX = (e.clientX / innerWidth) - 0.5;

  camadas.forEach(camada => {
    const speed = camada.getAttribute("data-speed");
    const x = mouseX * speed * 100;

    camada.style.transform = `
      translate(-50%, -50%)
      translateX(${x}px)
    `;
  });
});

});
