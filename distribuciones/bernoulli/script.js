// Inicializar gráficos
const pmfCtx = document.getElementById('pmf-chart').getContext('2d');
const cdfCtx = document.getElementById('cdf-chart').getContext('2d');

// Elementos del DOM
const probabilitySlider = document.getElementById('probability-slider');
const probabilityInput = document.getElementById('probability-input');
const successProbElement = document.getElementById('success-prob');
const failureProbElement = document.getElementById('failure-prob');
const expectedValueElement = document.getElementById('expected-value');
const varianceElement = document.getElementById('variance');
const simulateBtn = document.getElementById('simulate-btn');

// Variables
let p = 0.5;
let pmfChart, cdfChart;

// Sincronizar slider e input
probabilitySlider.addEventListener('input', function() {
  p = parseFloat(this.value);
  probabilityInput.value = p;
  updateCalculations();
  updateCharts();
});

probabilityInput.addEventListener('input', function() {
  let value = parseFloat(this.value);
  if (isNaN(value)) value = 0;
  if (value < 0) value = 0;
  if (value > 1) value = 1;
  
  p = value;
  probabilitySlider.value = p;
  this.value = p;
  updateCalculations();
  updateCharts();
});

// Función para simular experimento
simulateBtn.addEventListener('click', function() {
  // Animación del botón
  this.classList.add('clicked');
  setTimeout(() => {
    this.classList.remove('clicked');
  }, 300);
  
  // Simular experimento
  const result = Math.random() < p ? 1 : 0;
  
  // Mostrar resultado
  const resultText = result === 1 ? "Éxito (1)" : "Fracaso (0)";
  simulateBtn.textContent = `Resultado: ${resultText}`;
  
  setTimeout(() => {
    simulateBtn.textContent = "Simular experimento";
  }, 2000);
});

// Actualizar cálculos
function updateCalculations() {
  const successProb = p;
  const failureProb = 1 - p;
  const expectedValue = p;
  const variance = p * (1 - p);
  
  successProbElement.textContent = successProb.toFixed(4);
  failureProbElement.textContent = failureProb.toFixed(4);
  expectedValueElement.textContent = expectedValue.toFixed(4);
  varianceElement.textContent = variance.toFixed(4);
}

// Crear gráficos
function createCharts() {
  // Destruir gráficos existentes si existen
  if (pmfChart) pmfChart.destroy();
  if (cdfChart) cdfChart.destroy();
  
  // Datos para PMF
  const pmfData = {
    labels: ['0 (Fracaso)', '1 (Éxito)'],
    datasets: [{
      label: 'Función de Masa de Probabilidad',
      data: [1-p, p],
      backgroundColor: [
        'rgba(67, 97, 238, 0.7)',
        'rgba(76, 201, 240, 0.7)'
      ],
      borderColor: [
        'rgba(67, 97, 238, 1)',
        'rgba(76, 201, 240, 1)'
      ],
      borderWidth: 1
    }]
  };
  
  // Datos para CDF
  const cdfData = {
    labels: ['x < 0', '0 ≤ x < 1', 'x ≥ 1'],
    datasets: [{
      label: 'Función de Distribución Acumulada',
      data: [0, 1-p, 1],
      backgroundColor: 'rgba(67, 97, 238, 0.2)',
      borderColor: 'rgba(67, 97, 238, 1)',
      borderWidth: 2,
      pointBackgroundColor: 'rgba(67, 97, 238, 1)',
      pointRadius: 6,
      tension: 0
    }]
  };
  
  // Configuración común
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        max: 1.1,
        title: {
          display: true,
          text: 'Probabilidad'
        }
      }
    },
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `Probabilidad: ${context.parsed.y.toFixed(4)}`;
          }
        }
      }
    }
  };
  
  // Crear gráficos
  pmfChart = new Chart(pmfCtx, {
    type: 'bar',
    data: pmfData,
    options: chartOptions
  });
  
  cdfChart = new Chart(cdfCtx, {
    type: 'line',
    data: cdfData,
    options: chartOptions
  });
}

// Actualizar gráficos
function updateCharts() {
  // Actualizar datos
  pmfChart.data.datasets[0].data = [1-p, p];
  cdfChart.data.datasets[0].data = [0, 1-p, 1];
  
  // Actualizar gráficos
  pmfChart.update();
  cdfChart.update();
}

// Inicializar
document.addEventListener('DOMContentLoaded', function() {
  createCharts();
  updateCalculations();
  
  // Animación inicial
  setTimeout(() => {
    document.querySelector('.container').style.opacity = 1;
    document.querySelector('.container').style.transform = 'translateY(0)';
  }, 100);
});