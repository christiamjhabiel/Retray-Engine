let pantallaTocada = false;
let teclaTocada = false;

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
