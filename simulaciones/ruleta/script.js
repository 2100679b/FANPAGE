let contador = 1;

function apostar(apuesta) {
  // Simula la ruleta: 18 rojo, 18 negro, 1 verde
  const ruleta = [...Array(18).fill('rojo'), ...Array(18).fill('negro'), 'verde'];
  const resultado = ruleta[Math.floor(Math.random() * ruleta.length)];

  const resultadoTexto = `La ruleta cayó en: <span class="${resultado}">${resultado.toUpperCase()}</span>. `;
  const mensajeFinal = (resultado === apuesta) ? "¡Ganaste! 🎉" : "Perdiste. 😞";

  // Mostrar resultado con colores
  document.getElementById("resultado").innerHTML = resultadoTexto + mensajeFinal;

  // Agregar al historial
  const historial = document.getElementById("historial");
  historial.innerHTML += `
    <p>🌀 <strong>Ronda ${contador++}:</strong> Apostaste a 
    <span class="${apuesta}">${apuesta}</span> ➜ Resultado: 
    <span class="${resultado}">${resultado}</span></p>`;
}
