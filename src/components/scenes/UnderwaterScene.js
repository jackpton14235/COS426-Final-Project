import * as Dat from 'dat.gui';
import {
    Scene,
    Color,
    PlaneGeometry,
    Material,
    Mesh,
    FrontSide,
    BoxGeometry,
    MeshBasicMaterial,
    Vector3,
    ShaderMaterial,
    TextureLoader,
    NearestFilter,
    RepeatWrapping,
    Fog,
} from 'three';
import { Flower, Land, Shark, Fish } from 'objects';
import { BasicLights } from 'lights';
import { School } from '../objects/School';
import Container from '../objects/Fish/Container';
import SharkContainer from '../objects/Shark/SharkContainer';

const FOG_COLOR = 0x0083bf;

const tileShader = `
    #include <common>
    
    uniform vec3 iResolution;
    uniform float iTime;
    uniform sampler2D iChannel0;
    void mainImage( out vec4 fragColor, in vec2 fragCoord )
    {
        // Normalized pixel coordinates (from 0 to 1)
        vec2 uv = fragCoord;

        if (mod(floor(float(fragCoord.x) / .02) + floor(float(fragCoord.y) / .02), 2.) < 1.){  
            fragColor = vec4(1.,1.,1.,1.0);
        } else {
            fragColor = vec4(0.,0.,0.,0.);
        }
    }

    varying vec2 vUv;

    void main() {
        mainImage(gl_FragColor, vUv * iResolution.xy);
    }
`;


const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
  }
`;


const sandShader = `
    #include <common>
    
    uniform vec3 iResolution;
    uniform float iTime;
    uniform sampler2D iChannel0;
    uniform vec3 fogColor;
    uniform float fogNear;
    uniform float fogFar;
    
    // from https://www.shadertoy.com/view/MtcGRl, by LukeRissacher
    vec2 GetGradient(vec2 intPos, float t) {
        
        // Uncomment for calculated rand
        float rand = fract(sin(dot(intPos, vec2(12.9898, 78.233))) * 43758.5453);;
        
        // Texture-based rand (a bit faster on my GPU)
        //float rand = texture(iChannel0, intPos / 64.0).r;
        
        // Rotate gradient: random starting rotation, random rotation rate
        float angle = 6.283185 * rand + 4.0 * t * rand;
        return vec2(cos(angle), sin(angle));
    }
    
    // from https://www.shadertoy.com/view/MtcGRl, by LukeRissacher
    float Pseudo3dNoise(vec3 pos) {
        vec2 i = floor(pos.xy);
        vec2 f = pos.xy - i;
        vec2 blend = f * f * (3.0 - 2.0 * f);
        float noiseVal = 
            mix(
                mix(
                    dot(GetGradient(i + vec2(0, 0), pos.z), f - vec2(0, 0)),
                    dot(GetGradient(i + vec2(1, 0), pos.z), f - vec2(1, 0)),
                    blend.x),
                mix(
                    dot(GetGradient(i + vec2(0, 1), pos.z), f - vec2(0, 1)),
                    dot(GetGradient(i + vec2(1, 1), pos.z), f - vec2(1, 1)),
                    blend.x),
            blend.y
        );
        return noiseVal / 0.7; // normalize to about [-1..1]
    }

    void mainImage( out vec4 fragColor, in vec2 fragCoord )
    {
        vec2 uv = fragCoord/iResolution.xy;
        vec4 tex = texture2D(iChannel0, uv / .01);
        float depth = gl_FragCoord.z / gl_FragCoord.w;
        float fogFactor = smoothstep( fogNear, fogFar, depth );
        float noise = .2 * Pseudo3dNoise(vec3(uv/.0007, iTime));
        fragColor = tex + noise;
        // add fog
        fragColor.rgb = mix( fragColor.rgb, fogColor, fogFactor );
    }

    varying vec2 vUv;
    void main() {
        mainImage(gl_FragColor, vUv * iResolution.xy);
    }

`;

function OceanFloor(uniforms) {
    const geometry = new PlaneGeometry(1000, 1000);
    const material = new ShaderMaterial({
        vertexShader,
        fragmentShader: sandShader,
        uniforms,
        // fog: true
    });
    const floor = new Mesh(geometry, material);
    floor.rotateX(-Math.PI / 2);
    return floor;
}

function Cube() {
    const geometry = new BoxGeometry(1, 1, 1);
    const material = new MeshBasicMaterial({ color: d });
    const cube = new Mesh(geometry, material);
    cube.position.y = 0.5;
    return cube;
}

class UnderwaterScene extends Scene {
    constructor(camera, isShark) {
        // Call parent Scene() constructor
        super();

        const loader = new TextureLoader();
        const sandTexture = loader.load('./src/components/scenes/sand.jpg');
        sandTexture.minFilter = NearestFilter;
        sandTexture.magFilter = NearestFilter;
        sandTexture.wrapS = RepeatWrapping;
        sandTexture.wrapT = RepeatWrapping;
        this.fog = new Fog(FOG_COLOR, 10, 100);

        // Init state
        this.state = {
            gui: new Dat.GUI(), // Create GUI for scene
            updateList: [],
            uniforms: {
                iTime: { value: 0 },
                iResolution: { value: new Vector3(1, 1, 1) },
                iChannel0: { value: sandTexture },
                fogColor: {
                    type: 'c',
                    value: this.fog.color,
                },
                fogNear: {
                    type: 'f',
                    value: this.fog.near,
                },
                fogFar: {
                    type: 'f',
                    value: this.fog.far,
                },
            },
        };

        // Set background to a nice color
        this.background = new Color(FOG_COLOR);

        // Add meshes to scene
        const oceanFloor = OceanFloor(this.state.uniforms);
        const lights = new BasicLights();
        const shark = new SharkContainer(this, isShark && camera);
        shark.position.y = 10;
        const fish = new Container(this, !isShark && camera);
        fish.position.y = 10;
        const school = new School(
            this,
            new BoxGeometry(0.4, 0.4, 0.4),
            new MeshBasicMaterial({ color: 0x663377 })
        );
        const flower = new Flower(this);
        this.add(oceanFloor, shark, fish, lights, school, flower);
        
    }

    addToUpdateList(object) {
        this.state.updateList.push(object);
    }

    update(timeStamp, isShark) {
        const { updateList } = this.state;
        this.state.uniforms.iTime.value = 1.5 * timeStamp / 1000;
        // console.log(this.state.uniforms.iTime)
        // Call update for each object in the updateList
        for (const obj of updateList) {
            obj.update(timeStamp, isShark);
        }
    }
}

export default UnderwaterScene;
