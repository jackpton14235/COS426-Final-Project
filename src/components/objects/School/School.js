import { BoxGeometry, Group, Mesh, MeshBasicMaterial, Vector3 } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
// import MODEL from './shark.gltf';

const cubeFish = (geometry, material) => {
    const cube = new Mesh(geometry, material);
    return cube;
};

class School extends Group {
    constructor(parent, fishGeometry, fishMaterial) {
        // Call parent Group() constructor
        super();

        const NUM_FISH = 20;
        const BOX_SIZE = 5;

        let count = 0;
        while (count < NUM_FISH) {
            const pos = new Vector3(
                Math.random(),
                Math.random(),
                Math.random()
            ).multiplyScalar(BOX_SIZE);
            const fish = cubeFish(fishGeometry, fishMaterial);
            fish.position.set(pos.x, pos.y, pos.z);
            this.add(fish);
            count++;
        }
        this.position.y = 10;
        this.name = 'school';
        // Add self to parent's update list
        parent.addToUpdateList(this);
    }

    update(timeStamp, isShark) {
        this.translateZ(0.05);
    }
}

export default School;
