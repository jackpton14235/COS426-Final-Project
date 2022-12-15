import { BoxGeometry, Group, Mesh, MeshBasicMaterial, Vector3 } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
require('./fishMod/textures/Default_OBJ.001_baseColor.png');
require('./fishMod/textures/Default_OBJ.001_metallicRoughness.png');
require('./fishMod/textures/Default_OBJ.001_normal.png');
require('./fishMod/textures/Eyes_baseColor.png');
require('./fishMod/scene.bin');
const fishChar = require('./fishMod/scene.gltf');

class School extends Group {
    constructor(parent, model, pos, rot, rand) {
        // Call parent Group() constructor
        super();

        const NUM_FISH = 5; //20
        const BOX_SIZE = 5;

        this.state = { rand };

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
        const radius_squared = 5000; // r = 50 * sqrt(2)
        const tempPos = new Vector3(this.position.x, 0, this.position.z);
        if (tempPos.dot(tempPos) > radius_squared) {
            // find angle around circle that this school is at
            const a = Math.atan(this.position.x / this.position.z);
            const r = this.state.rand.getNext(); // procedural random number
            const new_a = (Math.PI / 2 * r) + a + 3 * Math.PI / 4;
            const x = Math.sin(new_a);
            const z = Math.cos(new_a);
            this.lookAt(new Vector3(x, this.position.y, z));
            this.position.normalize().multiplyScalar(70.71); // sqrt(5000)
        }
    }
}

export default School;
