import { BoxGeometry, Group, Mesh, MeshBasicMaterial, Vector3 } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
// import MODEL from 'src/components/objects/Shark/sharkChar/scene.gltf';
require('./sharkChar/scene.bin');
//Put your textures here
require('./sharkChar/textures/Material_2_baseColor.png');
require('./sharkChar/textures/Material_2_metallicRoughness.png');
require('./sharkChar/textures/Material_2_normal.png');
const scene = require('./sharkChar/scene.gltf');


const MAX_TILT = Math.PI / 4;

class Shark extends Group {
    constructor(parent, camera) {
        // Call parent Group() constructor
        super();
        // console.log(camera)

        // Init state
        this.state = {
            moveY: 0
        };

        this.name = 'shark';
        
        // Load object 
        // citation for 3D model
        //  This work is based on "Finn The Shark" 
        // (https://sketchfab.com/3d-models/finn-the-shark-c60933a54ffd4a21a5853592daf19d55) 
        // by XelaDoesArt (https://sketchfab.com/XelaDoesArt) licensed under CC-BY-4.0 
        // (http://creativecommons.org/licenses/by/4.0/)
        const loader = new GLTFLoader();
        loader.load(scene, (gltf) => {
            console.log(gltf.scene)
            this.add(gltf.scene);
            gltf.scene.position.set(0,0,0);
            gltf.scene.scale.set(100,100,100);
        });

        this.name = 'shark';

        if (camera) {
            this.add(camera);
            camera.position.y = 10;
            camera.position.z = -25;
            camera.lookAt(new Vector3(0, 0, 0));
        }
        // this.position.y = 5;

        window.addEventListener('mousemove', e => {
            this.state.moveX = -1 + 2 * (e.clientX / window.innerWidth);
            this.state.moveY = -1 + 2 * (e.clientY / window.innerHeight);
        });

        // Add self to parent's update list
        if (parent.addToUpdateList)
            parent.addToUpdateList(this);
    }

    update(timeStamp, isShark, maxTiltDown, rotX) {
        if (isShark) {
            this.rotateX(-this.state.moveY / 50);
            if (this.rotation.x > maxTiltDown) {
                this.rotation.x = maxTiltDown;
            }
        } else {
            this.rotation.x = rotX;
        }
    }
}

export default Shark;
