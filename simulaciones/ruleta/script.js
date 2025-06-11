function apostar(apuesta) {
  const ruleta = [...Array(18).fill('rojo'), ...Array(18).fill('negro'), 'verde'];
  const resultado = ruleta[Math.floor(Math.random() * ruleta.length)];

  let mensaje = `La ruleta cayó en: ${resultado.toUpperCase()}. `;

  if (resultado === apuesta) {
    mensaje += "¡Ganaste!";
  } else {
    mensaje += "Perdiste.";
  }

  document.getElementById("resultado").textContent = mensaje;

  const historial = document.getElementById("historial");
  historial.innerHTML += `<p>Apostaste a <strong>${apuesta}</strong> ➜ Resultado: <strong>${resultado}</strong></p>`;
}
