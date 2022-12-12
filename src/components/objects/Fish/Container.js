import { Group, Vector3 } from "three";
import Fish from "./Fish";
// import MODEL from './shark.gltf';

const MAX_TILT = Math.PI / 4;
 
class Container extends Group {
    constructor(parent, camera) {
        // Call parent Group() constructor
        super();

        // Init state
        this.state = {
            moveX: 0,
            boost: false,
            viewChange: false
        };

        this.name = 'fish_container';
        const fish = new Fish(this, camera);
        this.state.fish = fish;
        this.add(fish);

        // Add self to parent's update list
        parent.addToUpdateList(this);

        window.addEventListener('mousemove', e => {
            this.state.moveX = -1 + 2 * (e.clientX / window.innerWidth);
        });

        window.addEventListener('keydown', e => {
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

    update(timeStamp, isShark, opponentPos, opponentRot) {
        if (!isShark){
            this.rotateY(-this.state.moveX / 100);
            const fishForward = new Vector3();
            this.state.fish.getWorldDirection(fishForward);
            fishForward.multiplyScalar(this.state.boost? .50 : .15);
            this.position.add(fishForward);

            const maxTiltDown = Math.min(MAX_TILT, (this.position.y - 1) * (Math.PI / 10));
            this.state.fish.update(timeStamp, isShark, maxTiltDown)
        }  else {
            // update from server
            this.position.copy(opponentPos);
            this.rotation.copy(opponentRot);
        }
    }
}

export default Container;
