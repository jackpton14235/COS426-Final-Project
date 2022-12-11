import { BoxGeometry, Group, Mesh, MeshBasicMaterial, Vector3 } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
// import MODEL from './shark.gltf';

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

        // Load object
        const loader = new GLTFLoader();
        // loader.load(, (gltf) => {
        //    this.add(gltf.scene);
         //   gltf.scene.position.set(10,10,10);
       // });

        this.name = 'shark';
        // });
        
        const geometry = new BoxGeometry(1, 1, 1);
        const material = new MeshBasicMaterial({ color: 0x003377 });
        const cube = new Mesh(geometry, material);
        this.add(cube);

        if (camera) {
            this.add(camera);
            camera.position.z = -10;
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

    update(timeStamp, isShark, maxTiltDown) {
        if (isShark) {
            this.rotateX(-this.state.moveY / 100);
            if (this.rotation.x > maxTiltDown) {
                this.rotation.x = maxTiltDown;
            }
        } else {
            // update from server
        }
        
        
    }
}

export default Shark;
