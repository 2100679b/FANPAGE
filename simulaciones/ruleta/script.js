// Números de la ruleta europea ordenados como en una ruleta real
const numerosRuleta = [
  0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5,
  24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26
];

const colores = {}; // Asignamos colores según la ruleta europea

numerosRuleta.forEach(num => {
  if (num === 0) {
    colores[num] = 'verde';
  } else if ([1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36].includes(num)) {
    colores[num] = 'rojo';
  } else {
    colores[num] = 'negro';
  }
});

let girando = false;
let contador = 1;

// Inicializa ruleta visual
function inicializarRuleta() {
  const ruletaDiv = document.getElementById("ruleta");
  ruletaDiv.innerHTML = '';
  
  // Crear múltiples copias de los números para el efecto de ruleta infinita
  for (let repeticion = 0; repeticion < 5; repeticion++) {
    numerosRuleta.forEach(num => {
      const div = document.createElement('div');
      div.textContent = num;
      div.classList.add('numero-slot', `num-${colores[num]}`);
      ruletaDiv.appendChild(div);
    });
  }
}

function apostar(apuesta) {
  if (girando) return; // Evita múltiples giros simultáneos
  
  girando = true;
  
  // Deshabilitar botones durante el giro
  const botones = document.querySelectorAll('#botones-apuesta button');
  botones.forEach(btn => btn.disabled = true);
  
  // Seleccionar número ganador aleatorio
  const indiceGanador = Math.floor(Math.random() * numerosRuleta.length);
  const numeroGanador = numerosRuleta[indiceGanador];
  const colorGanador = colores[numeroGanador];
  
  // Calcular posición final
  const anchoSlot = 60; // ancho de cada slot
  const posicionBase = -indiceGanador * anchoSlot;
  const vueltasExtra = -anchoSlot * numerosRuleta.length * 3; // 3 vueltas completas
  const offsetAleatorio = Math.random() * 20 - 10; // pequeño offset para realismo
  const posicionFinal = posicionBase + vueltasExtra + offsetAleatorio;
  
  // Mostrar mensaje de giro
  document.getElementById("resultado").innerHTML = "🌀 La ruleta está girando...";
  
  // Animar la ruleta
  const ruletaDiv = document.getElementById("ruleta");
  ruletaDiv.style.transition = 'transform 3s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
  ruletaDiv.style.transform = `translateX(${posicionFinal}px)`;
  
  // Mostrar resultado después de la animación
  setTimeout(() => {
    const resultadoTexto = `La ruleta cayó en ${numeroGanador}`;
    const colorTexto = `<span class="${colorGanador}">(${colorGanador.toUpperCase()})</span>`;
    const mensajeFinal = (colorGanador === apuesta) ? 
      "<span style='color: #00ff00; font-weight: bold;'>¡GANASTE! 🎉</span>" : 
      "<span style='color: #ff4444; font-weight: bold;'>Perdiste 😞</span>";
    
    document.getElementById("resultado").innerHTML = 
      `${resultadoTexto} ${colorTexto} — ${mensajeFinal}`;

    // Actualizar historial
    const historial = document.getElementById("historial");
    const colorClass = colorGanador;
    historial.innerHTML += `
      <p>🌀 <strong>Ronda ${contador++}:</strong> 
      Apostaste a <strong class="${apuesta}">${apuesta.toUpperCase()}</strong> ➜ 
      Resultado: <strong class="${colorClass}">${numeroGanador} (${colorGanador.toUpperCase()})</strong>
      ${colorGanador === apuesta ? '✅' : '❌'}
      </p>`;
    
    // Scroll automático al último resultado
    historial.scrollTop = historial.scrollHeight;
    
    // Rehabilitar botones
    botones.forEach(btn => btn.disabled = false);
    girando = false;
    
  }, 3200); // Un poco más de tiempo para que termine la animación
}

// Función para reiniciar la posición de la ruleta
function reiniciarPosicion() {
  const ruletaDiv = document.getElementById("ruleta");
  ruletaDiv.style.transition = 'none';
  ruletaDiv.style.transform = 'translateX(0px)';
}

// Inicializar al cargar la página
document.addEventListener('DOMContentLoaded', () => {
  inicializarRuleta();
  
  // Reiniciar posición cada cierto tiempo para evitar desbordamiento
  setInterval(() => {
    if (!girando) {
      reiniciarPosicion();
    }
  }, 30000); // cada 30 segundos
});