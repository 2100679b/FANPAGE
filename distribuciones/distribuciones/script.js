class UniformDiscreteSimulator {
    constructor() {
        this.results = [];
        this.frequencies = {};
        this.initializeElements();
        this.setupEventListeners();
        this.initializeCanvas();
        this.updateDistributionInfo();
    }

    initializeElements() {
        this.minValueInput = document.getElementById('min-value');
        this.maxValueInput = document.getElementById('max-value');
        this.trialsInput = document.getElementById('trials');
        this.simulateBtn = document.getElementById('simulate-btn');
        this.resetBtn = document.getElementById('reset-btn');
        
        this.rangeDisplay = document.getElementById('range-display');
        this.nValuesDisplay = document.getElementById('n-values');
        this.probPerValueDisplay = document.getElementById('prob-per-value');
        this.theoreticalMeanDisplay = document.getElementById('theoretical-mean');
        this.theoreticalVarianceDisplay = document.getElementById('theoretical-variance');
        
        this.experimentalMeanDisplay = document.getElementById('experimental-mean');
        this.experimentalVarianceDisplay = document.getElementById('experimental-variance');
        this.stdDeviationDisplay = document.getElementById('std-deviation');
        
        this.sequenceDisplay = document.getElementById('sequence');
        this.frequencyTableContent = document.getElementById('frequency-table-content');
        this.canvas = document.getElementById('histogram');
        this.ctx = this.canvas.getContext('2d');
    }

    setupEventListeners() {
        this.minValueInput.addEventListener('input', () => this.updateDistributionInfo());
        this.maxValueInput.addEventListener('input', () => this.updateDistributionInfo());
        
        this.simulateBtn.addEventListener('click', () => this.runSimulation());
        this.resetBtn.addEventListener('click', () => this.reset());

        document.querySelectorAll('.example-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const min = parseInt(e.target.dataset.min);
                const max = parseInt(e.target.dataset.max);
                const trials = parseInt(e.target.dataset.trials);
                
                this.minValueInput.value = min;
                this.maxValueInput.value = max;
                this.trialsInput.value = trials;
                
                this.updateDistributionInfo();
                this.runSimulation();
                
                document.getElementById('simulador').scrollIntoView({ 
                    behavior: 'smooth' 
                });
            });
        });
    }

    initializeCanvas() {
        this.canvas.width = 800;
        this.canvas.height = 400;
        this.drawEmptyHistogram();
    }

    updateDistributionInfo() {
        const min = parseInt(this.minValueInput.value);
        const max = parseInt(this.maxValueInput.value);
        
        if (min >= max) {
            this.maxValueInput.value = min + 1;
            return;
        }
        
        const n = max - min + 1;
        const prob = 1 / n;
        const mean = (min + max) / 2;
        const variance = (n * n - 1) / 12;
        
        this.rangeDisplay.textContent = `[${min}, ${max}]`;
        this.nValuesDisplay.textContent = n;
        this.probPerValueDisplay.textContent = prob.toFixed(4);
        this.theoreticalMeanDisplay.textContent = mean.toFixed(2);
        this.theoreticalVarianceDisplay.textContent = variance.toFixed(2);
    }

    runSimulation() {
        const min = parseInt(this.minValueInput.value);
        const max = parseInt(this.maxValueInput.value);
        const trials = parseInt(this.trialsInput.value);
        
        if (min >= max) {
            alert('El valor máximo debe ser mayor que el valor mínimo');
            return;
        }
        
        if (trials <= 0 || trials > 10000) {
            alert('El número de experimentos debe estar entre 1 y 10000');
            return;
        }
        
        this.results = [];
        this.frequencies = {};
        
        // Inicializar frecuencias
        for (let i = min; i <= max; i++) {
            this.frequencies[i] = 0;
        }
        
        // Ejecutar simulación con animación
        this.simulateWithAnimation(min, max, trials, 0);
    }

    simulateWithAnimation(min, max, trials, currentTrial) {
        if (currentTrial >= trials) {
            this.updateVisualizations(min, max);
            return;
        }
        
        // Generar un valor aleatorio uniforme discreto
        const value = Math.floor(Math.random() * (max - min + 1)) + min;
        this.results.push(value);
        this.frequencies[value]++;
        
        // Actualizar estadísticas cada 100 trials o al final
        if (currentTrial % 100 === 0 || currentTrial === trials - 1) {
            this.updateStatistics();
            this.updateSequenceDisplay();
            this.updateFrequencyTable(min, max);
        }
        
        // Continuar con el siguiente trial
        setTimeout(() => {
            this.simulateWithAnimation(min, max, trials, currentTrial + 1);
        }, Math.max(1, 50 - trials / 200)); // Velocidad adaptiva
    }

    updateStatistics() {
        if (this.results.length === 0) return;
        
        const sum = this.results.reduce((acc, val) => acc + val, 0);
        const mean = sum / this.results.length;
        
        const variance = this.results.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / this.results.length;
        const stdDev = Math.sqrt(variance);
        
        this.experimentalMeanDisplay.textContent = mean.toFixed(4);
        this.experimentalVarianceDisplay.textContent = variance.toFixed(4);
        this.stdDeviationDisplay.textContent = stdDev.toFixed(4);
    }

    updateSequenceDisplay() {
        const lastResults = this.results.slice(-30);
        this.sequenceDisplay.innerHTML = '';
        
        lastResults.forEach((result, index) => {
            const item = document.createElement('div');
            item.className = 'result-item';
            item.textContent = result;
            item.style.animationDelay = `${index * 0.05}s`;
            this.sequenceDisplay.appendChild(item);
        });
    }

    updateFrequencyTable(min, max) {
        let tableHTML = `
        <table class="freq-table">
            <thead>
                <tr>
                    <th>Valor</th>
                    <th>Frecuencia</th>
                    <th>Frecuencia Relativa</th>
                    <th>Probabilidad Teórica</th>
                </tr>
            </thead>
            <tbody>
        `;
        
        const n = max - min + 1;
        const theoreticalProb = 1 / n;
        
        for (let i = min; i <= max; i++) {
            const freq = this.frequencies[i] || 0;
            const relFreq = this.results.length > 0 ? (freq / this.results.length) : 0;
            
            tableHTML += `
                <tr>
                    <td>${i}</td>
                    <td>${freq}</td>
                    <td>${relFreq.toFixed(4)}</td>
                    <td>${theoreticalProb.toFixed(4)}</td>
                </tr>
            `;
        }
        
        tableHTML += `
            </tbody>
        </table>
        `;
        
        this.frequencyTableContent.innerHTML = tableHTML;
    }

    updateVisualizations(min, max) {
        this.drawHistogram(min, max);
    }

    drawHistogram(min, max) {
        const n = max - min + 1;
        const values = Array.from({length: n}, (_, i) => min + i);
        
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Configuración del gráfico
        const barWidth = 40;
        const maxBarHeight = 300;
        const padding = 20;
        const maxFreq = Math.max(...values.map(v => this.frequencies[v] || 0), 1);
        const baseY = 350;
        
        // Dibujar eje X
        this.ctx.beginPath();
        this.ctx.moveTo(padding, baseY);
        this.ctx.lineTo(this.canvas.width - padding, baseY);
        this.ctx.strokeStyle = '#333';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
        
        // Dibujar eje Y
        this.ctx.beginPath();
        this.ctx.moveTo(padding, 50);
        this.ctx.lineTo(padding, baseY);
        this.ctx.stroke();
        
        // Dibujar barras
        values.forEach((value, index) => {
            const x = padding + (index * (barWidth + 10));
            const freq = this.frequencies[value] || 0;
            const height = (freq / maxFreq) * maxBarHeight;
            
            // Gradiente para la barra
            const gradient = this.ctx.createLinearGradient(0, baseY - height, 0, baseY);
            gradient.addColorStop(0, '#ff6b6b');
            gradient.addColorStop(1, '#4ecdc4');
            
            this.ctx.fillStyle = gradient;
            this.ctx.fillRect(x, baseY - height, barWidth, height);
            
            // Etiqueta del valor
            this.ctx.fillStyle = '#333';
            this.ctx.font = '14px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(value, x + barWidth / 2, baseY + 20);
            
            // Etiqueta de frecuencia
            if (height > 30) {
                this.ctx.fillStyle = 'white';
                this.ctx.fillText(freq, x + barWidth / 2, baseY - height / 2 + 5);
            }
        });
        
        // Título
        this.ctx.fillStyle = '#333';
        this.ctx.font = 'bold 18px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('Distribución de Frecuencias', this.canvas.width / 2, 30);
        
        // Etiqueta eje Y
        this.ctx.save();
        this.ctx.translate(10, 200);
        this.ctx.rotate(-Math.PI / 2);
        this.ctx.fillText('Frecuencia', 0, 0);
        this.ctx.restore();
        
        // Etiqueta eje X
        this.ctx.fillText('Valores', this.canvas.width / 2, this.canvas.height - 5);
    }

    drawEmptyHistogram() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Título
        this.ctx.fillStyle = '#666';
        this.ctx.font = 'bold 18px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('Distribución de Frecuencias', this.canvas.width / 2, 30);
        
        // Mensaje de inicio
        this.ctx.font = '16px Arial';
        this.ctx.fillStyle = '#999';
        this.ctx.fillText('Haz clic en "Simular Experimento" para ver los resultados', this.canvas.width / 2, this.canvas.height / 2);
        
        // Ejes
        this.ctx.strokeStyle = '#333';
        this.ctx.lineWidth = 2;
        const padding = 20;
        const baseY = 350;
        
        this.ctx.beginPath();
        this.ctx.moveTo(padding, baseY);
        this.ctx.lineTo(this.canvas.width - padding, baseY);
        this.ctx.moveTo(padding, 50);
        this.ctx.lineTo(padding, baseY);
        this.ctx.stroke();
        
        // Etiquetas de ejes
        this.ctx.fillStyle = '#333';
        this.ctx.font = '14px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('Valores', this.canvas.width / 2, this.canvas.height - 5);
        
        this.ctx.save();
        this.ctx.translate(10, 200);
        this.ctx.rotate(-Math.PI / 2);
        this.ctx.fillText('Frecuencia', 0, 0);
        this.ctx.restore();
    }

    reset() {
        this.results = [];
        this.frequencies = {};
        
        this.experimentalMeanDisplay.textContent = '0.00';
        this.experimentalVarianceDisplay.textContent = '0.00';
        this.stdDeviationDisplay.textContent = '0.00';
        
        this.sequenceDisplay.innerHTML = '';
        this.frequencyTableContent.innerHTML = '';
        this.drawEmptyHistogram();
        
        // Animación de reset
        const cards = document.querySelectorAll('.stat-card');
        cards.forEach(card => {
            card.style.transform = 'scale(0.95)';
            setTimeout(() => {
                card.style.transform = 'scale(1)';
            }, 100);
        });
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    const simulator = new UniformDiscreteSimulator();
    
    // Animaciones de entrada
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '0';
                entry.target.style.transform = 'translateY(20px)';
                entry.target.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, 50);
                
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observar elementos para animaciones
    document.querySelectorAll('.theory-card, .example-card, .app-category').forEach(el => {
        observer.observe(el);
    });

    // Efecto parallax suave en el hero
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');
        if (hero) {
            hero.style.transform = `translateY(${scrolled * 0.5}px)`;
        }
    });

    // Navegación suave
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Validación en tiempo real
    const trialsInput = document.getElementById('trials');
    trialsInput.addEventListener('input', (e) => {
        const value = parseInt(e.target.value);
        if (value > 10000) {
            e.target.value = 10000;
        } else if (value < 1) {
            e.target.value = 1;
        }
    });

    console.log('🎲 Simulador de Distribución Uniforme Discreta cargado correctamente');
});