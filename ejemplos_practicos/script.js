// Configuración inicial del experimento
const balls = [1, 2, 3, 4];
const combinations = [
  { balls: [1, 2], sum: 3 },
  { balls: [1, 3], sum: 4 },
  { balls: [1, 4], sum: 5 },
  { balls: [2, 3], sum: 5 },
  { balls: [2, 4], sum: 6 },
  { balls: [3, 4], sum: 7 }
];

// Probabilidades teóricas calculadas
const theoreticalProb = {
  3: 1/6,
  4: 1/6,
  5: 2/6,
  6: 1/6,
  7: 1/6
};

// Estado de la simulación
let results = {
  3: { theoretical: theoreticalProb[3], experimental: 0, count: 0, combinations: ['(1,2)'] },
  4: { theoretical: theoreticalProb[4], experimental: 0, count: 0, combinations: ['(1,3)'] },
  5: { theoretical: theoreticalProb[5], experimental: 0, count: 0, combinations: ['(1,4)', '(2,3)'] },
  6: { theoretical: theoreticalProb[6], experimental: 0, count: 0, combinations: ['(2,4)'] },
  7: { theoretical: theoreticalProb[7], experimental: 0, count: 0, combinations: ['(3,4)'] }
};

let totalTrials = 0;

// Referencias a elementos DOM
const simulateBtn = document.getElementById('simulate-btn');
const resetBtn = document.getElementById('reset-btn');
const multiBtn = document.getElementById('multi-btn');
const drawnBalls = document.getElementById('drawn-balls');
const sumValue = document.getElementById('sum-value');
const resultsBody = document.getElementById('results-body');
const instruction = document.getElementById('instruction');

// Colores para las pelotas extraídas
const ballColors = {
  1: 'linear-gradient(145deg, #FF5252, #F44336)',
  2: 'linear-gradient(145deg, #FF9800, #F57C00)',
  3: 'linear-gradient(145deg, #4CAF50, #388E3C)',
  4: 'linear-gradient(145deg, #2196F3, #1976D2)'
};

// Variable para el gráfico
let probabilityChart;

// Inicialización del gráfico
function initChart() {
  const ctx = document.getElementById('probability-chart').getContext('2d');
  
  probabilityChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Z = 3', 'Z = 4', 'Z = 5', 'Z = 6', 'Z = 7'],
      datasets: [
        {
          label: 'Probabilidad Teórica',
          data: Object.values(theoreticalProb),
          backgroundColor: 'rgba(102, 126, 234, 0.8)',
          borderColor: 'rgba(102, 126, 234, 1)',
          borderWidth: 2,
          borderRadius: 8,
          borderSkipped: false,
        },
        {
          label: 'Probabilidad Experimental',
          data: [0, 0, 0, 0, 0],
          backgroundColor: 'rgba(240, 147, 251, 0.8)',
          borderColor: 'rgba(240, 147, 251, 1)',
          borderWidth: 2,
          borderRadius: 8,
          borderSkipped: false,
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
          labels: {
            font: {
              size: 14,
              weight: '600'
            },
            padding: 20,
            usePointStyle: true,
            pointStyle: 'rectRounded'
          }
        },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          titleColor: 'white',
          bodyColor: 'white',
          borderColor: 'rgba(102, 126, 234, 1)',
          borderWidth: 1,
          cornerRadius: 10,
          callbacks: {
            label: function(context) {
              const percentage = (context.parsed.y * 100).toFixed(2);
              return `${context.dataset.label}: ${context.parsed.y.toFixed(4)} (${percentage}%)`;
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          max: 0.4,
          title: {
            display: true,
            text: 'Probabilidad',
            font: {
              size: 14,
              weight: '600'
            }
          },
          grid: {
            color: 'rgba(0, 0, 0, 0.1)',
            lineWidth: 1
          },
          ticks: {
            font: {
              size: 12
            },
            callback: function(value) {
              return (value * 100).toFixed(1) + '%';
            }
          }
        },
        x: {
          title: {
            display: true,
            text: 'Valores de Z (Suma)',
            font: {
              size: 14,
              weight: '600'
            }
          },
          grid: {
            display: false
          },
          ticks: {
            font: {
              size: 12,
              weight: '600'
            }
          }
        }
      },
      animation: {
        duration: 1000,
        easing: 'easeOutQuart'
      }
    }
  });
}

// Función principal para realizar una extracción
function simulateDraw() {
  // Crear una copia del array y mezclar aleatoriamente
  const shuffled = [...balls].sort(() => 0.5 - Math.random());
  const drawn = shuffled.slice(0, 2).sort((a, b) => a - b); // Ordenar para consistencia
  const sum = drawn[0] + drawn[1];
  
  // Actualizar contadores y estadísticas
  totalTrials++;
  results[sum].count++;
  
  // Recalcular probabilidades experimentales
  for (const key in results) {
    results[key].experimental = results[key].count / totalTrials;
  }
  
  // Actualizar interfaz visual
  updateDrawnBalls(drawn, sum);
  updateResultsTable();
  updateChart();
  
  // Agregar efecto de pulso al botón
  simulateBtn.classList.add('pulse');
  setTimeout(() => simulateBtn.classList.remove('pulse'), 1000);
}

// Función para actualizar la visualización de pelotas extraídas
function updateDrawnBalls(drawn, sum) {
  drawnBalls.innerHTML = '';
  
  drawn.forEach((ball, index) => {
    setTimeout(() => {
      const ballElement = document.createElement('div');
      ballElement.className = 'drawn-ball';
      ballElement.textContent = ball;
      ballElement.style.background = ballColors[ball];
      
      // Agregar efecto de aparición
      ballElement.style.animationDelay = `${index * 0.2}s`;
      
      drawnBalls.appendChild(ballElement);
    }, index * 200);
  });
  
  // Actualizar suma con animación
  setTimeout(() => {
    sumValue.textContent = sum;
    sumValue.style.transform = 'scale(1.2)';
    setTimeout(() => {
      sumValue.style.transform = 'scale(1)';
    }, 300);
  }, 400);
  
  instruction.textContent = `Extracción #${totalTrials} completada`;
}

// Función para actualizar la tabla de resultados
function updateResultsTable() {
  let html = '';
  
  for (const [sum, data] of Object.entries(results)) {
    const theoreticalPercent = (data.theoretical * 100).toFixed(2);
    const experimentalPercent = (data.experimental * 100).toFixed(2);
    const difference = Math.abs(data.theoretical - data.experimental);
    const convergenceClass = difference < 0.05 ? 'converging' : '';
    
    html += `
      <tr class="${convergenceClass}">
        <td><strong>${sum}</strong></td>
        <td>${data.combinations.join(', ')}</td>
        <td>${data.theoretical.toFixed(4)} (${theoreticalPercent}%)</td>
        <td>${data.experimental.toFixed(4)} (${experimentalPercent}%)</td>
        <td>${data.count}</td>
      </tr>
    `;
  }
  
  resultsBody.innerHTML = html;
}

// Función para actualizar el gráfico
function updateChart() {
  const experimentalData = Object.values(results).map(r => r.experimental);
  probabilityChart.data.datasets[1].data = experimentalData;
  probabilityChart.update('active');
}

// Función para reiniciar toda la simulación
function resetSimulation() {
  totalTrials = 0;
  
  // Reiniciar todos los contadores
  for (const key in results) {
    results[key].count = 0;
    results[key].experimental = 0;
  }
  
  // Limpiar interfaz visual
  drawnBalls.innerHTML = '';
  sumValue.textContent = '?';
  instruction.textContent = 'Presiona "Realizar extracción" para comenzar el experimento';
  
  // Actualizar tabla y gráfico
  updateResultsTable();
  updateChart();
  
  // Efecto visual de reinicio
  resetBtn.style.transform = 'rotate(360deg)';
  setTimeout(() => {
    resetBtn.style.transform = 'rotate(0deg)';
  }, 500);
}

// Función para realizar múltiples extracciones rápidas
function multiSimulate() {
  const iterations = 10;
  let currentIteration = 0;
  
  // Deshabilitar botón temporalmente
  multiBtn.disabled = true;
  multiBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Procesando...';
  
  const interval = setInterval(() => {
    simulateDraw();
    currentIteration++;
    
    if (currentIteration >= iterations) {
      clearInterval(interval);
      
      // Rehabilitar botón
      multiBtn.disabled = false;
      multiBtn.innerHTML = '<i class="fas fa-bolt"></i> 10 extracciones rápidas';
      
      // Mostrar mensaje de completado
      instruction.textContent = `¡${iterations} extracciones completadas! Total: ${totalTrials} ensayos`;
    }
  }, 300); // 300ms entre cada extracción para efecto visual
}

// Función para agregar estadísticas adicionales
function getStatistics() {
  if (totalTrials === 0) return null;
  
  let sumTotal = 0;
  let sumSquared = 0;
  
  for (const [sum, data] of Object.entries(results)) {
    const value = parseInt(sum);
    sumTotal += value * data.count;
    sumSquared += value * value * data.count;
  }
  
  const mean = sumTotal / totalTrials;
  const variance = (sumSquared / totalTrials) - (mean * mean);
  const stdDev = Math.sqrt(variance);
  
  return {
    mean: mean.toFixed(3),
    variance: variance.toFixed(3),
    stdDev: stdDev.toFixed(3),
    mode: '5', // El valor más probable teóricamente
    range: '4' // 7 - 3 = 4
  };
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
  initChart();
  updateResultsTable();
  
  // Agregar efectos de hover a los botones
  const buttons = document.querySelectorAll('.btn');
  buttons.forEach(button => {
    button.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-2px)';
    });
    
    button.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0)';
    });
  });
});

// Asignar event listeners a los botones
simulateBtn.addEventListener('click', simulateDraw);
resetBtn.addEventListener('click', resetSimulation);
multiBtn.addEventListener('click', multiSimulate);

// Agregar atajos de teclado para mejor experiencia
document.addEventListener('keydown', function(event) {
  switch(event.key) {
    case ' ': // Barra espaciadora para simular
      event.preventDefault();
      simulateDraw();
      break;
    case 'r': // R para reiniciar
    case 'R':
      if (event.ctrlKey || event.metaKey) {
        event.preventDefault();
        resetSimulation();
      }
      break;
    case 'm': // M para múltiples extracciones
    case 'M':
      if (event.ctrlKey || event.metaKey) {
        event.preventDefault();
        multiSimulate();
      }
      break;
  }
});

// Agregar información de ayuda con tooltips
const helpText = {
  'simulate-btn': 'Extrae 2 pelotas al azar y calcula su suma (Atajo: Barra espaciadora)',
  'reset-btn': 'Reinicia toda la simulación (Atajo: Ctrl+R)',
  'multi-btn': 'Realiza 10 extracciones consecutivas (Atajo: Ctrl+M)'
};

Object.entries(helpText).forEach(([id, text]) => {
  const element = document.getElementById(id);
  if (element) {
    element.title = text;
  }
});