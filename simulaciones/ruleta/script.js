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
let fichas = 1000;
let apuestaActual = 0;
let tipoApuestaActual = '';
let fichasApostadas = 0;

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
  
  actualizarFichas();
}

function actualizarFichas() {
  document.getElementById('fichas-cantidad').textContent = fichas;
}

function seleccionarApuesta(tipo) {
  if (girando || fichas < 10) return;
  
  tipoApuestaActual = tipo;
  fichasApostadas = 10; // Apuesta fija de 10 fichas
  
  // Actualizar interfaz
  document.getElementById('apuesta-actual').textContent = 
    `Apuesta: ${tipo.toUpperCase()}`;
  document.getElementById('fichas-apostadas').textContent = 
    `Fichas apostadas: ${fichasApostadas}`;
  
  // Habilitar botón de girar
  document.getElementById('btn-girar').disabled = false;
}

function girarRuleta() {
  if (girando || fichasApostadas === 0) return;
  
  girando = true;
  
  // Descontar fichas
  fichas -= fichasApostadas;
  actualizarFichas();
  
  // Deshabilitar botones
  document.querySelectorAll('button').forEach(btn => btn.disabled = true);
  
  // Seleccionar número ganador aleatorio
  const indiceGanador = Math.floor(Math.random() * numerosRuleta.length);
  const numeroGanador = numerosRuleta[indiceGanador];
  const colorGanador = colores[numeroGanador];
  
  // Calcular animación
  const anchoSlot = 60;
  const centroTrack = 300;
  const vueltasCompletas = 4;
  const totalSlots = numerosRuleta.length;
  
  const vueltasPixeles = vueltasCompletas * totalSlots * anchoSlot;
  const posicionObjetivo = indiceGanador * anchoSlot;
  
  // Ajuste para centrar el número bajo el puntero
  const ajusteCentrado = centroTrack - anchoSlot / 2;
  const desplazamientoFinal = -(vueltasPixeles + posicionObjetivo - ajusteCentrado);
  
  // Mostrar mensaje de giro
  document.getElementById("resultado").innerHTML = "🌀 La ruleta está girando...";
  
  // Animar
  const ruletaDiv = document.getElementById("ruleta");
  ruletaDiv.style.transition = 'transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99)';
  ruletaDiv.style.transform = `translateX(${desplazamientoFinal}px)`;
  
  // Mostrar resultado después de la animación
  setTimeout(() => {
    // Verificar el resultado
    const gano = (colorGanador === tipoApuestaActual);
    let ganancia = 0;
    
    if (gano) {
      if (tipoApuestaActual === 'verde') {
        ganancia = fichasApostadas * 36; // 35:1 + la apuesta
      } else {
        ganancia = fichasApostadas * 2; // 1:1 + la apuesta
      }
      fichas += ganancia;
    }
    
    const resultadoTexto = `La ruleta cayó en ${numeroGanador}`;
    const colorTexto = `<span class="${colorGanador}">(${colorGanador.toUpperCase()})</span>`;
    const mensajeFinal = gano ? 
      `<span style='color: #00ff00; font-weight: bold;'>¡GANASTE ${ganancia} fichas! 🎉</span>` : 
      `<span style='color: #ff4444; font-weight: bold;'>Perdiste ${fichasApostadas} fichas 😞</span>`;
    
    document.getElementById("resultado").innerHTML = 
      `${resultadoTexto} ${colorTexto} — ${mensajeFinal}`;

    // Actualizar historial
    const historial = document.getElementById("historial");
    const nuevaEntrada = document.createElement('p');
    nuevaEntrada.innerHTML = `
      <strong>Ronda ${contador}:</strong> 
      Apostaste a <strong class="${tipoApuestaActual}">${tipoApuestaActual.toUpperCase()}</strong> (${fichasApostadas} fichas) ➜ 
      Resultado: <strong class="${colorGanador}">${numeroGanador} (${colorGanador.toUpperCase()})</strong>
      ${gano ? `✅ +${ganancia}` : '❌'}
    `;
    historial.appendChild(nuevaEntrada);
    
    // Scroll automático
    historial.scrollTop = historial.scrollHeight;
    
    // Actualizar fichas
    actualizarFichas();
    
    // Reiniciar apuesta
    fichasApostadas = 0;
    tipoApuestaActual = '';
    document.getElementById('apuesta-actual').textContent = 'Selecciona una apuesta';
    document.getElementById('fichas-apostadas').textContent = 'Fichas apostadas: 0';
    
    // Rehabilitar botones
    girando = false;
    document.querySelectorAll('#botones-apuesta button').forEach(btn => {
      btn.disabled = fichas < 10;
    });
    document.getElementById('btn-girar').disabled = true;
    
    // Incrementar contador
    contador++;
    
    // Verificar si el jugador se quedó sin fichas
    if (fichas < 10) {
      setTimeout(() => {
        if (confirm('¡Te has quedado sin fichas suficientes! ¿Quieres reiniciar con 1000 fichas?')) {
          fichas = 1000;
          contador = 1;
          document.getElementById('historial').innerHTML = '<h3>📋 Historial de Apuestas</h3>';
          actualizarFichas();
          document.querySelectorAll('#botones-apuesta button').forEach(btn => {
            btn.disabled = false;
          });
        }
      }, 500);
    }
    
  }, 4200);
}

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
  inicializarRuleta();
  
  // Debug: Mostrar asignación de colores
  console.log('Colores asignados:', colores);
});