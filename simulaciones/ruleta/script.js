const numeros = Array.from({ length: 37 }, (_, i) => i); // 0 - 36
const colores = {}; // Asignamos colores típicos

numeros.forEach(num => {
  if (num === 0) colores[num] = 'verde';
  else if ([1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36].includes(num)) {
    colores[num] = 'rojo';
  } else {
    colores[num] = 'negro';
  }
});

// Inicializa ruleta visual
const ruletaDiv = document.getElementById("ruleta");
ruletaDiv.innerHTML = '';
numeros.forEach(num => {
  const div = document.createElement('div');
  div.textContent = num;
  div.classList.add(`num-${colores[num]}`);
  ruletaDiv.appendChild(div);
});

let contador = 1;

function apostar(apuesta) {
  const indiceGanador = Math.floor(Math.random() * numeros.length);
  const numeroGanador = numeros[indiceGanador];
  const colorGanador = colores[numeroGanador];

  // Simula el giro (desplazamiento)
  const desplazamiento = indiceGanador * -48; // ancho aproximado (40px + gap)
  ruletaDiv.style.transform = `translateX(${desplazamiento}px)`;

  // Espera a que termine la animación antes de mostrar resultado
  setTimeout(() => {
    const resultadoTexto = `La ruleta cayó en ${numeroGanador} (${colorGanador.toUpperCase()})`;
    const mensajeFinal = (colorGanador === apuesta) ? "¡Ganaste! 🎉" : "Perdiste. 😞";
    
    document.getElementById("resultado").innerHTML = `${resultadoTexto} — ${mensajeFinal}`;

    const historial = document.getElementById("historial");
    historial.innerHTML += `<p>🌀 <strong>Ronda ${contador++}:</strong> Apostaste a <strong>${apuesta}</strong> ➜ Resultado: <strong>${numeroGanador} (${colorGanador})</strong></p>`;
  }, 2100);
}
