const botones = document.querySelectorAll(".color-btn");
const scoreElement = document.getElementById("score");

let secuenciaJuego = [];
let secuenciaJugador = [];
let nivel = 0;
let esperandoTurnoJugador = false;

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
    }, 1000); // Mayor tiempo entre luces para ver la secuencia
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
    scoreElement.textContent = nivel;

    const nuevoColor = obtenerColorAleatorio();
    secuenciaJuego.push(nuevoColor);

    setTimeout(mostrarSecuencia, 1000);
}

function gameOver() {
    alert(`¡Perdiste! Llegaste hasta el nivel ${nivel}`);
    secuenciaJuego = [];
    secuenciaJugador = [];
    nivel = 0;
    scoreElement.textContent = "0";

    setTimeout(nuevaRonda, 2000); // Reiniciar después de 2 segundos
}

// Asignar eventos a los botones
botones.forEach(boton => {
    boton.addEventListener("click", () => {
        manejarTurnoJugador(boton.dataset.color);
    });
});

// Iniciar el juego solo cuando el usuario haga clic en un botón
document.addEventListener("DOMContentLoaded", () => {
    setTimeout(nuevaRonda, 2000);
});