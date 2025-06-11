// Números de la ruleta europea en orden físico real
const numerosRuleta = [
  0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5,
  24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26
];

// Colores según las reglas oficiales de la ruleta europea
const colores = {};

// Asignar colores correctamente
numerosRuleta.forEach(num => {
  if (num === 0) {
    colores[num] = 'verde';
  } else if ([1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36].includes(num)) {
    colores[num] = 'rojo';
  } else {
    colores[num] = 'negro';
  }
});

let girando = false;
let contador = 1;
let posicionActual = 0;

// Inicializa ruleta visual
function inicializarRuleta() {
  const ruletaDiv = document.getElementById("ruleta");
  ruletaDiv.innerHTML = '';
  
  // Crear múltiples repeticiones para efecto infinito
  for (let repeticion = 0; repeticion < 6; repeticion++) {
    numerosRuleta.forEach((num, index) => {
      const div = document.createElement('div');
      div.textContent = num;
      div.classList.add('numero-slot', `num-${colores[num]}`);
      div.setAttribute('data-numero', num);
      div.setAttribute('data-posicion', repeticion * numerosRuleta.length + index);
      ruletaDiv.appendChild(div);
    });
  }
}

function apostar(apuesta) {
  if (girando) return;
  
  girando = true;
  
  // Deshabilitar botones
  const botones = document.querySelectorAll('#botones-apuesta button');
  botones.forEach(btn => btn.disabled = true);
  
  // Seleccionar número ganador aleatorio
  const indiceGanador = Math.floor(Math.random() * numerosRuleta.length);
  const numeroGanador = numerosRuleta[indiceGanador];
  const colorGanador = colores[numeroGanador];
  
  console.log(`Número ganador: ${numeroGanador}, Color: ${colorGanador}`);
  
  // Calcular animación (CÁLCULO CORREGIDO)
  const anchoSlot = 60;
  const centroTrack = 300; // Centro de la pista (600px / 2)
  const vueltasCompletas = 4; // Número de vueltas completas
  const totalSlots = numerosRuleta.length;
  
  // Calcular desplazamiento total (FÓRMULA CORREGIDA)
  const vueltasPixeles = vueltasCompletas * totalSlots * anchoSlot;
  const posicionObjetivo = indiceGanador * anchoSlot;
  const desplazamientoFinal = -(vueltasPixeles + posicionObjetivo - centroTrack);
  
  // Mostrar mensaje de giro
  document.getElementById("resultado").innerHTML = "🌀 La ruleta está girando...";
  
  // Animar
  const ruletaDiv = document.getElementById("ruleta");
  ruletaDiv.style.transition = 'transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99)';
  ruletaDiv.style.transform = `translateX(${desplazamientoFinal}px)`;
  
  // Actualizar posición actual para futuras animaciones
  posicionActual = desplazamientoFinal;
  
  // Mostrar resultado
  setTimeout(() => {
    // Verificar el resultado
    const gano = (colorGanador === apuesta);
    
    const resultadoTexto = `La ruleta cayó en ${numeroGanador}`;
    const colorTexto = `<span class="${colorGanador}">(${colorGanador.toUpperCase()})</span>`;
    const mensajeFinal = gano ? 
      "<span style='color: #00ff00; font-weight: bold;'>¡GANASTE! 🎉</span>" : 
      "<span style='color: #ff4444; font-weight: bold;'>Perdiste 😞</span>";
    
    document.getElementById("resultado").innerHTML = 
      `${resultadoTexto} ${colorTexto} — ${mensajeFinal}`;

    // Actualizar historial
    const historial = document.getElementById("historial");
    const nuevaEntrada = document.createElement('p');
    nuevaEntrada.innerHTML = `
      <strong>Ronda ${contador}:</strong> 
      Apostaste a <strong class="${apuesta}">${apuesta.toUpperCase()}</strong> ➜ 
      Resultado: <strong class="${colorGanador}">${numeroGanador} (${colorGanador.toUpperCase()})</strong>
      ${gano ? '✅' : '❌'}
    `;
    historial.appendChild(nuevaEntrada);
    
    // Scroll automático
    historial.scrollTop = historial.scrollHeight;
    
    // Rehabilitar botones
    botones.forEach(btn => btn.disabled = false);
    girando = false;
    
    // Incrementar contador
    contador++;
    
    // Reiniciar posición después de un tiempo para evitar overflow
    setTimeout(reiniciarPosicion, 2000);
    
  }, 4200);
}

// Reiniciar posición de la ruleta
function reiniciarPosicion() {
  if (!girando) {
    const ruletaDiv = document.getElementById("ruleta");
    ruletaDiv.style.transition = 'none';
    ruletaDiv.style.transform = 'translateX(0px)';
    posicionActual = 0;
    // Forzar reflow para aplicar cambios (AGREGADO)
    ruletaDiv.offsetHeight;
  }
}

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
  inicializarRuleta();
  
  // Debug: Mostrar asignación de colores
  console.log('Colores asignados:', colores);
  
  // Limpiar posición periódicamente
  setInterval(() => {
    if (!girando) {
      reiniciarPosicion();
    }
  }, 30000);
});