import { Euler, TriangleFanDrawMode, Vector3 } from "three";

class Online {
    constructor(hud, cameraChanger) {
        this.hud = hud;
        this.socket = new WebSocket('ws://localhost:7777');
        this.seed = 0;
        this.inGame = false;
        this.opponentPos = new Vector3(0,0,0);
        this.opponentRot = new Euler(0,0,0);
        this.isShark = false;// Math.random() < .5;
        this.cameraChanger = cameraChanger;
        this.onReady;

        this.foodPositions = [];
        this.schoolPositions = [];

        this.socket.addEventListener('open', (e) => this.onopen(e));
        this.socket.addEventListener('message', (e) => this.onmessage(e));
    }

    startGame() {
        this.socket.send(
            JSON.stringify({
                action: 'create',
            })
        );
    }

    sendCoords(position, rotation) {
        if (this.socket.readyState !== WebSocket.OPEN) return;
        this.socket.send(JSON.stringify({action: "coords", id: this.seed, coords: {
            pos: position,
            rot: rotation
        }}))
    }

    sharkWin() {
        this.socket.send(
            JSON.stringify({
                action: 'sharkWin',
                id: this.seed
            })
        )
    }

    fishWin() {
        this.socket.send(
            JSON.stringify({
                action: 'fishWin',
                id: this.seed
            })
        )
    }

    score() {
        if (this.hud.score >= 10) this.fishWin();
        this.socket.send(
            JSON.stringify({
                action: 'score',
                id: this.seed
            })
        )
    }

    onopen(event) {
        console.log("Opened")
    }

    onmessage(event) {
        let json;
        // console.log(event.data)
        try {
            json = JSON.parse(event.data);
        } catch {
            console.log('Bad JSON', event.data);
        }

        switch (json.action) {
            case 'connected':
                this.startGame();
                break;
            case 'wait':
                // display wait message
                console.log('Waiting for opponent');
                this.hud.setOnlineStatus('Waiting for opponent');
                break;
            case 'start':
                this.seed = json.seed;
                this.inGame = true;
                this.hud.setOnlineStatus(`In lobby ${this.seed}`);
                this.buildFromSeed(json.seed, json.id);
                console.log('starting', this.seed);
                break;
            case 'coords': {
                this.opponentPos = new Vector3(json.coords.pos.x, json.coords.pos.y, json.coords.pos.z);
                this.opponentRot = new Euler(json.coords.rot.x, json.coords.rot.y, json.coords.rot.z)
                break;
            }
            case 'score': {
                // update hud
                break;
            }
            case 'otherDisconnect':
                this.inGame = false;
                this.hud.setOnlineStatus('Waiting for opponent');
                this.startGame();
            case 'sharkWin':
                this.hud.setMainText('Shark Wins!');
                break;
            default:
                console.log('action not recognized:', json.action);
                break;
        }
    }

    buildFromSeed(seed, id) {
        this.isShark = seed % 2 === id;
        this.hud.setSharkStatus(this.isShark);
        console.log("Chosen as", this.isShark? "shark" : "fish")
        if (this.isShark) {
            this.cameraChanger.toShark();
        } else {
            this.cameraChanger.toFish();
        }
        const foodPositions = [];
        const rand = new Rand(seed);

        const NUM_FOOD = 20;
        const BOUNDS_xz = 50;
        const BOUNDS_y = 30;
        for (let i = 0; i < NUM_FOOD; i++) {
            const x = rand.getNext() * 2 * BOUNDS_xz - BOUNDS_xz;
            const y = rand.getNext() * BOUNDS_y;
            const z = rand.getNext() * 2 * BOUNDS_xz - BOUNDS_xz;
            foodPositions.push(new Vector3(x,y,z));
        }

        const NUM_SCHOOLS = 50;
        const schoolPositions = [];
        for (let i = 0; i < NUM_SCHOOLS; i++) {
            const x = rand.getNext() * 2 * BOUNDS_xz - BOUNDS_xz;
            const y = rand.getNext() * BOUNDS_y;
            const z = rand.getNext() * 2 * BOUNDS_xz - BOUNDS_xz;
            schoolPositions.push(new Vector3(x,y,z));
        }

        this.onReady(schoolPositions, foodPositions);
    }
}

class Rand {
    constructor(seed) {
        this.seed = seed;
        this.curr = seed;
    }

    getNext() {
        this.curr = Rand.hashCode(this.curr.toString());
        return (this.curr / 2147483647 + 1) / 2;
    }

    setSeed(seed) {
        this.seed = seed;
        this.curr = seed;
    }

    // hash function from https://stackoverflow.com/questions/6122571/simple-non-secure-hash-function-for-javascript
    static hashCode(str) {
        let hash = 0;
        for (let i = 0, len = str.length; i < len; i++) {
            let chr = str.charCodeAt(i);
            hash = (hash << 5) - hash + chr;
            hash |= 0; // Convert to 32bit integer
        }
        return hash;
    }
}



export default Online;
