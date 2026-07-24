function exportarHTML() {
  let template = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${game_name.value}</title>
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet">
<style>
#game_view3d, #game_view2d {
  position: absolute; top: 0; left: 0; width: 100%; height: 100%;
}
#game_view3d { z-index: 1; background: black; }
#game_view2d { z-index: 2; background: transparent; pointer-events: none; }
#game_loader{
  position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: 9999;
  display: flex; justify-content: center; align-items: center; flex-direction: column; gap: 20px;
  background: ${oc.value};
}
#game_ltxt, #game_optionalText {
  color: white; font-size: 20px; font-weight: bold;
  text-shadow: 2px 0 0 black, -2px 0 0 black, 0 2px 0 black, 0 -2px 0 black;
}
</style>
</head>
<body>
<canvas id="game_view3d"></canvas>
<canvas id="game_view2d"></canvas>
<div id="game_loader">
  <h2 id="game_optionalText">${ot.value}</h2>
  <div class="spinner-border m-5" role="status"></div>
  <p id="game_ltxt">cargando...</p>
</div>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
<script src="https://cdn.jsdelivr.net/pyodide/v0.25.1/full/pyodide.js"></script>

<script src="https://unpkg.com/three@0.140.0/build/three.min.js"></script>
<script src="https://unpkg.com/three@0.140.0/examples/js/controls/OrbitControls.js"></script>

<script>
const game_code = ${JSON.stringify(editor.getValue())};

const game_canvas3d = document.getElementById('game_view3d');
const game_canvas2d = document.getElementById('game_view2d');
game_canvas2d.width = window.innerWidth;
game_canvas2d.height = window.innerHeight;
const game_ctx = game_canvas2d.getContext('2d');
game_ctx.font = "20px Arial";

const game_loader = document.getElementById('game_loader');
const game_ltxt = document.getElementById('game_ltxt');
const game_optionalText = document.getElementById('game_optionalText');

const game_scene = new THREE.Scene();
const game_camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
game_camera.position.z = 5;

const game_renderer = new THREE.WebGLRenderer({ canvas: game_canvas3d, antialias: true });
game_renderer.setSize(window.innerWidth, window.innerHeight);

const game_controls = new THREE.OrbitControls(game_camera, game_canvas3d);
game_scene.add(new THREE.AxesHelper(2));

const game_ambientLight = new THREE.AmbientLight(0xffffff);
game_scene.add(game_ambientLight);

function game_drawCircle(x, y, r){
  game_ctx.beginPath();
  game_ctx.arc(x, y, r, 0, Math.PI * 2);
  game_ctx.fill();
}

function game_animate(){
  requestAnimationFrame(game_animate);
  game_controls.update();
  game_renderer.render(game_scene, game_camera);
}
game_animate();

let game_objectList = {};

function game_crearObjeto(tipo, nombre){
  if(tipo == "cube"){
    game_crearCubo(nombre);
  }else if(tipo == "cone"){
    game_crearCono(nombre);
  }else if(tipo == "directionalLight"){
    game_crearLuzDireccional(nombre)
  }
}

function game_crearCubo(name){
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshStandardMaterial({ color: 0x1a1a1a });
  const mesh = new THREE.Mesh(geometry, material);
  game_objectList[name] = mesh;
  game_scene.add(mesh);
}

function game_crearCono(name){
  const geometry = new THREE.ConeGeometry(5, 10, 22);
  const material = new THREE.MeshStandardMaterial({ color: 0x1a1a1a });
  const mesh = new THREE.Mesh(geometry, material);
  game_objectList[name] = mesh;
  game_scene.add(mesh);
}

function game_crearLuzDireccional(name){
  const light = new THREE.DirectionalLight( 0xffffff, 0.5 );
  game_objectList[name] = light;
  game_scene.add(light);
}

let game_pyodide;
let game_running = false;

let game_checkInterval = setInterval(() => {
  if (game_pyodide) {
    game_ltxt.innerText = "¡Listo!";
    game_loader.style.transition = "opacity 0.5s ease-out";
    game_loader.style.opacity = 0;
    setTimeout(() => game_loader.style.display = 'none', 500);
    clearInterval(game_checkInterval);
  }
}, 300);

async function game_initPython() {
  game_pyodide = await loadPyodide();
}
game_initPython();

async function game_loop() {
  if (!game_running) return;
  try {
    await game_pyodide.runPythonAsync("update()");
  } catch (e) {
    console.error(e);
    game_running = false;
    Swal.fire({icon: 'error', title: 'Error en Python', text: e});
  }
  requestAnimationFrame(game_loop);
}

async function game_ejecutar() {
  try {
    game_pyodide.globals.set("create", (tipo, nombre) => game_crearObjeto(tipo, nombre));
    game_pyodide.globals.set("move", (nombre, x, y, z) => {
      if(game_objectList[nombre]) game_objectList[nombre].position.set(x, y, z)
    });
    game_pyodide.globals.set("toast", (msg) => Swal.fire({ text: msg, toast: true, timer: 2000 }));
    game_pyodide.globals.set("alert", (msg, msgt, iconn) => Swal.fire({ title: msg, text: msgt, icon: iconn }));
    game_pyodide.globals.set("cam_set_free", () => game_controls.enabled = true);
    game_pyodide.globals.set("cam_set_static", () => game_controls.enabled = false);
    game_pyodide.globals.set("cam_set", (x, y, z) => game_camera.position.set(x, y, z));
    game_pyodide.globals.set("cam_set_rotation", (x, y, z) => game_camera.rotation.set(x, y, z));
    game_pyodide.globals.set("cam_third_person", (obj) => {
      if(game_objectList[obj]) game_controls.target.copy(game_objectList[obj].position)
    });
    game_pyodide.globals.set("drawText", (txt, x, y) => game_ctx.fillText(txt, x, y));
    game_pyodide.globals.set("clear", () => game_ctx.clearRect(0, 0, game_canvas2d.width, game_canvas2d.height));
    game_pyodide.globals.set("drawRect", (x, y, w, h) => game_ctx.fillRect(x, y, w, h));
    game_pyodide.globals.set("setColor", (color) => game_ctx.fillStyle = color);
    game_pyodide.globals.set("drawCircle", (x, y, r) => game_drawCircle(x, y, r));
    game_pyodide.globals.set("setAmbientLightColor", (colour) => game_ambientLight.color.set(colour));
    game_pyodide.globals.set("setAmbientLightIntensity", (intensityy) => game_ambientLight.intensity = intensityy);
    game_pyodide.globals.set("setLightIntensity", (light, intensityy) => {
      if(game_objectList[light]) game_objectList[light].intensity = intensityy
    });
    game_pyodide.globals.set("setLightColor", (light, colour) => {
      if(game_objectList[light]) game_objectList[light].color.set(colour)
    });

    await game_pyodide.runPythonAsync(game_code);
    game_running = true;
    requestAnimationFrame(game_loop);
  } catch (error) { console.error(error); }
}

async function game_start() {
  while (!game_pyodide) {
    await new Promise(r => setTimeout(r, 100));
  }
  await game_ejecutar();
}
game_start();

window.addEventListener('resize', () => {
  game_camera.aspect = window.innerWidth / window.innerHeight;
  game_camera.updateProjectionMatrix();
  game_renderer.setSize(window.innerWidth, window.innerHeight);
  game_canvas2d.width = window.innerWidth;
  game_canvas2d.height = window.innerHeight;
});
</script>
</body>
</html>`;
  
  const blob = new Blob([template], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = game_name.value + '.html';
  a.click();
  URL.revokeObjectURL(url);
}
