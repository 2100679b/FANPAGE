// Efecto de animación al pasar el mouse
document.querySelectorAll('.menu-btn').forEach(btn => {
    btn.addEventListener('mouseenter', () => {
        btn.style.transform = 'translateY(-5px)';
    });
    
    btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
    });
});

// Efecto de carga inicial
window.addEventListener('DOMContentLoaded', () => {
    // Aplicar clase para mostrar con animación
    setTimeout(() => {
        document.querySelector('.container').classList.add('loaded');
    }, 100);
    
    // Animación para los elementos de estadísticas
    const statItems = document.querySelectorAll('.stat-item');
    statItems.forEach((item, index) => {
        setTimeout(() => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            }, 300 + (index * 200));
        }, 500);
    });
    
    // Animación para los botones del menú
    const menuBtns = document.querySelectorAll('.menu-btn');
    menuBtns.forEach((btn, index) => {
        setTimeout(() => {
            btn.style.opacity = '0';
            btn.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                btn.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                btn.style.opacity = '1';
                btn.style.transform = 'translateY(0)';
            }, 800 + (index * 100));
        }, 500);
    });
});