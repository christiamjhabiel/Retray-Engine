function guardar(){
  let game = {
    code: editor.getValue(),
    name: game_name.value,
    objects: objectList
  };
  
  localStorage.setItem(game_name.value, JSON.stringify(game));
}

function cargarListaJuegos() {
    const list = document.getElementById("game_list");
    list.innerHTML = "";
    
    const keys = Object.keys(localStorage);
    
    keys.forEach(key_name => {
      lista.innerHTML += `
        <li> 
          <span>${key_name}</span>
          <button class="btn" onclick="abrirJuego('${key_name}')">Open</button>
        </li>
      `;
    });
}
  
function abrirJuego(name) {
  let game = JSON.parse(localStorage.getItem(name));
  editor.setValue(game.code);
  game_name.value = game.name;
  objectList = game.objects;
}

cargarListaJuegos();