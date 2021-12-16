

//declarar las variables de nuestra app. 
let scene, camera, renderer, clock, deltaTime, totalTime;

let arToolkitSource, arToolkitContext;

let mesh1, mesh2, mesh4, mesh5, mesh6;

let markerRoot1,markerRoot2, marker1, marker2, markerRoot6;

let RhinoMesh, RhinoMesh2;

let raycaster; //permite apuntar o detectar objetos en nuestra aplicacion 

let mouse = new THREE.Vector2();

let INTERSECTED; //guarda info sobre los objetos intersectados por mi raycast

let objects = []; //guarda los objetos que quiero detectar

let video1;

let sprite4;

let canvas1, context1, texture1;


///////////////FUNCIONES////////////////////////////
//funcion principal 
function main() {
    init();
    animate();
}

//ejecutamos la app llamando a main 
main(); //llamado a la funcion main 

function init() {
    ////////////////////////////////////////////////////////
    //THREE Setup
    ///////////////////////////////////////////////////////
    // crear nuestra escena -  OBJETO.
    scene = new THREE.Scene(); //  crea un objeto escena.

    //////////////////////////////////////////////////////
    //LUCES
    //////////////////////////////////////////////////////

    let light = new THREE.PointLight(0xffffff, 1, 100); //creo nueva luz 
    light.position.set(0, 4, 4); //indico la posicion de la luz 
    light.castShadow = true; //activo la capacidad de generar sombras.
    light.shadow.mapSize.width = 4096; //resolucion mapa de sombras ancho 
    light.shadow.mapSize.height = 4096;// resolucion mapa de sombras alto

    
    scene.add(light); //agrego la luz a mi escena 

    let lightSphere = new THREE.Mesh(
        new THREE.SphereGeometry(0.1),
        new THREE.MeshBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.8
        })
    );

    lightSphere.position.copy(light);
    scene.add(lightSphere);

    //creamos luces 
    let ambientLight = new THREE.AmbientLight(0xcccccc); //creo las luz
    scene.add(ambientLight); //agrego la luz a mi escena. 

    
    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 10000);
//agrego la camara a mi escena 
    scene.add(camera);
    raycaster = new THREE.Raycaster();

    //permite mostrar las cosas en 3d en la pantalla
    renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true
    });

    renderer.setClearColor(new THREE.Color('lightgrey'), 0);
    renderer.setSize(640, 480);
    renderer.domElement.style.position = 'absolute';
    renderer.domElement.style.top = '0px';
    renderer.domElement.style.left = '0px';

    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    document.body.appendChild(renderer.domElement); // agregarlo a nuestra pagina web


    //tiempo
    clock = new THREE.Clock();
    deltaTime = 0;
    totalTime = 0;

    ////////////////////////////////////////////////////////
    //AR Setup
    ///////////////////////////////////////////////////////

    arToolkitSource = new THREEx.ArToolkitSource({
        sourceType: 'webcam',
    });

    function onResize() {
        arToolkitSource.onResize()
        arToolkitSource.copySizeTo(renderer.domElement)
        if (arToolkitContext.arController !== null) {
            arToolkitSource.copySizeTo(arToolkitContext.arController.canvas)
        }
    }


    arToolkitSource.init(function onReady() {
        onResize();
    });

    //agregamos un event listener
    window.addEventListener('resize', function () { onResize() });

    //Setup ArKitContext
    arToolkitContext = new THREEx.ArToolkitContext({
        cameraParametersUrl: 'data/camera_para.dat',
        detectionMode: 'mono'
    });

    arToolkitContext.init(function onCompleted() {
        camera.projectionMatrix.copy(arToolkitContext.getProjectionMatrix());
    });
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


    /////////////////////////////////////////////////
    //Marker setup
    /////////////////////////////////////////////////

    markerRoot1 = new THREE.Group(); //creamos un grupo de objetos
    markerRoot1.name = 'marker1';
    scene.add(markerRoot1); // agregamos el grupo a la escena. 

    //Creamos nuestro marcador 
    let markerControl = new THREEx.ArMarkerControls(arToolkitContext, markerRoot1, {

        type: 'pattern', patternUrl: 'data/pattern-Z1.patt',
    });


    markerRoot2 = new THREE.Group(); //creamos un grupo de objetos
    markerRoot2.name = 'marker2';
    scene.add(markerRoot2); // agregamos el grupo a la escena. 

    //Creamos nuestro marcador 
    let markerContro2 = new THREEx.ArMarkerControls(arToolkitContext, markerRoot2, {

        type: 'pattern', patternUrl: 'data/pattern-Z5.patt',
    });
///////////////////// maca que no es maca/////////////

markerRoot6 = new THREE.Group();
	scene.add(markerRoot6);
	let markerControls6 = new THREEx.ArMarkerControls(arToolkitContext, markerRoot6, {
		type: 'pattern', patternUrl: "data/z2.patt",
	})

	/// VIDEO

	let geometry6 =  new THREE.PlaneGeometry(3,2);

	video1 =  document.getElementById('video1');
	let texture =  new THREE.VideoTexture(video1);
	texture.minFilter =  THREE.LinearFilter;
	texture.magFilter = THREE.LinearFilter;
	texture.format =  THREE.RGBFormat;
	video1.pause();
	
	let material6 =  new THREE.MeshBasicMaterial({map: texture});
	mesh6 =  new THREE.Mesh(geometry6, material6);
	mesh6.name= "video";
	mesh6.rotation.x =  -Math.PI/2;
	markerRoot6.add(mesh6);
	objects.push(mesh6);


    //// MARCADORES PATO/// LOS QUE ESTAN BIEN HECHOS


    //Marcador 1
    marker1 = new THREE.Group();
    marker1.name = 'marker1';
    scene.add(marker1); //agregamos el marcador a la escena 

    let markerControls4 = new THREEx.ArMarkerControls(arToolkitContext, marker1, {
        type: 'pattern',
        patternUrl: "data/z3.patt",
    })

    //Marcador 2
    marker2 = new THREE.Group();
    marker2.name = 'marker2';
    scene.add(marker2); //agregamos el marcador a la escena 

    let markerControls5 = new THREEx.ArMarkerControls(arToolkitContext, marker2, {
        type: 'pattern',
        patternUrl: "data/z4.patt",
    })



    /////////////////////////////////////////////////
    //GEOMETRY
    /////////////////////////////////////////////////
    ////////////GEOMETRIAS//////////////////////////////////////

    //paso 1 - creo geometria 
    let box4 = new THREE.CubeGeometry(1, .5, .5); //plantilla para crear geometrias cubo

    //Paso 2 - creo materiales
    //material 1
    let loader =  new THREE.TextureLoader();

    let texture10 =  loader.load('./images/lamina1.jpg');
    
    let matBox04 = new THREE.MeshLambertMaterial(
        {
            map: texture10,
            color: Math.random() * 0xffffff,
            side: THREE.DoubleSide
        }
    );

    //material 2
    let texture11 =  loader.load('./images/lamina2.jpg');
    let matBox05 = new THREE.MeshLambertMaterial(
        {
            map: texture11,
            color: Math.random() * 0xffffff,
            side: THREE.DoubleSide
        }
    );

    //paso 3 - Creo Meshes

    //mesh1
    mesh4 = new THREE.Mesh(box4, matBox04);
    mesh4.position.y = .25;
    mesh4.name = 'Elevaciones del proyecto, con sus medidas respectivas'; //mensaje a mostrar cuando indicamos el mesh con nuestro mouse

    //mesh2
    mesh5 = new THREE.Mesh(box4, matBox05);
    mesh5.position.y = .25;
    //mesh2.position.x = -.6;
    mesh5.name = 'detalles constructivos que unen cada pieza de la estructura'; //mensaje a mostrar cuando indicamos el mesh con nuestro mouse


////////////PA ARRIBA GEOMETRIA PATO///////////////// LA MEJOR



    //Creo una geometria cubo
    //-//-//let geo1 = new THREE.CubeGeometry(.75, .75, .75); // crear la plantilla
    //creo material 
    //-//-//let material1 = new THREE.MeshLambertMaterial({ color: Math.random() * 0xffffff }); //creamos el material 

    //Creo una geometria 
    // - let geo2 = new THREE.CubeGeometry(.75, .75, .75); // crear la plantilla
    //creo material 
    // - let material2 = new THREE.MeshLambertMaterial({ color: Math.random() * 0xffffff }); //creamos el material

    //////////////MESH1//////////////////////////////////////////
    //creo un mesh con la geometria y el material 
    //-//-//mesh1 = new THREE.Mesh(geo1, material1); //nuestro mesh 
    let box = new THREE.CubeGeometry(.5, .5, .5);

    let matBox01 = new THREE.MeshLambertMaterial(
        {
            color: Math.random() * 0xffffff,
            side: THREE.DoubleSide
        }
    );
    
    //material 2
    let matBox02 = new THREE.MeshLambertMaterial(
        {
            color: Math.random() * 0xffffff,
            side: THREE.DoubleSide
        }
    );

    mesh1 = new THREE.Mesh(box,matBox01); //nuestro mesh 
    mesh1.name = 'Parasol';
    mesh1.position.y = 0.25;


    mesh2 = new THREE.Mesh(box,matBox02); //nuestro mesh 
    mesh2.name = 'Iteración';
    mesh2.position.y = 0.25;


    //////////////MESH2//////////////////////////////////////////
    //creo un mesh con la geometria y el material 
    // - mesh2 = new THREE.Mesh(geo2, material2); //nuestro mesh 
    //CAMBIO LA POSICION DE MI MESH 
    // - mesh2.position.x = 0.75;
   // - mesh2.position.y = 1.0;
    //activo el recibir y proyectar sombras en otros meshes
    // - mesh2.castShadow = true;
    // - mesh2.receiveShadow = true;


    //markerRoot1.add(mesh1); //esta linea agrega el cubo a mi grupo y finalmente se puede ver en la escena 
    //markerRoot1.add(mesh2); //agregando el mesh 2 a mi escena

    ////////////////////PISO////////////////
    let floorGeometry = new THREE.PlaneGeometry(20, 20);
    let floorMaterial = new THREE.ShadowMaterial();
    floorMaterial.opacity = 0.25;

    let floorMesh = new THREE.Mesh(floorGeometry, floorMaterial);

    floorMesh.rotation.x = -Math.PI / 2;
    floorMesh.receiveShadow = true;
    markerRoot1.add(floorMesh);


    /////// OBJ IMPORT/////////////////////
    function onProgress(xhr) { console.log((xhr.loaded / xhr.total * 100) + "% loaded"); }
    function onError(xhr) { console.log("ha ocurrido un error") };

    //////OBJETO RHINO 1///////////////
    new THREE.MTLLoader ()
        .setPath('models/')
        .load('mod1.mtl', function (materials) {
            materials.preload();
            new THREE.OBJLoader()
                .setMaterials(materials)
                .setPath('models/')
                .load('mod1.obj', function (group) {
                    RhinoMesh = group.children[0];
                    RhinoMesh.material.side = THREE.DoubleSide;
                    RhinoMesh.scale.set(0.003,0.003, 0.003);
                    RhinoMesh.castShadow = true;
                    RhinoMesh.receiveShadow = true;

                    markerRoot1.add(RhinoMesh);
                }, onProgress, onError);
        });
    new THREE.MTLLoader ()
        .setPath('models/')
        .load('mod2.mtl', function (materials) {
            materials.preload();
            new THREE.OBJLoader()
                .setMaterials(materials)
                .setPath('models/')
                .load('mod2.obj', function (group) {
                    RhinoMesh = group.children[0];
                    RhinoMesh.material.side = THREE.DoubleSide;
                    RhinoMesh.scale.set(0.003,0.003, 0.003);
                    RhinoMesh.castShadow = true;
                    RhinoMesh.receiveShadow = true;

                    markerRoot2.add(RhinoMesh);
                }, onProgress, onError);
        });
    // //////OBJETO RHINO 2///////////////
    // new THREE.MTLLoader()
    //     .setPath('models/')
    //     .load('model2.mtl', function (materials) {
    //         materials.preload();
    //         new THREE.OBJLoader()
    //             .setMaterials(materials)
    //             .setPath('models/')
    //             .load('model2.obj', function (group) {
    //                 RhinoMesh2 = group.children[0];
    //                 RhinoMesh2.material.side = THREE.DoubleSide;
    //                 RhinoMesh2.scale.set(1, 1, 1);
    //                 RhinoMesh2.castShadow = true;
    //                 RhinoMesh2.receiveShadow = true;

    //                 markerRoot1.add(RhinoMesh2);
    //             }, onProgress, onError);
    //     });





    //mesh2
    // - mesh2 = new THREE.Mesh(box, matBox02);
    // - mesh2.position.y = .25;
    //mesh2.position.x = -.6;
    // - mesh2.name = 'HIRO. Soy el marcador de realidad aumentada mas usado en la historia'; //mensaje a mostrar cuando indicamos el mesh con nuestro mouse

    ///////CREACION ELEMENTOS TEXTO//////////////////////
    //CREACION DE CANVAS 
    canvas1 = document.createElement('canvas');
    context1 = canvas1.getContext('2d');
    context1.font = "Bold 30px Arial";
    context1.fillStyle = "rgba(0,0,0,0.95)";
    context1.fillText('', 0, 150);


    //los contenidos del canvas seran usados como textura 
    texture1 = new THREE.Texture(canvas1);
    texture1.needsUpdate = true;

    //creacion del sprite
    var spriteMaterial = new THREE.SpriteMaterial(
        {
            map: texture1
        }
    )
    sprite1 = new THREE.Sprite(spriteMaterial);
    sprite1.scale.set(2, 1, 2);
    sprite1.position.set(10, 10, 0);

    sprite2 = new THREE.Sprite(spriteMaterial);
    sprite2.scale.set(2, 2, 2);
    sprite2.position.set(10, 10, 0);
    
    ////sprite pato////

    
    //creacion del sprite
    var spriteMaterial = new THREE.SpriteMaterial(
        {
            map: texture1
        }
    )
    sprite4 = new THREE.Sprite(spriteMaterial);
    sprite4.scale.set(1, 0.5, 1);
    //sprite1.position.set(5, 5, 0);

     ////////////AGREGAMOS OBJETOS A ESCeNA Y ARRAY OBJECTS
     objects.push(mesh4);
    
     objects.push(mesh5);


    ////////////AGREGAMOS OBJETOS A ESCeNA Y ARRAY OBJECTS
    
    objects.push(mesh1);

    objects.push(mesh2);
    
    // - objects.push(mesh2);


    //agregamos nuestros objetos a la escena mediante el objeto marker1


    markerRoot1.add(sprite1); //-//-//-//


    markerRoot2.add(sprite2);
     //agregamos nuestros objetos a la escena mediante el objeto marker1

     marker1.add(mesh4);
     marker1.add(sprite4);
 
     marker2.add(mesh5);
     marker2.add(sprite4);

    //////////EVENT LISTERNERS/////////////////////////////////
    document.addEventListener('mousemove', onDocumentMouseMove, false);// detecta movimiento del mouse

}

//////////////FUNCIONES//////////////////////////////////

function onDocumentMouseMove(event) {
    event.preventDefault();
    sprite1.position.set((event.clientX / window.innerWidth) * 2 - 1, - (event.clientY / window.innerHeight) * 2 + 1, 0);
    sprite1.renderOrder = 999;
    sprite1.onBeforeRender = function (renderer) { renderer.clearDepth(); }
    sprite2.position.set((event.clientX / window.innerWidth) * 2 - 1, - (event.clientY / window.innerHeight) * 2 + 1, 0);
    sprite2.renderOrder = 999;
    sprite2.onBeforeRender = function (renderer) { renderer.clearDepth(); }
    sprite4.position.set((event.clientX / window.innerWidth) * 2 - 1, - (event.clientY / window.innerHeight) * 2 + 1, 0);
    sprite4.renderOrder = 999;
    sprite4.onBeforeRender = function (renderer) { renderer.clearDepth(); }

    mouse.set((event.clientX / window.innerWidth) * 2 - 1, - (event.clientY / window.innerHeight) * 2 + 1); //mouse pos

    raycaster.setFromCamera(mouse, camera); //creo el rayo que va desde la camara , pasa por el frustrum 
    let intersects = raycaster.intersectObjects(objects, true); //buscamos las intersecciones

    if (intersects.length > 0) {
        if (intersects[0].object != INTERSECTED) {
            if (INTERSECTED) {
                INTERSECTED.material.color.setHex(INTERSECTED.currentHex);
            }
            INTERSECTED = intersects[0].object;
            INTERSECTED.currentHex = INTERSECTED.material.color.getHex();
            INTERSECTED.material.color.setHex(0xffff00);

            if (INTERSECTED.name) {
                context1.clearRect(0, 0, 10, 10);
                let message = INTERSECTED.name;
                let metrics = context1.measureText(message);
                let width = metrics.width;
                context1.fillStyle = "rgba(0,0,0,0.95)"; // black border
                context1.fillRect(0, 0, width + 8, 20 + 8);
                context1.fillStyle = "rgba(255,255,255,0.95)"; // white filler
                context1.fillRect(2, 2, width + 4, 20 + 4);
                context1.fillStyle = "rgba(0,0,0,1)"; // text color
                context1.fillText(message, 4, 20);
                texture1.needsUpdate = true;
            }
            else {
                context1.clearRect(0, 0, 10, 10);
                texture1.needsUpdate = true;
            }
        }
    }
    //si no encuentra intersecciones
    else {
        if (INTERSECTED) {
            INTERSECTED.material.color.setHex(INTERSECTED.currentHex); //devolviendo el color original al objeto            
        }
        INTERSECTED = null;
        context1.clearRect(0, 0, 300, 300);
        texture1.needsUpdate = true;
    }
}

//// maca no maca////
function onDocumentMouseMove(event) {
    event.preventDefault();
    mouse.set((event.clientX / window.innerWidth) * 2 - 1, - (event.clientY / window.innerHeight) * 2 + 1); //mouse pos
    raycaster.setFromCamera(mouse, camera); //creo el rayo que va desde la camara , pasa por el frustrum 
    let intersects = raycaster.intersectObjects(objects, true); //buscamos las intersecciones

    if (intersects.length > 0) {
        if (intersects[0].object != INTERSECTED) {
            if (INTERSECTED) {
             
            }
            INTERSECTED = intersects[0].object;		
			
			video1.play();

			console.log("intersected");

        }

    }

}


function update() {
    //actualiza contenido de nuestra app AR
    if (arToolkitSource.ready !== false) {
        arToolkitContext.update(arToolkitSource.domElement);
    }
}

function render() {
    renderer.render(scene, camera);
}

function animate() {
    requestAnimationFrame(animate);
    deltaTime = clock.getDelta();
    totalTime += deltaTime; // totalTime =  totalTime + deltaTime 
    update();
    render();
}