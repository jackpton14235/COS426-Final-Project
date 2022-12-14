import { SphereGeometry, Group, Mesh, MeshBasicMaterial, Vector3 } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import SphereCollider from '../../SphereCollider';

const foodShape = (geometry, material) => {
    const cube = new Mesh(geometry, material);
    return cube;
};

class Food extends Group {
    constructor(parent, fish, foodGeometry, foodMaterial, foodPositions) {
        // Call parent Group() constructor
        super();

        this.state = {
            colliders: []
        }

        const NUM_FOOD = 20; // 20
        const BOX_SIZE = 100;  // 100

        let count = 0;
        for (const pos of foodPositions) {
            const food = foodShape(foodGeometry, foodMaterial);
            food.position.set(pos.x, (pos.y)/5, pos.z);
            this.add(food);
            /*this.state.colliders.push(new SphereCollider(
                fish,
                new Vector3(0,0,0),
                1,
                food,
                new Vector3(0,0,0),
                1,
                () => {
                    console.log("Food eaten");
                    food.material.visible = false;
                    console.log(this);
                )
            ))
            */
            count++;
        }
        this.position.y = 2;
        this.name = 'food';
        // Add self to parent's update list
        parent.addToUpdateList(this);
    }

    update(timeStamp, isShark) {
        // this.translateZ(0.05);
    }
}

export default Food;
