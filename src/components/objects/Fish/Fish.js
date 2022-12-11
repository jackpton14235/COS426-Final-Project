import { BoxGeometry, Group, Mesh, MeshBasicMaterial, Vector3 } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
// import MODEL from './shark.gltf';

const MAX_TILT = Math.PI / 4;
 
class Fish extends Group {
    constructor(parent, camera) {
        // Call parent Group() constructor
        super();

        // Init state
        this.state = {
            moveY: 0,
        };

        // Load object
        const loader = new GLTFLoader();

        this.name = 'fish';
        // loader.load(MODEL, (gltf) => {
        //     this.add(gltf.scene);
        // });
        const geometry = new BoxGeometry(.4, .4, .4);
        const material = new MeshBasicMaterial({ color: 0x663377 });
        const cube = new Mesh(geometry, material);
        this.add(cube);

        if (camera) {
            this.add(camera);
            camera.position.z = -10;
            camera.lookAt(new Vector3(0,0,0))
        }

        // Add self to parent's update list
        if (parent.addToUpdateList)
            parent.addToUpdateList(this);

        window.addEventListener('mousemove', e => {
            this.state.moveX = -1 + 2 * (e.clientX / window.innerWidth);
            this.state.moveY = -1 + 2 * (e.clientY / window.innerHeight);
        });

        window.addEventListener('keydown', e => {
            // console.log(e.key)
            if(e.key == 'c'){
                this.changeColor();
            }
            if (e.key === ' ') 
            {
                this.state.boost = true;
            }
            if(e.key == 'Shift' ) {
                this.viewChange = true;
            }
        });


       window.addEventListener('keyup', e => {
           if(e.key == 'Shift') {
               this.viewChange = false;
           }
           if (e.key === ' ') 
           {
               this.state.boost = false;
           }
        });


    }

    changeColor() {
        this.material.color.set(0x41bc66);
    }

    update(timeStamp, isShark, maxTiltDown) {
        if (!isShark) {
            this.rotateX(-this.state.moveY / 100);
            const maxTiltUp = -1 * MAX_TILT;
            if (this.rotation.x > maxTiltDown) {
                this.rotation.x = maxTiltDown;
            }
            // if (this.rotation.x < maxTiltUp) {
            //     this.rotation.x = maxTiltUp;
            //     console.log("There")
            // }
            // this.rotation.z = 0;
        } else {
            // update from server
        }
    }
}

export default Fish;
