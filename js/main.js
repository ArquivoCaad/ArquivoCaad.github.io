document.addEventListener('DOMContentLoaded', () => {
  // Tema toggle
  const themeToggle = document.getElementById('theme-toggle');
  themeToggle.addEventListener('change', () => {
      if (themeToggle.checked) {
          document.body.style.backgroundColor = '#ffffff';
          document.body.style.color = '#000000';
      } else {
          document.body.style.backgroundColor = '#0d1117';
          document.body.style.color = '#c9d1d9';
      }
  });

  // Interações de projeto
  const projects = document.querySelectorAll('.project');
  projects.forEach(project => {
      project.addEventListener('mouseenter', () => {
          project.style.transform = 'scale(1.1) rotateY(5deg)';
      });

      project.addEventListener('mouseleave', () => {
          project.style.transform = 'scale(1) rotateY(0)';
      });
  });

  // Envio de formulário
  const form = document.getElementById('contact-form');
  form.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('Obrigado pelo seu contato! Entraremos em breve.');
      form.reset();
  });
});
