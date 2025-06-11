let contador = 1;

function apostar(apuesta) {
  const ruleta = [...Array(18).fill('rojo'), ...Array(18).fill('negro'), 'verde'];
  const resultado = ruleta[Math.floor(Math.random() * ruleta.length)];

  // Mensaje con color
  const resultadoHTML = `La ruleta cayó en: <span class="${resultado}">${resultado.toUpperCase()}</span>. `;
  const mensaje = (resultado === apuesta) ? "¡Ganaste! 🎉" : "Perdiste. 😞";

  document.getElementById("resultado").innerHTML = resultadoHTML + mensaje;

  // Historial
  const historial = document.getElementById("historial");
  historial.innerHTML += `
    <p>🌀 <strong>Ronda ${contador++}:</strong> Apostaste a 
    <span class="${apuesta}">${apuesta}</span> ➜ Resultado: 
    <span class="${resultado}">${resultado}</span></p>`;
}
