// Animación de carga inicial
window.addEventListener('DOMContentLoaded', () => {
    // Mostrar el contenedor principal con animación
    document.querySelector('.container').classList.add('loaded');
    
    // Animación para los elementos de estadísticas
    animateElements('.stat-item', 300);
    
    // Animación para los botones del menú
    animateElements('.menu-btn', 500);
    
    // Animación para la fórmula
    setTimeout(() => {
        const formulaBox = document.querySelector('.formula-box');
        formulaBox.style.transform = 'scale(1.1)';
        formulaBox.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.2)';
        
        setTimeout(() => {
            formulaBox.style.transition = 'all 0.5s ease';
            formulaBox.style.transform = 'scale(1)';
            formulaBox.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.1)';
        }, 1000);
    }, 800);
});

// Función para animar elementos con retraso
function animateElements(selector, initialDelay) {
    const elements = document.querySelectorAll(selector);
    
    elements.forEach((element, index) => {
        setTimeout(() => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, 100);
        }, initialDelay + (index * 150));
    });
}

// Efecto de animación al pasar el mouse en los botones
document.querySelectorAll('.menu-btn').forEach(btn => {
    btn.addEventListener('mouseenter', () => {
        btn.style.transform = 'translateY(-8px)';
        btn.style.boxShadow = '0 15px 30px rgba(0, 0, 0, 0.2)';
    });
    
    btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translateY(0)';
        btn.style.boxShadow = '0 7px 20px rgba(0, 0, 0, 0.08)';
    });
});

// Efecto en los elementos de estadísticas
document.querySelectorAll('.stat-item').forEach(item => {
    item.addEventListener('mouseenter', () => {
        item.style.transform = 'translateY(-8px) scale(1.05)';
    });
    
    item.addEventListener('mouseleave', () => {
        item.style.transform = '';
    });
});