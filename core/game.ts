import * as THREE from 'three';
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {Player} from './player';
import {WorldManager} from './world';
import {Background} from './background';

const _VS = `
varying vec3 vWorldPosition;
void main() {
  vec4 worldPosition = modelMatrix * vec4( position, 1.0 );
  vWorldPosition = worldPosition.xyz;
  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`;


const _FS = `
uniform vec3 topColor;
uniform vec3 bottomColor;
uniform float offset;
uniform float exponent;
varying vec3 vWorldPosition;
void main() {
  float h = normalize( vWorldPosition + offset ).y;
  gl_FragColor = vec4( mix( bottomColor, topColor, max( pow( max( h , 0.0), exponent ), 0.0 ) ), 1.0 );
}`;


const _PCSS = `
#define LIGHT_WORLD_SIZE 0.05
#define LIGHT_FRUSTUM_WIDTH 3.75
#define LIGHT_SIZE_UV (LIGHT_WORLD_SIZE / LIGHT_FRUSTUM_WIDTH)
#define NEAR_PLANE 1.0

#define NUM_SAMPLES 17
#define NUM_RINGS 11
#define BLOCKER_SEARCH_NUM_SAMPLES NUM_SAMPLES
#define PCF_NUM_SAMPLES NUM_SAMPLES

vec2 poissonDisk[NUM_SAMPLES];

void initPoissonSamples( const in vec2 randomSeed ) {
  float ANGLE_STEP = PI2 * float( NUM_RINGS ) / float( NUM_SAMPLES );
  float INV_NUM_SAMPLES = 1.0 / float( NUM_SAMPLES );

  // jsfiddle that shows sample pattern: https://jsfiddle.net/a16ff1p7/
  float angle = rand( randomSeed ) * PI2;
  float radius = INV_NUM_SAMPLES;
  float radiusStep = radius;

  for( int i = 0; i < NUM_SAMPLES; i ++ ) {
    poissonDisk[i] = vec2( cos( angle ), sin( angle ) ) * pow( radius, 0.75 );
    radius += radiusStep;
    angle += ANGLE_STEP;
  }
}

float penumbraSize( const in float zReceiver, const in float zBlocker ) { // Parallel plane estimation
  return (zReceiver - zBlocker) / zBlocker;
}

float findBlocker( sampler2D shadowMap, const in vec2 uv, const in float zReceiver ) {
  // This uses similar triangles to compute what
  // area of the shadow map we should search
  float searchRadius = LIGHT_SIZE_UV * ( zReceiver - NEAR_PLANE ) / zReceiver;
  float blockerDepthSum = 0.0;
  int numBlockers = 0;

  for( int i = 0; i < BLOCKER_SEARCH_NUM_SAMPLES; i++ ) {
    float shadowMapDepth = unpackRGBAToDepth(texture2D(shadowMap, uv + poissonDisk[i] * searchRadius));
    if ( shadowMapDepth < zReceiver ) {
      blockerDepthSum += shadowMapDepth;
      numBlockers ++;
    }
  }

  if( numBlockers == 0 ) return -1.0;

  return blockerDepthSum / float( numBlockers );
}

float PCF_Filter(sampler2D shadowMap, vec2 uv, float zReceiver, float filterRadius ) {
  float sum = 0.0;
  for( int i = 0; i < PCF_NUM_SAMPLES; i ++ ) {
    float depth = unpackRGBAToDepth( texture2D( shadowMap, uv + poissonDisk[ i ] * filterRadius ) );
    if( zReceiver <= depth ) sum += 1.0;
  }
  for( int i = 0; i < PCF_NUM_SAMPLES; i ++ ) {
    float depth = unpackRGBAToDepth( texture2D( shadowMap, uv + -poissonDisk[ i ].yx * filterRadius ) );
    if( zReceiver <= depth ) sum += 1.0;
  }
  return sum / ( 2.0 * float( PCF_NUM_SAMPLES ) );
}

float PCSS ( sampler2D shadowMap, vec4 coords ) {
  vec2 uv = coords.xy;
  float zReceiver = coords.z; // Assumed to be eye-space z in this code

  initPoissonSamples( uv );
  // STEP 1: blocker search
  float avgBlockerDepth = findBlocker( shadowMap, uv, zReceiver );

  //There are no occluders so early out (this saves filtering)
  if( avgBlockerDepth == -1.0 ) return 1.0;

  // STEP 2: penumbra size
  float penumbraRatio = penumbraSize( zReceiver, avgBlockerDepth );
  float filterRadius = penumbraRatio * LIGHT_SIZE_UV * NEAR_PLANE / zReceiver;

  // STEP 3: filtering
  //return avgBlockerDepth;
  return PCF_Filter( shadowMap, uv, zReceiver, filterRadius );
}
`;

const _PCSSGetShadow = `
return PCSS( shadowMap, shadowCoord );
`;


export class GameWorld {
    private threejs_: THREE.WebGLRenderer;
    private camera_: THREE.PerspectiveCamera;
    private scene_: THREE.Scene;
    private previousRAF_: number | undefined = undefined;
    public gameOver_: Boolean = false;

    private background: Background;
    private world: WorldManager;
    private player: Player;
    private model_path: string;
    private controls: OrbitControls;

    constructor(model_path: string) {

        this.model_path = model_path;
        // overwrite shadowmap code
        let shadowCode = THREE.ShaderChunk.shadowmap_pars_fragment;

        shadowCode = shadowCode.replace(
            '#ifdef USE_SHADOWMAP',
            '#ifdef USE_SHADOWMAP' +
            _PCSS
        );

        shadowCode = shadowCode.replace(
            '#if defined( SHADOWMAP_TYPE_PCF )',
            _PCSSGetShadow +
            '#if defined( SHADOWMAP_TYPE_PCF )'
        );
        THREE.ShaderChunk.shadowmap_pars_fragment = shadowCode;


        // renderer
        this.threejs_ = new THREE.WebGLRenderer({
            antialias: true,
        });
        this.threejs_.outputEncoding = THREE.sRGBEncoding;
        this.threejs_.gammaFactor = 2.2;
        this.threejs_.shadowMap.enabled = true;
        this.threejs_.setPixelRatio(window.devicePixelRatio);
        this.threejs_.setSize(window.innerWidth, window.innerHeight);


        const fov = 60;
        const aspect = 1920 / 1080;
        const near = 1.0;
        const far = 20000.0;
        this.camera_ = new THREE.PerspectiveCamera(fov, aspect, near, far);
        this.camera_.position.set(-5, 5, 10);
        this.camera_.lookAt(8, 3, 0);

        this.scene_ = new THREE.Scene();

        let light = new THREE.DirectionalLight(0xFFFFFF, 1.0);
        light.position.set(60, 100, 10);
        light.target.position.set(40, 0, 0);
        light.castShadow = true;
        light.shadow.bias = -0.001;
        light.shadow.mapSize.width = 4096;
        light.shadow.mapSize.height = 4096;
        light.shadow.camera.far = 200.0;
        light.shadow.camera.near = 1.0;
        light.shadow.camera.left = 50;
        light.shadow.camera.right = -50;
        light.shadow.camera.top = 50;
        light.shadow.camera.bottom = -50;
        this.scene_.add(light);

        let hemi_light = new THREE.HemisphereLight(0x202020, 0x004080, 0.6);
        this.scene_.add(hemi_light);
        this.scene_.background = new THREE.Color(0x808080);
        this.scene_.fog = new THREE.FogExp2(0x89b2eb, 0.00125);

        const ground = new THREE.Mesh(
            new THREE.PlaneGeometry(20000, 20000, 10, 10),
            new THREE.MeshStandardMaterial({
                color: 0xf6f47f,
            }));
        ground.castShadow = false;
        ground.receiveShadow = true;
        ground.rotation.x = -Math.PI / 2;
        this.scene_.add(ground);

        const uniforms = {
            topColor: {value: new THREE.Color(0x0077FF)},
            bottomColor: {value: new THREE.Color(0x89b2eb)},
            offset: {value: 33},
            exponent: {value: 0.6}
        };
        const skyGeo = new THREE.SphereBufferGeometry(1000, 32, 15);
        const skyMat = new THREE.ShaderMaterial({
            uniforms: uniforms,
            vertexShader: _VS,
            fragmentShader: _FS,
            side: THREE.BackSide,
        });
        this.scene_.add(new THREE.Mesh(skyGeo, skyMat));
        this.controls = new OrbitControls(this.camera_, this.threejs_.domElement);

        // TODO: add dinosaur, background, world
        this.background = new Background(this.scene_);
        this.world = new WorldManager({scene: this.scene_});
        this.player = new Player({scene: this.scene_, world: this.world}, this.model_path)
    }


    public resizeWindow() {
        this.camera_.aspect = window.innerWidth / window.innerHeight;
        this.camera_.updateProjectionMatrix();
        this.threejs_.setSize(window.innerWidth, window.innerHeight);
    }

    public async spawnBackground() {
        await this.background.spawn();
    }

    public start() {
        this.controls.update();
        requestAnimationFrame((t) => {
            if (this.previousRAF_ === undefined) {
                this.previousRAF_ = t;
            }
            this.start();

            // this.Step_((t - this.previousRAF_) / 1000.0);
            this.update((t - this.previousRAF_) / 1000.0)
            this.threejs_.render(this.scene_, this.camera_);
            this.previousRAF_ = t;
        });

    }

    //TODO: ADD update function
    public update(timeElapsed: number) {
        if (this.gameOver_) {
            return;
        }

        this.player.Update(timeElapsed);
        this.world.Update(timeElapsed);
        this.background.update(timeElapsed);

        if (this.player.gameOver && !this.gameOver_) {
            this.gameOver_ = true;
            let screen = document.getElementById('screen');
            let html =  "<div class='ui'><div class='game-over-layout' id='game-over'><div class='game-over-text'>GAME OVER <br>CLICK TO PLAY A NEW GAME</div></div></div>" ;
            const div = document.createElement('div');
            div.innerHTML = html.trim();
            if (screen && div.firstChild)
                screen.appendChild(div.firstChild);
            window.addEventListener('click', function (){
                window.location.href = '/'
            })
        }
    }

    public getWorldContainer() {
        return this.threejs_.domElement;

    }

}
