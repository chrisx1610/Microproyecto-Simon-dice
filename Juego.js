const botones = document.querySelectorAll(".color-btn");
const puntuacionJugador = document.getElementById("score");


document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('registroForm');

    if (form) {
        form.addEventListener('submit', function(event) {
            event.preventDefault();
            const nombreJugador = document.getElementById('nombreJugador').value;
            localStorage.setItem('nombreJugador', nombreJugador);
            inicializarPuntuacion(nombreJugador); 
            window.location.href = 'Juego.html';
        });
    } else {
        if (window.location.pathname.includes('Puntuacion.html')) {
            mostrarPuntuacion();
        }
    }
});

function inicializarPuntuacion(nombreJugador) {

    let puntuaciones = JSON.parse(localStorage.getItem('puntuaciones')) || {};
    if (!puntuaciones[nombreJugador]) {
        puntuaciones[nombreJugador] = 0; 
        localStorage.setItem('puntuaciones', JSON.stringify(puntuaciones));
    }
}

function mostrarPuntuacion() {
    const nombreJugador = localStorage.getItem('nombreJugador');
    const puntuaciones = JSON.parse(localStorage.getItem('puntuaciones')) || {};

    if (nombreJugador && puntuaciones[nombreJugador] !== undefined) {
        const nombreElemento = document.createElement('p');
        nombreElemento.textContent = `${nombreJugador}: ${puntuaciones[nombreJugador]}`;
        document.body.appendChild(nombreElemento);
    } else {
        const mensajeElemento = document.createElement('p');
        mensajeElemento.textContent = 'No hay jugador registrado.';
        document.body.appendChild(mensajeElemento);
    }
}


let secuenciaJuego = [];
let secuenciaJugador = [];
let nivel = 0;
let esperandoTurnoJugador = false;
let puntaje = 0;

const sonidos = {
    rojo: new Audio("sonidos/rojo.mp3"),
    azul: new Audio("sonidos/azul.mp3"),
    verde: new Audio("sonidos/verde.mp3"),
    amarillo: new Audio("sonidos/amarillo.mp3")
};

function obtenerColorAleatorio() {
    const colores = ["rojo", "azul", "verde", "amarillo"];
    return colores[Math.floor(Math.random() * colores.length)];
}

function mostrarSecuencia() {
    esperandoTurnoJugador = false;
    secuenciaJugador = [];
    let i = 0;

    const intervalo = setInterval(() => {
        if (i >= secuenciaJuego.length) {
            clearInterval(intervalo);
            esperandoTurnoJugador = true;
            return;
        }

        iluminarBoton(secuenciaJuego[i]);
        i++;
    }, 1000); 
}

function iluminarBoton(color) {
    const boton = document.querySelector(`.color-btn.${color}`);
    if (!boton) return;

    boton.classList.add("flash");
    sonidos[color].currentTime = 0;
    sonidos[color].play();

    setTimeout(() => {
        boton.classList.remove("flash");
    }, 500);
}

function manejarTurnoJugador(color) {
    if (!esperandoTurnoJugador) return;

    secuenciaJugador.push(color);
    iluminarBoton(color);
    const index = secuenciaJugador.length - 1;
    if (secuenciaJugador[index] !== secuenciaJuego[index]) {
        gameOver();
        return;
    }

    if (secuenciaJugador.length === secuenciaJuego.length) {
        setTimeout(nuevaRonda, 1000);
    }
}

function nuevaRonda() {
    nivel++;
    puntaje++
    puntuacionJugador.textContent = puntaje;

    const nombreJugador = localStorage.getItem('nombreJugador');
    let puntuaciones = JSON.parse(localStorage.getItem('puntuaciones')) || {};
    

    if (puntuaciones[nombreJugador] !== undefined) {
        puntuaciones[nombreJugador] = puntaje; 
        localStorage.setItem('puntuaciones', JSON.stringify(puntuaciones));
    }

    const nuevoColor = obtenerColorAleatorio();
    secuenciaJuego.push(nuevoColor);

    setTimeout(mostrarSecuencia, 1000);
}

function gameOver() {
    alert(`¡Perdiste! Llegaste hasta el nivel ${nivel}`);
    secuenciaJuego = [];
    secuenciaJugador = [];
    nivel = 0;
    puntaje = 0;
    puntuacionJugador.textContent = "0";
    window.location.href = 'Inicio.html'

}


botones.forEach(boton => {
    boton.addEventListener("click", () => {
        manejarTurnoJugador(boton.dataset.color);
    });
});


document.addEventListener("DOMContentLoaded", () => {
    setTimeout(nuevaRonda, 2000);
});