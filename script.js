// Función para navegar a diferentes páginas
function navigate(page) {
    window.location.href = page;
    
    // Efecto de sonido opcional (descomentar para usar)
    // const audio = new Audio('click-sound.mp3');
    // audio.play();
}

// Efecto de rotación aleatoria en los botones
document.querySelectorAll('.menu-btn').forEach(btn => {
    btn.addEventListener('mouseenter', () => {
        btn.style.transform = `rotate(${Math.random() * 4 - 2}deg) scale(1.05)`;
    });
    
    btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
    });
});