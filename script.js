// Espera a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    // Agrega la clase 'loaded' al contenedor para activar la animación
    document.querySelector('.container').classList.add('loaded');
    
    // Animación para los elementos de estadísticas
    const statItems = document.querySelectorAll('.stat-item');
    statItems.forEach((item, index) => {
        setTimeout(() => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(20px)';
            item.style.transition = 'all 0.5s ease';
            
            setTimeout(() => {
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            }, 50);
        }, 200 * index);
    });
    
    // Animación para los botones del menú
    const menuButtons = document.querySelectorAll('.menu-btn');
    menuButtons.forEach((button, index) => {
        setTimeout(() => {
            button.style.opacity = '0';
            button.style.transform = 'translateY(20px)';
            button.style.transition = 'all 0.5s ease';
            
            setTimeout(() => {
                button.style.opacity = '1';
                button.style.transform = 'translateY(0)';
            }, 50);
        }, 300 + (index * 100));
    });
    
    // Animación para la sección matemática
    const mathConcept = document.querySelector('.math-concept');
    setTimeout(() => {
        mathConcept.style.opacity = '0';
        mathConcept.style.transform = 'translateY(30px)';
        mathConcept.style.transition = 'all 0.8s ease';
        
        setTimeout(() => {
            mathConcept.style.opacity = '1';
            mathConcept.style.transform = 'translateY(0)';
        }, 50);
    }, 1000);
    
    // Efecto de desplazamiento suave para enlaces internos
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
});