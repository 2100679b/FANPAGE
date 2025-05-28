document.addEventListener('DOMContentLoaded', () => {
  const pelotasIniciales = Array.from({length: 10}, (_, i) => i + 1);
  let pelotas = [...pelotasIniciales];
  const resultadoElement = document.querySelector('.bubble');
  const contadorElement = document.getElementById('contador');
  const extraerBtn = document.getElementById('extraerBtn');
  const particlesContainer = document.querySelector('.particles');

  document.getElementById('reiniciar').addEventListener('click', () => {
    pelotas = [...pelotasIniciales];
    contadorElement.textContent = pelotas.length;
    resultadoElement.textContent = '¡Presiona el botón!';
    resultadoElement.style.backgroundColor = '';
    createParticles(20);
  });

  extraerBtn.addEventListener('click', () => {
    if (pelotas.length === 0) {
      showResult('¡No quedan pelotas!', '#ff7675');
      return;
    }

    const indiceAleatorio = Math.floor(Math.random() * pelotas.length);
    const pelotaSeleccionada = pelotas.splice(indiceAleatorio, 1)[0];
    
    showResult(`Pelota #${pelotaSeleccionada}`, '#6c5ce7');
    contadorElement.textContent = pelotas.length;
    createParticles(15);
    
    if (pelotas.length === 0) {
      setTimeout(() => {
        showResult('🎉 ¡Experimento completado!', '#00b894');
      }, 800);
    }
  });

  function showResult(text, color) {
    resultadoElement.textContent = text;
    resultadoElement.style.backgroundColor = color;
    resultadoElement.classList.add('highlight');
    setTimeout(() => resultadoElement.classList.remove('highlight'), 500);
  }

  function createParticles(count) {
    for (let i = 0; i < count; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      particle.style.left = Math.random() * 100 + '%';
      particle.style.background = `hsl(${Math.random() * 360}, 70%, 60%)`;
      particle.style.animationDelay = Math.random() * 0.5 + 's';
      particlesContainer.appendChild(particle);
      
      setTimeout(() => particle.remove(), 1500);
    }
  }
});