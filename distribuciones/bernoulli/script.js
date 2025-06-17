class BernoulliSimulator {
    constructor() {
        this.results = [];
        this.initializeElements();
        this.setupEventListeners();
        this.initializeCanvas();
    }

    initializeElements() {
        this.probabilitySlider = document.getElementById('probability');
        this.probValueDisplay = document.getElementById('prob-value');
        this.trialsInput = document.getElementById('trials');
        this.simulateBtn = document.getElementById('simulate-btn');
        this.resetBtn = document.getElementById('reset-btn');
        
        this.successesDisplay = document.getElementById('successes');
        this.failuresDisplay = document.getElementById('failures');
        this.successRateDisplay = document.getElementById('success-rate');
        this.theoreticalMeanDisplay = document.getElementById('theoretical-mean');
        
        this.sequenceDisplay = document.getElementById('sequence');
        this.canvas = document.getElementById('histogram');
        this.ctx = this.canvas.getContext('2d');
    }

    setupEventListeners() {
        this.probabilitySlider.addEventListener('input', (e) => {
            const value = parseFloat(e.target.value);
            this.probValueDisplay.textContent = value.toFixed(2);
            this.theoreticalMeanDisplay.textContent = value.toFixed(2);
        });

        this.simulateBtn.addEventListener('click', () => this.runSimulation());
        this.resetBtn.addEventListener('click', () => this.reset());

        // Event listeners para botones de ejemplo
        document.querySelectorAll('.example-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const p = parseFloat(e.target.dataset.p);
                const trials = parseInt(e.target.dataset.trials);
                this.setParameters(p, trials);
                this.runSimulation();
                
                // Scroll suave al simulador
                document.getElementById('simulador').scrollIntoView({ 
                    behavior: 'smooth' 
                });
            });
        });
    }

    initializeCanvas() {
        this.canvas.width = 600;
        this.canvas.height = 300;
        this.drawEmptyHistogram();
    }

    setParameters(p, trials) {
        this.probabilitySlider.value = p;
        this.probValueDisplay.textContent = p.toFixed(2);
        this.theoreticalMeanDisplay.textContent = p.toFixed(2);
        this.trialsInput.value = trials;
    }

    runSimulation() {
        const p = parseFloat(this.probabilitySlider.value);
        const trials = parseInt(this.trialsInput.value);
        
        if (trials <= 0 || trials > 1000) {
            alert('El número de experimentos debe estar entre 1 y 1000');
            return;
        }

        this.results = [];
        
        // Generar resultados con animación
        this.simulateWithAnimation(p, trials, 0);
    }

    simulateWithAnimation(p, trials, currentTrial) {
        if (currentTrial >= trials) {
            this.updateVisualizations();
            return;
        }

        // Generar resultado de Bernoulli
        const result = Math.random() < p ? 1 : 0;
        this.results.push(result);

        // Actualizar estadísticas en tiempo real cada 10 trials o en el último
        if (currentTrial % 10 === 0 || currentTrial === trials - 1) {
            this.updateStatistics();
            this.updateSequenceDisplay();
        }

        // Continuar con el siguiente trial
        setTimeout(() => {
            this.simulateWithAnimation(p, trials, currentTrial + 1);
        }, Math.max(1, 50 - trials / 20)); // Velocidad adaptiva
    }

    updateStatistics() {
        const successes = this.results.filter(r => r === 1).length;
        const failures = this.results.length - successes;
        const successRate = this.results.length > 0 ? successes / this.results.length : 0;

        this.successesDisplay.textContent = successes;
        this.failuresDisplay.textContent = failures;
        this.successRateDisplay.textContent = successRate.toFixed(3);
    }

    updateSequenceDisplay() {
        const lastResults = this.results.slice(-20);
        this.sequenceDisplay.innerHTML = '';
        
        lastResults.forEach((result, index) => {
            const item = document.createElement('div');
            item.className = `result-item ${result ? 'result-success' : 'result-failure'}`;
            item.textContent = result;
            item.style.animationDelay = `${index * 0.05}s`;
            this.sequenceDisplay.appendChild(item);
        });
    }

    updateVisualizations() {
        this.drawHistogram();
    }

    drawHistogram() {
        const successes = this.results.filter(r => r === 1).length;
        const failures = this.results.length - successes;
        
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Configuración del gráfico
        const barWidth = 120;
        const maxHeight = 200;
        const maxCount = Math.max(successes, failures, 1);
        
        // Calcular alturas
        const successHeight = (successes / maxCount) * maxHeight;
        const failureHeight = (failures / maxCount) * maxHeight;
        
        // Posiciones
        const successX = 150;
        const failureX = 330;
        const baseY = 250;
        
        // Dibujar barras con gradientes
        this.drawGradientBar(successX, baseY - successHeight, barWidth, successHeight, '#4CAF50', '#66BB6A');
        this.drawGradientBar(failureX, baseY - failureHeight, barWidth, failureHeight, '#f44336', '#EF5350');
        
        // Etiquetas y valores
        this.ctx.fillStyle = '#333';
        this.ctx.font = 'bold 16px Arial';
        this.ctx.textAlign = 'center';
        
        // Etiquetas de categorías
        this.ctx.fillText('Éxitos (1)', successX + barWidth/2, baseY + 20);
        this.ctx.fillText('Fracasos (0)', failureX + barWidth/2, baseY + 20);
        
        // Valores en las barras
        this.ctx.fillStyle = 'white';
        this.ctx.font = 'bold 20px Arial';
        if (successHeight > 30) {
            this.ctx.fillText(successes, successX + barWidth/2, baseY - successHeight/2 + 7);
        }
        if (failureHeight > 30) {
            this.ctx.fillText(failures, failureX + barWidth/2, baseY - failureHeight/2 + 7);
        }
        
        // Título del gráfico
        this.ctx.fillStyle = '#333';
        this.ctx.font = 'bold 18px Arial';
        this.ctx.fillText('Histograma de Resultados', this.canvas.width/2, 30);
        
        // Líneas de referencia
        this.drawGridLines(baseY, maxCount);
    }

    drawGradientBar(x, y, width, height, color1, color2) {
        const gradient = this.ctx.createLinearGradient(0, y, 0, y + height);
        gradient.addColorStop(0, color1);
        gradient.addColorStop(1, color2);
        
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(x, y, width, height);
        
        // Sombra
        this.ctx.shadowColor = 'rgba(0,0,0,0.3)';
        this.ctx.shadowBlur = 10;
        this.ctx.shadowOffsetX = 3;
        this.ctx.shadowOffsetY = 3;
        this.ctx.fillRect(x, y, width, height);
        
        // Reset shadow
        this.ctx.shadowColor = 'transparent';
        this.ctx.shadowBlur = 0;
        this.ctx.shadowOffsetX = 0;
        this.ctx.shadowOffsetY = 0;
        
        // Borde
        this.ctx.strokeStyle = 'rgba(255,255,255,0.3)';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(x, y, width, height);
    }

    drawGridLines(baseY, maxCount) {
        this.ctx.strokeStyle = 'rgba(0,0,0,0.1)';
        this.ctx.lineWidth = 1;
        this.ctx.setLineDash([2, 2]);
        
        const steps = 5;
        for (let i = 1; i <= steps; i++) {
            const y = baseY - (i * 200 / steps);
            this.ctx.beginPath();
            this.ctx.moveTo(100, y);
            this.ctx.lineTo(500, y);
            this.ctx.stroke();
            
            // Etiquetas del eje Y
            this.ctx.fillStyle = '#666';
            this.ctx.font = '12px Arial';
            this.ctx.textAlign = 'right';
            this.ctx.fillText(Math.round(maxCount * i / steps), 95, y + 4);
        }
        
        this.ctx.setLineDash([]);
    }

    drawEmptyHistogram() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Título
        this.ctx.fillStyle = '#666';
        this.ctx.font = 'bold 18px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('Histograma de Resultados', this.canvas.width/2, 30);
        
        // Mensaje de inicio
        this.ctx.font = '16px Arial';
        this.ctx.fillStyle = '#999';
        this.ctx.fillText('Haz clic en "Simular Experimento" para ver los resultados', this.canvas.width/2, this.canvas.height/2);
        
        // Ejes
        this.ctx.strokeStyle = '#333';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(100, 250);
        this.ctx.lineTo(500, 250);
        this.ctx.moveTo(100, 50);
        this.ctx.lineTo(100, 250);
        this.ctx.stroke();
        
        // Etiquetas de ejes
        this.ctx.fillStyle = '#333';
        this.ctx.font = '14px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('Resultado', 300, 280);
        
        this.ctx.save();
        this.ctx.translate(30, 150);
        this.ctx.rotate(-Math.PI / 2);
        this.ctx.fillText('Frecuencia', 0, 0);
        this.ctx.restore();
    }

    reset() {
        this.results = [];
        this.successesDisplay.textContent = '0';
        this.failuresDisplay.textContent = '0';
        this.successRateDisplay.textContent = '0.00';
        this.sequenceDisplay.innerHTML = '';
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

// Animaciones adicionales para mejorar la experiencia
class AnimationManager {
    static fadeIn(element, duration = 500) {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = `opacity ${duration}ms ease, transform ${duration}ms ease`;
        
        setTimeout(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, 50);
    }

    static pulse(element) {
        element.style.transform = 'scale(1.05)';
        setTimeout(() => {
            element.style.transform = 'scale(1)';
        }, 200);
    }

    static shake(element) {
        element.style.animation = 'shake 0.5s';
        setTimeout(() => {
            element.style.animation = '';
        }, 500);
    }
}

// Agregar animación de shake a CSS
const shakeStyle = document.createElement('style');
shakeStyle.textContent = `
@keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-5px); }
    75% { transform: translateX(5px); }
}
`;
document.head.appendChild(shakeStyle);

// Funciones de utilidad estadística
class StatisticsUtil {
    static calculateConfidenceInterval(p, n, confidence = 0.95) {
        const z = confidence === 0.95 ? 1.96 : 2.58;
        const margin = z * Math.sqrt((p * (1 - p)) / n);
        return {
            lower: Math.max(0, p - margin),
            upper: Math.min(1, p + margin)
        };
    }

    static chiSquareTest(observed, expected) {
        const chi2 = observed.reduce((sum, obs, i) => {
            const exp = expected[i];
            return sum + Math.pow(obs - exp, 2) / exp;
        }, 0);
        return chi2;
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    const simulator = new BernoulliSimulator();
    
    // Animaciones de entrada
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                AnimationManager.fadeIn(entry.target);
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

    // Tooltip dinámico para controles
    const tooltips = {
        'probability': 'Ajusta la probabilidad de éxito para el experimento de Bernoulli',
        'trials': 'Número total de experimentos independientes a realizar'
    };

    Object.keys(tooltips).forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.title = tooltips[id];
        }
    });

    // Validación en tiempo real
    const trialsInput = document.getElementById('trials');
    trialsInput.addEventListener('input', (e) => {
        const value = parseInt(e.target.value);
        if (value > 1000) {
            e.target.value = 1000;
            AnimationManager.shake(e.target);
        } else if (value < 1) {
            e.target.value = 1;
            AnimationManager.shake(e.target);
        }
    });

    // Easter egg: Konami code para modo desarrollador
    const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'];
    let konamiIndex = 0;

    document.addEventListener('keydown', (e) => {
        if (e.code === konamiCode[konamiIndex]) {
            konamiIndex++;
            if (konamiIndex === konamiCode.length) {
                console.log('🎉 ¡Modo desarrollador activado!');
                console.log('Estadísticas avanzadas disponibles en window.bernoulliStats');
                window.bernoulliStats = StatisticsUtil;
                konamiIndex = 0;
            }
        } else {
            konamiIndex = 0;
        }
    });

    console.log('🎲 Simulador de Distribución de Bernoulli cargado correctamente');
});