import { Euler, Vector3 } from "three";

class Online {
    constructor() {
        this.socket = new WebSocket('ws://localhost:7777');
        this.seed = 0;
        this.inGame = false;
        this.opponentPos = new Vector3(0,0,0);
        this.opponentRot = new Euler(0,0,0);

        this.socket.addEventListener('open', (e) => this.onopen(e));
        this.socket.addEventListener('message', (e) => this.onmessage(e));

        this.text = document.createElement('h2');
        this.text.innerHTML = "Connecting...";
        this.text.style = 'position:absolute;margin-left:1rem;color:#ff2222;'
        document.querySelector('body').appendChild(this.text);
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

    onopen(event) {
        console.log("Opened")
    }

    onmessage(event) {
        let json;
        console.log(event.data)
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
                this.text.innerHTML = 'Waiting for opponent';
                break;
            case 'start':
                this.seed = json.seed;
                this.inGame = true;
                this.text.innerHTML = `In lobby ${this.seed}`;
                console.log('starting', this.seed);
                break;
            case 'coords': {
                this.opponentPos = new Vector3(json.coords.pos.x, json.coords.pos.y, json.coords.pos.z);
                this.opponentRot = new Euler(json.coords.rot.x, json.coords.rot.y, json.coords.rot.z)
                break;
            }
            case 'otherDisconnect':
                this.inGame = false;
                this.text.innerHTML = 'Waiting for opponent';
                this.startGame();
            default:
                console.log('action not recognized:', json.action);
                break;
        }
    }
}

export default Online;
