function pantalla_tocada() {
    if(document.addEventListener("touchstart", function (event) {})){
        return true;
    } else {
        return false;
    }
}

function tecla_tocada(key) {
    document.addEventListener("keydown", function(event) {
    if (event.code === key) {
        return true;
    } else {
        return false;
    }
    });
}