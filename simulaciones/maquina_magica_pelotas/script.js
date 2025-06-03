document.addEventListener('DOMContentLoaded', function() {
  const colores = [
    { background: 'linear-gradient(135deg, #FF416C, #FF4B2B)', text: '#fff' },
    { background: 'linear-gradient(135deg, #38ef7d, #11998e)', text: '#fff' },
    { background: 'linear-gradient(135deg, #56CCF2, #2F80ED)', text: '#fff' },
    { background: 'linear-gradient(135deg, #f7971e, #ffd200)', text: '#000' },
    { background: 'linear-gradient(135deg, #834d9b, #d04ed6)', text: '#fff' },
    { background: 'linear-gradient(135deg, #1d976c, #93f9b9)', text: '#000' },
    { background: 'linear-gradient(135deg, #f857a6, #ff5858)', text: '#fff' },
    { background: 'linear-gradient(135deg, #4facfe, #00f2fe)', text: '#fff' },
    { background: 'linear-gradient(135deg, #654ea3, #eaafc8)', text: '#fff' },
    { background: 'linear-gradient(135deg, #00c9ff, #92fe9d)', text: '#000' },
    { background: 'linear-gradient(135deg, #d9a7c7, #fffcdc)', text: '#000' },
    { background: 'linear-gradient(135deg, #ff7e5f, #feb47b)', text: '#000' }
  ];
  
  const extraerBtn = document.getElementById('extraerBtn');
  const resultado = document.getElementById('resultado');
  const particlesContainer = document.getElementById('particles');
  
  // Crear partículas de fondo
  function createParticles() {
    particlesContainer.innerHTML = '';
    for (let i = 0; i < 30; i++) {
      const particle = document.createElement('div');
      particle.classList.add('particle');
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.top = `${Math.random() * 100}%`;
      particle.style.width = `${Math.random() * 8 + 4}px`;
      particle.style.height = particle.style.width;
      particle.style.animationDelay = `${Math.random() * 5}s`;
      particle.style.background = `rgba(255, 255, 255, ${Math.random() * 0.5 + 0.3})`;
      particlesContainer.appendChild(particle);
    }
  }
  
  createParticles();
  
  // Generar un número aleatorio entre min y max
  function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  
  // Crear efecto de chispas
  function createSparkles() {
    const btnRect = extraerBtn.getBoundingClientRect();
    const sparkles = extraerBtn.querySelector('.sparkles');
    sparkles.innerHTML = '';
    
    for (let i = 0; i < 20; i++) {
      const sparkle = document.createElement('div');
      sparkle.classList.add('sparkle');
      
      // Posición aleatoria dentro del botón
      const x = Math.random() * btnRect.width;
      const y = Math.random() * btnRect.height;
      
      // Dirección aleatoria
      const angle = Math.random() * Math.PI * 2;
      const distance = Math.random() * 50 + 30;
      
      sparkle.style.setProperty('--tx', `${Math.cos(angle) * distance}px`);
      sparkle.style.setProperty('--ty', `${Math.sin(angle) * distance}px`);
      sparkle.style.left = `${x}px`;
      sparkle.style.top = `${y}px`;
      sparkle.style.animationDelay = `${Math.random() * 0.5}s`;
      
      sparkles.appendChild(sparkle);
    }
  }
  
  // Extraer una pelota
  function extraerPelota() {
    // Eliminar el mensaje inicial si existe
    const initialMessage = resultado.querySelector('.bubble');
    if (initialMessage) {
      initialMessage.style.opacity = '0';
      setTimeout(() => initialMessage.remove(), 300);
    }
    
    // Crear una nueva pelota
    const ball = document.createElement('div');
    ball.classList.add('ball');
    
    // Elegir un color aleatorio
    const colorIndex = getRandomNumber(0, colores.length - 1);
    const color = colores[colorIndex];
    ball.style.background = color.background;
    ball.style.color = color.text;
    
    // Generar un número aleatorio para la pelota
    const numero = getRandomNumber(1, 100);
    ball.textContent = numero;
    
    // Añadir la pelota al display
    resultado.appendChild(ball);
    
    // Crear efecto de chispas
    createSparkles();
    
    // Limitar el número de pelotas visibles a 20
    if (resultado.children.length > 20) {
      resultado.removeChild(resultado.children[0]);
    }
    
    // Agregar animación de rebote
    ball.style.animation = 'appear 0.5s ease-out';
    
    // Hacer que la pelota sea clickeable para eliminarla
    ball.addEventListener('click', function() {
      this.style.transform = 'scale(0)';
      this.style.opacity = '0';
      setTimeout(() => this.remove(), 300);
    });
  }
  
  // Event listeners
  extraerBtn.addEventListener('click', extraerPelota);
  extraerBtn.addEventListener('mouseenter', createSparkles);
  
  // Agregar animación inicial al botón
  setTimeout(() => {
    extraerBtn.style.animation = 'pulse 2s infinite';
  }, 1000);
});