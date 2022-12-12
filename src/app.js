/**
 * app.js
 *
 * This is the first file loaded. It sets up the Renderer,
 * Scene and Camera. It also starts the render loop and
 * handles window resizes.
 *
 */
import { WebGLRenderer, PerspectiveCamera, Vector3 } from 'three';
import { UnderwaterScene } from 'scenes';
import Controls from './components/Controls';
import Online from './components/online';

const IS_SHARK = false;//Math.random() < .5;

const online = new Online();

// Initialize core ThreeJS components
const camera = new PerspectiveCamera();
const scene = new UnderwaterScene(camera, IS_SHARK, online);
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
    renderer.render(scene, camera);
    scene.update && scene.update(timeStamp, IS_SHARK);
    window.requestAnimationFrame(onAnimationFrameHandler);
};
console.log(controls.windowSize.x);
window.requestAnimationFrame(onAnimationFrameHandler);

// Resize Handler
const windowResizeHandler = () => {
    const { innerHeight, innerWidth } = window;
    renderer.setSize(innerWidth, innerHeight);
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
    controls.setWH();
};
windowResizeHandler();
window.addEventListener('resize', windowResizeHandler, false);


