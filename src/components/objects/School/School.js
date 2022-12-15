import { BoxGeometry, Group, Mesh, MeshBasicMaterial, Vector3 } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
require('./fishMod/textures/Default_OBJ.001_baseColor.png');
require('./fishMod/textures/Default_OBJ.001_metallicRoughness.png');
require('./fishMod/textures/Default_OBJ.001_normal.png');
require('./fishMod/textures/Eyes_baseColor.png');
require('./fishMod/scene.bin');
const fishChar = require('./fishMod/scene.gltf');

class School extends Group {
    constructor(parent, model, pos, rot) {
        // Call parent Group() constructor
        super();

        const NUM_FISH = 5; //20
        const BOX_SIZE = 5;

        let count = 0;
        while (count < NUM_FISH) {
            const pos = new Vector3(
                Math.random() - .5,
                Math.random() - .5,
                Math.random() - .5
            ).multiplyScalar(BOX_SIZE);
            const fish = model.clone();
            fish.position.copy(pos);
            this.add(fish);
            // console.log(fish)
            count++;
        }

        this.position.copy(pos);
        this.rotation.y = rot;
        this.name = 'school';
        // Add self to parent's update list
        parent.addToUpdateList(this);
        // console.log(this)
    }

    update(timeStamp, isShark) {
        this.translateZ(0.05);
        // if (this.position.x > 50) {
        //     const amin = Math.PI / 2;
        //     const amax = 3 * Math.PI / 2;
        //     const a = amin + (amax - amin) * Math.random();
        //     this.rotation.y = a;
        //     this.position.x = 50;
        // }
        // if (this.position.x < -50) {
        //     const amin = 3 * Math.PI / 2;
        //     const amax = 5 * Math.PI / 2;
        //     const a = amin + (amax - amin) * Math.random();
        //     this.rotation.y = a;
        //     this.position.x = -50;
        // }
        // if (this.position.z > 50) {
        //     const amin = Math.PI;
        //     const amax = 2 * Math.PI;
        //     const a = amin + (amax - amin) * Math.random();
        //     this.rotation.y = a;
        //     this.position.z = 50;
        // }
        // if (this.position.z < -50) {
        //     const amin = 0;
        //     const amax = Math.PI;
        //     const a = amin + (amax - amin) * Math.random();
        //     this.rotation.y = a;
        //     this.position.z = -50;
        // }
        const radius_squared = 2500; // r = 50 * sqrt(2)
        const tempPos = new Vector3(this.position.x, 0, this.position.z);
        if (tempPos.dot(tempPos) > radius_squared) {
            // find angle around circle that this school is at
            const a = Math.atan(this.position.x / this.position.z);
            const new_a = (Math.PI / 2 * Math.random()) + a + 3 * Math.PI / 4;
            const x = Math.sin(new_a);
            const z = Math.cos(new_a);
            this.lookAt(new Vector3(x, this.position.y, z));
            this.position.normalize().multiplyScalar(50);
        }
    }
}

export default School;
