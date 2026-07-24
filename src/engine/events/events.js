let pantallaTocada = false;
let teclaTocada = null;

function pantalla_tocada() {
    return pantallaTocada;
}

function tecla_tocada(key) {
    return teclaTocada === key;
}

document.addEventListener("touchstart", function () {
    pantallaTocada = true;
});

document.addEventListener("keydown", function (event) {
    teclaTocada = event.code;
});

document.addEventListener("keyup", function () {
    teclaTocada = null;
});

document.addEventListener("touchend", function () {
    pantallaTocada = false;
});
