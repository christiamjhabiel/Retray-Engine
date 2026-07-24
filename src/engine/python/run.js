//
let pyodide;
let interruptBuffer;
let running = false;
const loader = document.getElementById('loader');
const ltxt = document.getElementById('ltxt');
let game_name = document.getElementById("game_name");
let ot = document.getElementById("ot");
let oc = document.getElementById("optionalColor");

let datos_curiosos = ["Quiero mis Vacaciones Sr Pool...", "Prueben NewCatroid!"];
let indice = Math.floor(Math.random() * datos_curiosos.length);

setInterval(() => {
  clearInterval(this);
  
  if (pyodide) {
    ltxt.innerHTML = "¡Listo!";
    
    loader.style.transition = "opacity 0.5s ease-out";
    loader.style.opacity = 0;
    
    setTimeout(() => loader.style.display = 'none', 500);
    return;
  }
  
  ltxt.innerText = datos_curiosos[indice];
}, 300);

async function initPython() {
  pyodide = await loadPyodide();
  
  interruptBuffer = new Int32Array(new SharedArrayBuffer(4));
  pyodide.setInterruptBuffer(interruptBuffer);
}

async function gameLoop() {
  if (!running) return;
  try {
    await pyodide.runPythonAsync("update()");
  } catch (e) {
    console.error(e);
    running = false;
  }
  requestAnimationFrame(gameLoop);
}

async function ejecutar() {
  if (!pyodide) {
    return Swal.fire({ title: 'Cargando...', text: 'Python aún se está cargando', icon: 'info' });
  }
  
  const codigo = editor.getValue();
  
  try {

    axis.visible = false;
    grid.visible = false;

    Atomics.store(interruptBuffer, 0, 0);
    
    pyodide.globals.set("createPrimitive", (tipo, nombre) => crearObjeto(tipo, nombre));
    pyodide.globals.set("move", (nombre, x, y, z) => objectList[nombre].position.set(x, y, z));
    pyodide.globals.set("rotate", (nombre, x, y, z) => objectList[nombre].rotation.set(x, y, z));
    pyodide.globals.set("scale", (nombre, x, y, z) => objectList[nombre].scale.set(x, y, z));
    pyodide.globals.set("toast", (msg) => Swal.fire({ text: msg }));
    pyodide.globals.set("alert", (msg, msgt, iconn) => Swal.fire({ title: msg, text: msgt, icon: iconn }));
    pyodide.globals.set("cam_set_free", () => controls.enabled = true)
    pyodide.globals.set("cam_set_static", () => controls.enabled = false)
    pyodide.globals.set("cam_set", (x, y, z) => camera.position.set(x, y, z));
    pyodide.globals.set("cam_set_rotation", (x, y, z) => camera.rotation.set(x, y, z));
    pyodide.globals.set("cam_third_person", (obj) => camera.lookAt(obj.position));
    pyodide.globals.set("drawText", (txt, x, y) => ctx.fillText(txt, x, y));
    pyodide.globals.set("clear", () => ctx.clearRect(0, 0, canvas2d.width, canvas2d.height));
    pyodide.globals.set("drawRect", (x, y, w, h) => ctx.fillRect(x, y, w, h));
    pyodide.globals.set("setColor", (color) => ctx.fillStyle = color);
    pyodide.globals.set("drawCircle", (x, y, r) => drawCircle(x, y, r));
    pyodide.globals.set("setAmbientLightColor", (colour) => ambient_light.color = colour);
    pyodide.globals.set("setAmbientLightIntensity", (intensityy) => ambient_light.intensity = intensityy);
    pyodide.globals.set(
      "setLightIntensity", 
      (light, intensityy) =>
      objectList[light].intensity = intensityy);
    pyodide.globals.set(
      "setLightColor",
      (light, colour) =>
      objectList[light].color = colour);
    pyodide.globals.set("setFont", (font) => ctx.font = font);
    pyodide.globals.set("showAxes", () => axis.visible = true);
    pyodide.globals.set("hideAxes", () => axis.visible = false);
    pyodide.globals.set("createAudio", (name, src) => createAudio(name, src));
    pyodide.globals.set("playAudio", (name) => objectList[name].play);
    pyodide.globals.set("stopAudio", (name) => objectList[name].stop);
    pyodide.globals.set("pauseAudio", (name) => objectList[name].pause);
    pyodide.globals.set("save", (key, value) => localStorage.setItem(key, value));
    pyodide.globals.set("load", (key) => localStorage.getItem(key));
    pyodide.globals.set("unsave", (key) => localStorage.removeItem(key));
    pyodide.globals.set("createMesh", (name, src) => crearMesh(name, src));
    
    await pyodide.runPythonAsync(codigo);
    
    running = true;
    requestAnimationFrame(gameLoop);
    
  } catch (error) {
    Swal.fire({ title: 'Error Python', text: error.message, icon: 'error' });
  }
}

async function detener() {
  axis.visible = true;
  grid.visible = true;

  for (let key in objectList) {
    delete objectList[key];
  }

  running = false;

  Atomics.store(interruptBuffer, 0, 2);

  ctx.clearRect(0, 0, canvas2d.width, canvas2d.height);
}