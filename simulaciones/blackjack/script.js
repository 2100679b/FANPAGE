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
  
  // Calcular valor de los ases
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
    const cartaDiv = document.createElement('div');
    cartaDiv.classList.add('carta');
    
    if (index === 0 && ocultarPrimera) {
      cartaDiv.textContent = '?';
      cartaDiv.style.background = 'linear-gradient(145deg, #5a0000, #8B0000)';
      cartaDiv.style.color = 'gold';
      cartaDiv.style.fontSize = '40px';
    } else {
      cartaDiv.textContent = carta.rango;
      cartaDiv.setAttribute('data-suit', carta.palo);
      
      if (carta.palo === '♥' || carta.palo === '♦') {
        cartaDiv.classList.add('rojo');
      } else {
        cartaDiv.classList.add('negro');
      }
    }
    
    elemento.appendChild(cartaDiv);
  });
}

// Función para actualizar los totales
function actualizarTotales() {
  const totalJugador = calcularTotal(manoJugador);
  const totalCrupier = calcularTotal(manoCrupier);
  
  document.getElementById('jugador-total').textContent = totalJugador;
  
  if (juegoActivo) {
    // Ocultar total real del crupier durante el juego
    document.getElementById('crupier-total').textContent = '?';
  } else {
    document.getElementById('crupier-total').textContent = totalCrupier;
  }
}

// Función para iniciar el juego
function iniciarJuego() {
  // Reiniciar baraja
  baraja = [];
  for (let palo of palos) {
    for (let rango of rangos) {
      baraja.push({ palo, rango });
    }
  }
  
  barajar(baraja);
  
  // Reiniciar manos
  manoJugador = [];
  manoCrupier = [];
  
  // Repartir cartas iniciales
  repartirCarta(manoJugador);
  repartirCarta(manoCrupier);
  repartirCarta(manoJugador);
  repartirCarta(manoCrupier);
  
  // Mostrar cartas
  mostrarCartas(manoJugador, document.getElementById('jugador-cartas'));
  mostrarCartas(manoCrupier, document.getElementById('crupier-cartas'), true);
  
  // Actualizar totales
  actualizarTotales();
  
  // Estado del juego
  document.getElementById('mensaje').textContent = 'Tu turno';
  juegoActivo = true;
  
  // Habilitar botones
  document.getElementById('pedir').disabled = false;
  document.getElementById('quedarse').disabled = false;
  
  // Verificar blackjack natural
  const totalJugador = calcularTotal(manoJugador);
  if (totalJugador === 21) {
    setTimeout(() => {
      document.getElementById('mensaje').textContent = '¡Blackjack Natural!';
      juegoActivo = false;
      document.getElementById('pedir').disabled = true;
      document.getElementById('quedarse').disabled = true;
    }, 500);
  }
}

// Función para pedir carta
function pedirCarta() {
  if (!juegoActivo) return;
  
  repartirCarta(manoJugador);
  mostrarCartas(manoJugador, document.getElementById('jugador-cartas'));
  actualizarTotales();
  
  const totalJugador = calcularTotal(manoJugador);
  
  if (totalJugador > 21) {
    document.getElementById('mensaje').textContent = 'Te pasaste de 21. Perdiste.';
    juegoActivo = false;
    document.getElementById('pedir').disabled = true;
    document.getElementById('quedarse').disabled = true;
  } else if (totalJugador === 21) {
    document.getElementById('mensaje').textContent = '¡21!';
    setTimeout(quedarse, 1000);
  }
}

// Función para quedarse
function quedarse() {
  if (!juegoActivo) return;
  
  juegoActivo = false;
  document.getElementById('pedir').disabled = true;
  document.getElementById('quedarse').disabled = true;
  
  // Mostrar cartas del crupier
  mostrarCartas(manoCrupier, document.getElementById('crupier-cartas'), false);
  
  // Turno del crupier
  let totalCrupier = calcularTotal(manoCrupier);
  
  const jugarCrupier = () => {
    if (totalCrupier < 17) {
      repartirCarta(manoCrupier);
      mostrarCartas(manoCrupier, document.getElementById('crupier-cartas'), false);
      totalCrupier = calcularTotal(manoCrupier);
      actualizarTotales();
      
      setTimeout(jugarCrupier, 1000);
    } else {
      determinarGanador();
    }
  };
  
  jugarCrupier();
}

// Función para determinar el ganador
function determinarGanador() {
  const totalJugador = calcularTotal(manoJugador);
  const totalCrupier = calcularTotal(manoCrupier);
  
  actualizarTotales();
  
  if (totalCrupier > 21) {
    document.getElementById('mensaje').textContent = '¡Ganaste! El crupier se pasó.';
  } else if (totalJugador > totalCrupier) {
    document.getElementById('mensaje').textContent = '¡Ganaste!';
  } else if (totalJugador < totalCrupier) {
    document.getElementById('mensaje').textContent = 'Perdiste.';
  } else {
    document.getElementById('mensaje').textContent = 'Empate.';
  }
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('pedir').addEventListener('click', pedirCarta);
  document.getElementById('quedarse').addEventListener('click', quedarse);
  document.getElementById('nuevo-juego').addEventListener('click', iniciarJuego);
  
  iniciarJuego();
});