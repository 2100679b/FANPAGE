// script.js
document.addEventListener('DOMContentLoaded', function() {
  // Animación para las tarjetas de distribución
  const distributionCards = document.querySelectorAll('.distribution-card');
  
  distributionCards.forEach((card, index) => {
    setTimeout(() => {
      card.style.transform = 'translateY(0)';
      card.style.opacity = '1';
    }, 200 * index);
  });
  
  // Efecto hover para los enlaces de distribución
  const distributionLinks = document.querySelectorAll('.distribution-link');
  
  distributionLinks.forEach(link => {
    link.addEventListener('mouseenter', function() {
      this.querySelector('.fa-chevron-right').style.transform = 'translateX(5px)';
    });
    
    link.addEventListener('mouseleave', function() {
      this.querySelector('.fa-chevron-right').style.transform = 'translateX(0)';
    });
  });
  
  // Animación para la barra de progreso
  const progressBars = document.querySelectorAll('.progress');
  
  progressBars.forEach(bar => {
    const width = bar.style.width;
    bar.style.width = '0';
    
    setTimeout(() => {
      bar.style.transition = 'width 1.5s ease';
      bar.style.width = width;
    }, 500);
  });
  
  // Actualizar año en el copyright
  const yearElement = document.querySelector('.copyright p');
  if (yearElement) {
    const currentYear = new Date().getFullYear();
    yearElement.innerHTML = yearElement.innerHTML.replace('2023', currentYear);
  }
});