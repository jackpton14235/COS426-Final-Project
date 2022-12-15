

class HUD {
    constructor() {
        const body = document.querySelector('body');

        this.hud = document.createElement('div');
        this.hud.id = 'hud';
        this.hud.style = 'position:absolute;width:100%;height:100%;display:flex;flex-direction:column;justify-content:space-around;align-items:center;';
        body.appendChild(this.hud);


        this.mainText = document.createElement('h1');
        this.mainText.style = 'color:yellow;font-size:3rem;'
        this.mainBar = document.createElement('div');
        this.mainBar.style='background-color:#333;width:100%;height:5rem;display:flex;justify-content:center;align-items:center;'
        this.mainBar.appendChild(this.mainText);
        // spaces out main bar
        const blank = document.createElement('div');
        this.mainBar.style.visibility = 'hidden';
        this.hud.appendChild(this.mainBar);
        this.hud.appendChild(blank);

        this.onlineStatus = document.createElement('h2');
        this.onlineStatus.innerHTML = "Connecting...";
        this.onlineStatus.style = 'position:absolute;bottom:0;right:1rem;'
        this.hud.appendChild(this.onlineStatus);

        this.musicSelection = document.createElement('input');
        this.musicSelection.type = 'checkbox';
        this.musicSelection.name = 'Music?';
        this.musicSelection.id = 'Music?';
        this.musicLabel = document.createElement('label');
        this.musicLabel.appendChild(this.musicSelection);
        this.musicLabel.innerHTML = 'Music & Sound Effects?';
        this.musicLabel.for = 'Music?'
        this.musicLabel.style = 'position:absolute;top:1rem;right:3rem;'
        this.musicSelection.style = 'position:absolute;top:1rem;right:1rem;'
        this.hud.appendChild(this.musicSelection);
        this.hud.appendChild(this.musicLabel);
      
        
        this.musicStatus

        this.scoreCount = 0;
        this.score = document.createElement('h3');
        this.score.innerHTML = 0;
        this.score.style = 'position:absolute;top:0;font-size:5rem;';
        this.hud.appendChild(this.score);

        this.isShark = false;
        
    }

    getMusicStatus() {
        return this.musicSelection.checked;
    }

    setSharkStatus(b) {
        console.log("Shark", b)
        this.score.style.visibility = b ? 'hidden' : 'visible';
        this.isShark = b;
    }

    setMainText(s) {
        this.mainBar.style.visibility = s ? 'visible' : 'hidden';
        this.mainText.innerHTML = s;
    }

    setOnlineStatus(s) {
        this.onlineStatus.innerHTML = s;
    }

    incrementScore() {
        if (!this.score) return;
        this.score.innerHTML = ++this.scoreCount;
    }

}

export default HUD;