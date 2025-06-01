// Efecto de rotación aleatoria en los botones
document.querySelectorAll('.menu-btn').forEach(btn => {
    btn.addEventListener('mouseenter', () => {
        btn.style.transform = `rotate(${Math.random() * 3 - 1.5}deg) scale(1.05)`;
    });
    
    btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
    });
});