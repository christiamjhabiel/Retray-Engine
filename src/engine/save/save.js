function guardar(){
  let game = {
    code: editor.getValue(),
    name: game_name.value,
    objects: objectList
  };
  
  localStorage.setItem(game_name.value, JSON.stringify(game));
}

/*function cargarListaJuegos() {
    const lista = document.getElementById("lista-juegos");
    lista.innerHTML = "";
    
    const llaves = Object.keys(localStorage);
    
    llaves.forEach(nombre_llave => {
      lista.innerHTML += `
        <li> 
          <span>${nombre_llave}</span>
          <button class="btn btn-sm btn-secondary" onclick="abrirJuego('${nombre_llave}')">abrir</button>
        </li>
      `;
    });
  }*/
  
function abrirJuego(nombre) {
  let game = JSON.parse(localStorage.getItem(nombre));
  editor.setValue(game.code);
  game_name.value = game.name;
  objectList = game.objects;
}