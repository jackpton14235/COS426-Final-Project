class Online {
    constructor() {
        this.socket = new WebSocket('ws://localhost:7777');
        this.seed = 0;

        socket.addEventListener('open', this.onopen);
        socket.addEventListener('message', this.onmessage);
    }

    onopen(event) {
        socket.send(
            JSON.stringify({
                action: 'create',
            })
        );
    }

    onmessage(event) {
        let json;
        try {
            json = JSON.parse(event.data);
        } catch {
            console.log('Bad JSON', event.data);
        }

        switch (json.action) {
            case 'wait':
                // display wait message
                console.log("Waiting for opponent");
                break;
            case 'start':
                this.seed = json.seed;
                break;
            default:
                console.log("action not recognized:", json.action)
        }
    }

}
