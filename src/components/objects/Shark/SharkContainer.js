import { Group, Vector3 } from "three";
import Shark from "./Shark";


const MAX_TILT = Math.PI / 4;
 
class SharkContainer extends Group {
    constructor(parent, camera) {
        // Call parent Group() constructor
        super();

        // Init state
        this.state = {
            moveX: 0,
        };

        this.name = 'shark_container';
        const shark = new Shark(this, camera);
        this.state.shark = shark;
        this.add(shark);

        // Add self to parent's update list
        parent.addToUpdateList(this);

        window.addEventListener('mousemove', e => {
            this.state.moveX = -1 + 2 * (e.clientX / window.innerWidth);
        });

    }

    update(timeStamp, isShark) {
        this.rotateY(-this.state.moveX / 100);
        const sharkForward = new Vector3();
        this.state.shark.getWorldDirection(sharkForward);
        sharkForward.multiplyScalar(0.05);
        this.position.add(sharkForward);

        const maxTiltDown = Math.min(MAX_TILT, (this.position.y - 1) * (Math.PI / 10));
        this.state.shark.update(timeStamp, isShark, maxTiltDown)
    }
}

export default SharkContainer;
