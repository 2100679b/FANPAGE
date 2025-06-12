// Definir palos y rangos
const palos = ['♥', '♦', '♣', '♠'];
const rangos = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

// Crear baraja
let baraja = [];
for (let palo of palos) {
  for (let rango of rangos) {
    baraja.push({ palo, rango });
  }
}

// Función para barajar la baraja
function barajar(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// Función para repartir una carta
function repartirCarta(mano) {
  const carta = baraja.pop();
  mano.push(carta);
  return carta;
}

// Función para calcular el total de la mano
function calcularTotal(mano) {
  let total = 0;
  let ases = 0;
  for (let carta of mano) {
    if (carta.rango === 'A') {
      ases++;
    } else if (['J', 'Q', 'K'].includes(carta.rango)) {
      total += 10;
    } else {
      total += parseInt(carta.rango);
    }
  }
  for (let i = 0; i < ases; i++) {
    if (total + 11 <= 21) {
      total += 11;
    } else {
      total += 1;
    }
  }
  return total;
}

// Variables del juego
let manoJugador = [];
let manoCrupier = [];
let juegoActivo = true;

// Función para mostrar las cartas
function mostrarCartas(mano, elemento, ocultarPrimera = false) {
  elemento.innerHTML = '';
  mano.forEach((carta, index) => {
    if (index === 0 && ocultarPrimera) {
      const cartaDiv = document.createElement('div');
      cartaDiv.classList.add('carta');
      cartaDiv.textContent = '?';
      elemento.appendChild(cartaDiv);
    } else {
      const cartaDiv = document.createElement('div');
      cartaDiv.classList.add('carta');
      cartaDiv.textContent = `${carta.rango}${carta.palo}`;
      elemento.appendChild(cartaDiv);
    }
  });
}

// Función para iniciar el juego
function iniciarJuego() {
  baraja = [];
  for (let palo of palos) {
    for (let rango of rangos) {
      baraja.push({ palo, rango });
    }
  }
  barajar(baraja);
  manoJugador = [];
  manoCrupier = [];
  repartirCarta(manoJugador);
  repartirCarta(manoCrupier);
  repartirCarta(manoJugador);
  repartirCarta(manoCrupier);
  mostrarCartas(manoJugador, document.getElementById('jugador-cartas'));
  mostrarCartas(manoCrupier, document.getElementById('crupier-cartas'), true);
  document.getElementById('mensaje').textContent = 'Tu turno';
  juegoActivo = true;
  document.getElementById('pedir').disabled = false;
  document.getElementById('quedarse').disabled = false;
}

// Función para pedir carta
function pedirCarta() {
  if (!juegoActivo) return;
  repartirCarta(manoJugador);
  mostrarCartas(manoJugador, document.getElementById('jugador-cartas'));
  const totalJugador = calcularTotal(manoJugador);
  if (totalJugador > 21) {
    document.getElementById('mensaje').textContent = 'Te pasaste de 21. Perdiste.';
    juegoActivo = false;
    document.getElementById('pedir').disabled = true;
    document.getElementById('quedarse').disabled = true;
  }
}

// Función para quedarse
function quedarse() {
  if (!juegoActivo) return;
  juegoActivo = false;
  document.getElementById('pedir').disabled = true;
  document.getElementById('quedarse').disabled = true;
  // Turno del crupier
  mostrarCartas(manoCrupier, document.getElementById('crupier-cartas'), false);
  let totalCrupier = calcularTotal(manoCrupier);
  while (totalCrupier < 17) {
    repartirCarta(manoCrupier);
    mostrarCartas(manoCrupier, document.getElementById('crupier-cartas'), false);
    totalCrupier = calcularTotal(manoCrupier);
  }
  const totalJugador = calcularTotal(manoJugador);
  if (totalCrupier > 21 || totalJugador > totalCrupier) {
    document.getElementById('mensaje').textContent = '¡Ganaste!';
  } else if (totalJugador < totalCrupier) {
    document.getElementById('mensaje').textContent = 'Perdiste.';
  } else {
    document.getElementById('mensaje').textContent = 'Empate.';
  }
}

// Eventos de los botones
document.getElementById('pedir').addEventListener('click', pedirCarta);
document.getElementById('quedarse').addEventListener('click', quedarse);

// Iniciar el juego al cargar la página
iniciarJuego();