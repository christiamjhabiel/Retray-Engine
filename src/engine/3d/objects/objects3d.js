//
let objectList = {};

function crearObjeto(tipo, nombre){
  if(tipo == "cube"){
    crearCubo(nombre);
  }else if(tipo == "cone"){
    crearCono(nombre);
  }else if(tipo == "directionalLight"){
    crearLuzDireccional(nombre)
  }
}

function crearCubo(name){
  if (objectList[name]) {
    Swal.fire({
  title: "Error De Creación",
  text: `Ya existe un Objeto con El Nombre ${name}`,
  icon: "error",
  showConfirmButton: true
})
    return;
  }

  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshStandardMaterial({ color: 0x1a1a1a });

  const mesh = new THREE.Mesh(geometry, material);
  objectList[name] = mesh;
  
  scene.add(mesh);
}

function crearCono(name){
  if (objectList[name]) {
    Swal.fire({
  title: "Error De Creación",
  text: `Ya existe un Objeto con El Nombre ${name}`,
  icon: "error",
  showConfirmButton: true
})
    return;
  }

  const geometry = new THREE.ConeGeometry(5, 10, 22);
  const material = new THREE.MeshStandardMaterial({ color: 0x1a1a1a });

  const mesh = new THREE.Mesh(geometry, material);
  objectList[name] = mesh;
  
  scene.add(mesh);
}

function crearLuzDireccional(name){
  const light = new THREE.DirectionalLight( 0xffffff, 0.5 );
  objectList[name] = light;
  scene.add(light);
}

function crearMesh(name, src){
  GLTFloader.load(
    src, 
    function (gltf) {
        const obj = gltf.scene;
        obj.name = name; 
        
        scene.add(obj);
        
        objectList[name] = obj; 
    },
    undefined,
    
    function (error) {
        console.error("Fallo al cargar el modelo:", error);
    }
);
}