import { BoxGeometry, Group, Mesh, MeshBasicMaterial, Vector3 } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
require('./fish/textures/fish_baseColor.png');
require('./fish/scene.bin');
const fishChar = require('./fish/scene.gltf');
require('./schoolFish/textures/Material_diffuse.png');
require('./schoolFish/scene.bin');
const schoolFishChar = require('./schoolFish/scene.gltf');

const cubeFish = (geometry, material) => {
    const cube = new Mesh(geometry, material);
    return cube;
};

class School extends Group {
    constructor(parent, fishGeometry, fishMaterial) {
        // Call parent Group() constructor
        super();

        const NUM_FISH = 5; //20
        const BOX_SIZE = 5;

        // const gltfLoader = new GLTFLoader();
        // gltfLoader.load(fishChar, (gltf) => {
        //     gltf.scene.scale.set(.3,.3,.3)
        //     this.add(gltf.scene);
        // });

        const gltfLoader = new GLTFLoader();
        gltfLoader.load(schoolFishChar, (gltf) => {
            this.add(gltf.scene);
            gltf.scene.scale.set(0.3, 0.3, 0.3);
            // gltf.position.set(10,10,10);
        

            const geometry = gltf.scene.parent.geometry;
            const material = gltf.scene.parent.material;
            this.add(gltf.scene);
            let count = 0;
            while (count < NUM_FISH) {
                const pos = new Vector3(
                    Math.random(),
                    Math.random(),
                    Math.random()
                ).multiplyScalar(BOX_SIZE);
                const fish = gltf.scene.clone();
                fish.position.set(pos.x,pos.y,pos.z);
                this.add(fish);
                console.log(fish)
                count++;
            }
        });

        this.position.y = 10;
        this.name = 'school';
        // Add self to parent's update list
        parent.addToUpdateList(this);
        console.log(this)
    }

    update(timeStamp, isShark) {
        // this.translateZ(0.05);
    }
}

export default School;
