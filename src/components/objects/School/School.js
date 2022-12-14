import { BoxGeometry, Group, Mesh, MeshBasicMaterial, Vector3 } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
require('./fishMod/textures/Default_OBJ.001_baseColor.png');
require('./fishMod/textures/Default_OBJ.001_metallicRoughness.png');
require('./fishMod/textures/Default_OBJ.001_normal.png');
require('./fishMod/textures/Eyes_baseColor.png');
require('./fishMod/scene.bin');
const fishChar = require('./fishMod/scene.gltf');

class School extends Group {
    constructor(parent, model, pos) {
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
            fish.position.copy(pos)
            this.add(fish);
            // console.log(fish)
            count++;
        }

        this.position.copy(pos)
        this.name = 'school';
        // Add self to parent's update list
        parent.addToUpdateList(this);
        // console.log(this)
    }

    update(timeStamp, isShark) {
        // this.translateZ(0.05);
    }
}

export default School;
