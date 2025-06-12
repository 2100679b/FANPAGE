// Efectos de interacción para las tarjetas
document.addEventListener('DOMContentLoaded', function() {
  const cards = document.querySelectorAll('.card');
  
  cards.forEach(card => {
    card.addEventListener('click', function() {
      // Efecto visual al hacer clic
      this.style.transform = 'scale(0.98)';
      setTimeout(() => {
        this.style.transform = '';
      }, 150);
      
      // Simular navegación
      const cardId = this.id;
      let title;
      
      switch(cardId) {
        case 'uniforme':
          title = 'Distribución Uniforme Discreta';
          break;
        case 'bernoulli':
          title = 'Distribución de Bernoulli';
          break;
        case 'binomial':
          title = 'Distribución Binomial';
          break;
      }
      
      document.querySelector('header h1').textContent = `Cargando ${title}...`;
      
      setTimeout(() => {
        document.querySelector('header h1').textContent = '📊 Simulaciones de Probabilidad y Estadística';
        alert(`Se cargaría la simulación de ${title}`);
      }, 1000);
    });
  });
  
  // Efecto de carga para las barras de progreso
  const progressBars = document.querySelectorAll('.progress');
  progressBars.forEach(bar => {
    const width = bar.style.width;
    bar.style.width = '0';
    
    setTimeout(() => {
      bar.style.transition = 'width 1.5s ease';
      bar.style.width = width;
    }, 500);
  });
  
  // Animación para las características
  const features = document.querySelectorAll('.feature');
  features.forEach((feature, index) => {
    setTimeout(() => {
      feature.style.opacity = '0';
      feature.style.transform = 'translateY(20px)';
      feature.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      
      setTimeout(() => {
        feature.style.opacity = '1';
        feature.style.transform = 'translateY(0)';
      }, 100);
    }, index * 200);
  });
});