// Menú móvil
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const menu = document.querySelector('.menu');

mobileMenuBtn.addEventListener('click', () => {
    menu.classList.toggle('active');
});

// Cerrar menú al hacer clic en un enlace (solo móviles)
document.querySelectorAll('.menu-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        // Verificar si estamos en modo móvil
        if (window.innerWidth <= 768) {
            menu.classList.remove('active');
        }
    });
});

// Efecto de rotación aleatoria en los botones (solo escritorio)
document.querySelectorAll('.menu-btn').forEach(btn => {
    btn.addEventListener('mouseenter', () => {
        // Solo aplicar efecto en escritorio
        if (window.innerWidth > 768) {
            btn.style.transform = `rotate(${Math.random() * 3 - 1.5}deg) translateY(-3px)`;
        }
    });
    
    btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
    });
});

// Ajustar menú al cambiar tamaño de ventana
window.addEventListener('resize', () => {
    // Si la ventana es mayor a 768px, asegurarse de que el menú está visible
    if (window.innerWidth > 768) {
        menu.classList.add('active');
    } else {
        menu.classList.remove('active');
    }
});