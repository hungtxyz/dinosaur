import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { Camera, Object3D } from 'three';

export type Optional<T> = undefined | T;

export class Playground {
    private render: Optional<THREE.WebGLRenderer> = undefined;
    private scene: Optional<THREE.Scene> = undefined;
    private camera: Optional<THREE.Camera> = undefined;
    private loader: Optional<FBXLoader> = undefined;
    private mixer: Optional<THREE.AnimationMixer> = undefined;
    private readonly gameObjects: any[];
    private isPlaying = false;
    private clock: Optional<THREE.Clock> = undefined;

    constructor () {
        this.setup();
        this.loader = new FBXLoader();
        this.gameObjects = [];
        this.clock = new THREE.Clock();
    }

    private setup () {
        const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 2000);
        camera.position.set(100, 200, 500);

        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0xa0a0a0);
        scene.fog = new THREE.Fog(0xa0a0a0, 200, 1000);

        const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444);
        hemiLight.position.set(0, 200, 0);
        scene.add(hemiLight);

        const dirLight = new THREE.DirectionalLight(0xffffff);
        dirLight.position.set(0, 200, 100);
        dirLight.castShadow = true;
        dirLight.shadow.camera.top = 180;
        dirLight.shadow.camera.bottom = -100;
        dirLight.shadow.camera.left = -120;
        dirLight.shadow.camera.right = 120;
        scene.add(dirLight);

        // ground
        const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2000, 2000), new THREE.MeshPhongMaterial({
            color: 0x999999,
            depthWrite: false
        }));

        mesh.rotation.x = -Math.PI / 2;
        mesh.receiveShadow = true;
        scene.add(mesh);

        const grid = new THREE.GridHelper(2000, 20, 0x000000, 0x000000);

        (<any>grid.material).opacity = 0.2;
        (<any>grid.material).transparent = true;

        scene.add(grid);

        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight - 100);
        renderer.shadowMap.enabled = true;

        const controls = new OrbitControls(camera, renderer.domElement);
        controls.target.set(0, 0, 0);
        controls.update();

        this.camera = camera;
        this.scene = scene;
        this.render = renderer;
    }

    public loadModel (modelPath: string, scale: number) {
        return new Promise<void>((resolve) => {
            this.loader?.load(modelPath, (object) => {
                object.name = modelPath;
                object.scale.multiplyScalar(scale);
                const mixer = new THREE.AnimationMixer(object);
                const action = mixer.clipAction(object.animations[0]);
                action.play();
                object.traverse(function (child) {
                    if ((<any>child).isMesh) {
                        child.castShadow = true;
                        child.receiveShadow = true;
                    }
                });
                this.mixer = mixer;
                this.scene?.add(object);
                this.gameObjects.push(modelPath);
                resolve();
            });
        });
    }

    public getWorldContainer () {
        const container = document.createElement('div');
        container.appendChild(<any>this.render?.domElement);
        return container;
    }

    public clearObjects () {
        for (const name of this.gameObjects) {
            const object = this.scene?.getObjectByName(name);
            if(object)
                this.scene?.remove(object);
        }
    }

    public play () {
        this.isPlaying = true;
        this.animate();
    }

    public pause () {
        this.isPlaying = false;
    }

    public updateViewport (w: number, h: number) {
        (<any>this.camera).aspect = w / h;
        (<any>this.camera)?.updateProjectionMatrix();
        this.render?.setSize(w, h);
    }

    private animate () {
        if (!this.isPlaying) {
            return;
        }
        const delta = this.clock?.getDelta();
        if (typeof delta === 'number') {
            this.mixer?.update(delta);
        }
        this.render?.render(<Object3D>this.scene, <Camera>this.camera);
        requestAnimationFrame(() => {
            this.animate();
        });
    }
}
