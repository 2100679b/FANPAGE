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
let fichas = 1000; // Sistema de fichas
let apuestaActual = 0;
let tipoApuestaActual = '';

// Sonidos simulados con Audio API
const sonidos = {
  giro: () => {
    // Simular sonido de giro con oscilador
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(50, audioContext.currentTime + 3);
    
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 3);
    
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 3);
  },
  
  ganador: () => {
    // Sonido de celebración
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(440, audioContext.currentTime);
    oscillator.frequency.setValueAtTime(554, audioContext.currentTime + 0.1);
    oscillator.frequency.setValueAtTime(659, audioContext.currentTime + 0.2);
    
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.setValueAtTime(0, audioContext.currentTime + 0.3);
    
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.3);
  }
};

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
  
  // Inicializar interfaz
  actualizarFichas();
  actualizarBotones();
}

function actualizarFichas() {
  const fichasElement = document.getElementById('fichas-display');
  if (fichasElement) {
    fichasElement.textContent = `Fichas: ${fichas}`;
  }
}

function actualizarBotones() {
  const botones = document.querySelectorAll('#botones-apuesta button');
  botones.forEach(btn => {
    btn.disabled = girando || fichas < 10;
  });
}

function seleccionarApuesta(tipo) {
  if (girando) return;
  
  tipoApuestaActual = tipo;
  apuestaActual = 10; // Apuesta fija por simplicidad
  
  // Actualizar interfaz
  document.getElementById('apuesta-actual').textContent = 
    `Apuesta actual: ${apuestaActual} fichas en ${tipo.toUpperCase()}`;
  
  // Habilitar botón de girar
  document.getElementById('btn-girar').disabled = false;
}

function girarRuleta() {
  if (girando || apuestaActual === 0) return;
  
  girando = true;
  
  // Descontar fichas
  fichas -= apuestaActual;
  actualizarFichas();
  
  // Deshabilitar botones
  const botones = document.querySelectorAll('button');
  botones.forEach(btn => btn.disabled = true);
  
  // Reproducir sonido de giro
  try {
    sonidos.giro();
  } catch(e) {
    console.log('Audio no disponible');
  }
  
  // Seleccionar número ganador con física más realista
  const numeroGanador = seleccionarNumeroConPeso();
  const colorGanador = colores[numeroGanador];
  
  console.log(`Número ganador: ${numeroGanador}, Color: ${colorGanador}`);
  
  // Animación mejorada con variación de velocidad
  animarRuleta(numeroGanador, () => {
    mostrarResultado(numeroGanador, colorGanador);
  });
}

function seleccionarNumeroConPeso() {
  // Agregar un poco de "peso" realista - algunos números salen ligeramente más
  const pesos = new Array(37).fill(1);
  
  // Agregar variación mínima (muy sutil, como en casinos reales)
  for (let i = 0; i < numerosRuleta.length; i++) {
    pesos[i] += (Math.random() - 0.5) * 0.05; // ±2.5% de variación
  }
  
  const pesoTotal = pesos.reduce((sum, peso) => sum + peso, 0);
  let random = Math.random() * pesoTotal;
  
  for (let i = 0; i < numerosRuleta.length; i++) {
    random -= pesos[i];
    if (random <= 0) {
      return numerosRuleta[i];
    }
  }
  
  return numerosRuleta[0]; // Fallback
}

function animarRuleta(numeroGanador, callback) {
  const indiceGanador = numerosRuleta.indexOf(numeroGanador);
  
  // Cálculo mejorado de posición
  const anchoSlot = 60;
  const centroTrack = 300;
  const vueltasCompletas = 3 + Math.random() * 2; // 3-5 vueltas
  
  const posicionEnExtendida = Math.floor(numerosRuleta.length * 2.5) * anchoSlot + (indiceGanador * anchoSlot);
  const ajusteCentrado = centroTrack - anchoSlot / 2;
  const desplazamientoFinal = -(posicionEnExtendida - ajusteCentrado);
  
  // Agregar variación en el tiempo de giro
  const tiempoGiro = 3000 + Math.random() * 2000; // 3-5 segundos
  
  // Mostrar mensaje de giro
  document.getElementById("resultado").innerHTML = "🌀 La ruleta está girando...";
  
  // Efecto de desaceleración más realista
  const ruletaDiv = document.getElementById("ruleta");
  ruletaDiv.style.transition = `transform ${tiempoGiro}ms cubic-bezier(0.25, 0.46, 0.45, 0.94)`;
  ruletaDiv.style.transform = `translateX(${desplazamientoFinal}px)`;
  
  posicionActual = desplazamientoFinal;
  
  // Callback después de la animación
  setTimeout(callback, tiempoGiro + 200);
}

function mostrarResultado(numeroGanador, colorGanador) {
  const gano = (colorGanador === tipoApuestaActual);
  let ganancia = 0;
  
  // Calcular ganancias según tipo de apuesta
  if (gano) {
    if (tipoApuestaActual === 'verde') {
      ganancia = apuestaActual * 36; // Pago 35:1 + apuesta original
    } else {
      ganancia = apuestaActual * 2; // Pago 1:1 + apuesta original
    }
    fichas += ganancia;
    
    // Sonido de victoria
    try {
      setTimeout(() => sonidos.ganador(), 500);
    } catch(e) {
      console.log('Audio no disponible');
    }
  }
  
  // Mostrar resultado
  const resultadoTexto = `🎯 Número ganador: ${numeroGanador}`;
  const colorTexto = `<span class="${colorGanador}">(${colorGanador.toUpperCase()})</span>`;
  
  let mensajeFinal;
  if (gano) {
    mensajeFinal = `<span style='color: #00ff00; font-weight: bold;'>¡GANASTE ${ganancia} fichas! 🎉</span>`;
  } else {
    mensajeFinal = `<span style='color: #ff4444; font-weight: bold;'>Perdiste ${apuestaActual} fichas 😞</span>`;
  }
  
  document.getElementById("resultado").innerHTML = 
    `${resultadoTexto} ${colorTexto}<br>${mensajeFinal}`;

  // Actualizar historial
  actualizarHistorial(numeroGanador, colorGanador, gano, ganancia);
  
  // Actualizar interfaz
  actualizarFichas();
  apuestaActual = 0;
  tipoApuestaActual = '';
  document.getElementById('apuesta-actual').textContent = 'Selecciona una apuesta';
  document.getElementById('btn-girar').disabled = true;
  
  // Rehabilitar botones después de un momento
  setTimeout(() => {
    girando = false;
    actualizarBotones();
    
    // Verificar si el jugador se quedó sin fichas
    if (fichas < 10) {
      setTimeout(() => {
        if (confirm('Te quedaste sin fichas suficientes. ¿Quieres reiniciar con 1000 fichas?')) {
          fichas = 1000;
          actualizarFichas();
          actualizarBotones();
        }
      }, 1000);
    }
  }, 2000);
  
  // Reiniciar posición
  setTimeout(reiniciarPosicion, 3000);
  
  contador++;
}

function actualizarHistorial(numeroGanador, colorGanador, gano, ganancia) {
  const historial = document.getElementById("historial");
  const nuevaEntrada = document.createElement('p');
  
  const tipoApuesta = tipoApuestaActual.toUpperCase();
  const resultado = `${numeroGanador} (${colorGanador.toUpperCase()})`;
  const estado = gano ? `✅ +${ganancia}` : `❌ -${apuestaActual}`;
  
  nuevaEntrada.innerHTML = `
    <strong>Ronda ${contador}:</strong> 
    Apuesta: <strong class="${tipoApuestaActual}">${tipoApuesta}</strong> (${apuestaActual} fichas) ➜ 
    Resultado: <strong class="${colorGanador}">${resultado}</strong> ${estado}
  `;
  
  historial.appendChild(nuevaEntrada);
  historial.scrollTop = historial.scrollHeight;
}

function reiniciarPosicion() {
  if (!girando) {
    const ruletaDiv = document.getElementById("ruleta");
    ruletaDiv.style.transition = 'none';
    ruletaDiv.style.transform = 'translateX(0px)';
    posicionActual = 0;
    ruletaDiv.offsetHeight; // Forzar reflow
  }
}

// Funciones de apuesta simplificadas
function apostar(tipo) {
  seleccionarApuesta(tipo);
}

// Inicializar al cargar
document.addEventListener('DOMContentLoaded', () => {
  inicializarRuleta();
  
  // Agregar elementos de interfaz mejorados
  const main = document.querySelector('main');
  
  // Crear display de fichas
  const fichasDisplay = document.createElement('div');
  fichasDisplay.id = 'fichas-display';
  fichasDisplay.style.cssText = `
    font-size: 24px;
    font-weight: bold;
    color: gold;
    margin: 20px 0;
    text-shadow: 2px 2px 4px black;
  `;
  main.insertBefore(fichasDisplay, document.getElementById('ruleta-container'));
  
  // Crear display de apuesta actual
  const apuestaDisplay = document.createElement('div');
  apuestaDisplay.id = 'apuesta-actual';
  apuestaDisplay.style.cssText = `
    font-size: 18px;
    margin: 10px 0;
    color: #ffd700;
  `;
  apuestaDisplay.textContent = 'Selecciona una apuesta';
  main.insertBefore(apuestaDisplay, document.getElementById('botones-apuesta'));
  
  // Crear botón de girar
  const btnGirar = document.createElement('button');
  btnGirar.id = 'btn-girar';
  btnGirar.textContent = '🎰 GIRAR RULETA';
  btnGirar.disabled = true;
  btnGirar.onclick = girarRuleta;
  btnGirar.style.cssText = `
    background-color: #228B22 !important;
    font-size: 20px;
    padding: 20px 40px;
    margin: 20px 0;
  `;
  main.insertBefore(btnGirar, document.getElementById('resultado'));
  
  // Limpiar posición periódicamente
  setInterval(() => {
    if (!girando) {
      reiniciarPosicion();
    }
  }, 30000);
  
  console.log('🎰 Ruleta inicializada con sistema de fichas');
  console.log('Colores asignados:', colores);
});