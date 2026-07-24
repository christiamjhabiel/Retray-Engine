const canvas3d = document.getElementById('view3d');

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, 360 / 250, 0.1, 1000);
camera.position.z = 5;

const render = new THREE.WebGLRenderer({ canvas: canvas3d, antialias: true });
render.setSize(360, 250);

const controls = new THREE.OrbitControls(camera, canvas3d);

const grid = new THREE.GridHelper(100, 100);
scene.add(grid);

const axis = new THREE.AxesHelper(2, 2, 2);
axis.position.y += 0.002;
scene.add(axis);

const ambient_light = new THREE.AmbientLight( 0x404040 );
scene.add(ambient_light);

const GLTFloader = new THREE.GLTFLoader();

function animate(){
  requestAnimationFrame(animate);
  controls.update();
  render.render(scene, camera);
}
animate();