/**
 * app.js
 *
 * This is the first file loaded. It sets up the Renderer,
 * Scene and Camera. It also starts the render loop and
 * handles window resizes.
 *
 */
import { WebGLRenderer, PerspectiveCamera, Vector3, OrthographicCamera, Camera } from 'three';
import { UnderwaterScene } from 'scenes';
import Controls from './components/Controls';
import Online from './components/online';
import HUD from './components/HUD';

// const IS_SHARK = true;//Math.random() < .5;

class CameraChanger {
    constructor (shark, fish, overhead) {
        this.shark = shark;
        this.fish = fish;
        this.overhead = overhead;
        this.active = shark;
    }

    toShark() {
        this.active = this.shark;
    }

    toFish() {
        this.active = this.fish;
    }

    toOverhead() {
        this.active = this.overhead;
    }

    forEach(callback) {
        callback(this.shark);
        callback(this.fish);
    }
}


// Initialize core ThreeJS components
const sharkCam = new PerspectiveCamera();
const fishCam = new PerspectiveCamera();
const overheadCam = new OrthographicCamera(-60, 60, 60, -60, 1, 100);
overheadCam.position.set(0, 35, 0);
overheadCam.lookAt(0,0,0);
const cc = new CameraChanger(sharkCam, fishCam, overheadCam);

const hud = new HUD();
const online = new Online(hud, cc);

const scene = new UnderwaterScene(cc, online, hud);
const renderer = new WebGLRenderer({ antialias: true });

// Set up camera
// camera.position.set(6, 3, -10);
// camera.lookAt(new Vector3(0, 0, 0));

// Set up renderer, canvas, and minor CSS adjustments
renderer.setPixelRatio(window.devicePixelRatio);
const canvas = renderer.domElement;
canvas.style.display = 'block'; // Removes padding below canvas
document.body.style.margin = 0; // Removes margin around page
document.body.style.overflow = 'hidden'; // Fix scrolling
document.body.appendChild(canvas);

// Set up controls
console.log(window.innerWidth, window.innerHeight)
const controls = new Controls(window.innerWidth, window.innerHeight);
console.log(controls.windowSize.x);


// Render loop
const onAnimationFrameHandler = (timeStamp) => {
    renderer.render(scene, cc.active);
    scene.update && scene.update(timeStamp);
    window.requestAnimationFrame(onAnimationFrameHandler);
};
console.log(controls.windowSize.x);
window.requestAnimationFrame(onAnimationFrameHandler);

// Resize Handler
const windowResizeHandler = () => {
    const { innerHeight, innerWidth } = window;
    renderer.setSize(innerWidth, innerHeight);
    cc.forEach(cam => cam.aspect = innerWidth / innerHeight);
    cc.forEach(cam => cam.updateProjectionMatrix());
    controls.setWH();
};
windowResizeHandler();
window.addEventListener('resize', windowResizeHandler, false);


