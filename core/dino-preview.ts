import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import {FBXLoader} from 'three/examples/jsm/loaders/FBXLoader';
import {Camera, Object3D, SpotLight} from 'three';
// @ts-ignore
import {GUI} from 'three/examples/jsm/libs/dat.gui.module';


export type Optional<T> = undefined | T;


export class DinoPreview {
    private render: Optional<THREE.WebGLRenderer> = undefined;
    private scene: Optional<THREE.Scene> = undefined;
    private camera: Optional<THREE.Camera> = undefined;
    private loader: Optional<FBXLoader> = undefined;
    private mixer: Optional<THREE.AnimationMixer> = undefined;
    private readonly gameObjects: any[];
    private isPlaying = false;
    private clock: Optional<THREE.Clock> = undefined;
    private cameraFolder: Optional<GUI> = undefined;
    private lightFolder: Optional<GUI> = undefined;

    constructor() {
        this.setup();
        this.loader = new FBXLoader();
        this.gameObjects = [];
        this.clock = new THREE.Clock();
    }

    private setup() {

        const scene = new THREE.Scene();

        const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 2000);
        camera.position.set(100, 200, 500);

        scene.background = new THREE.Color(0xa0a0a0);
        scene.fog = new THREE.Fog(0xa0a0a0, 500, 1200);

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

        const grid = new THREE.GridHelper(2000, 20, 0xDF5E5E, 0xDF5E5E);

        (<any>grid.material).opacity = 0.2;
        (<any>grid.material).transparent = true;

        scene.add(grid);

        const renderer = new THREE.WebGLRenderer({antialias: true});
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight - 100);
        renderer.shadowMap.enabled = true;

        const gui = new GUI();
        this.cameraFolder = gui.addFolder("Camera");
        this.cameraFolder.add(camera.position, 'x', -400, 800);
        this.cameraFolder.add(camera.position, 'y', 0, 300);
        this.cameraFolder.add(camera.position, 'z', -500, 1000);
        this.cameraFolder.open();
        // cameraFolder.hide();
        this.lightFolder = gui.addFolder("Direct Light");
        this.lightFolder.add(dirLight, 'intensity', 0, 10);
        this.lightFolder.add(dirLight.position, 'x', -5, 15);
        this.lightFolder.add(dirLight.position, 'y', 0, 400);
        this.lightFolder.add(dirLight.position, 'z', 0, 300);
        const setColor = {color: 0xffffff};
        this.lightFolder.addColor(setColor, 'color').onChange(() => {
            dirLight.color.set(setColor.color);
        });
        this.lightFolder.open();
        // lightFolder.hide();
        // gui.remove();
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.target.set(0, 0, 0);
        controls.update();

        this.camera = camera;
        this.scene = scene;
        this.render = renderer;
    }

    public loadModel(modelPath: string, scale: number) {
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

    public getWorldContainer() {
        const container = document.createElement('div');
        container.appendChild(<any>this.render?.domElement);
        return container;
    }

    public clearObjects() {
        for (const name of this.gameObjects) {
            const object = this.scene?.getObjectByName(name);
            if (object)
                this.scene?.remove(object);
        }
    }

    public play() {
        this.isPlaying = true;
        this.animate();
    }

    public pause() {
        this.isPlaying = false;
    }

    public updateViewport(w: number, h: number) {
        (<any>this.camera).aspect = w / h;
        (<any>this.camera)?.updateProjectionMatrix();
        this.render?.setSize(w, h);
    }

    private animate() {
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

    public hideControl() {
        this.cameraFolder?.hide();
        this.lightFolder?.hide();
    }

    public removeF(k:boolean) {
        if (this.scene)
        {
            if (k)
                this.scene.fog = new THREE.Fog(0xa0a0a0, 500, 1200);
            else
                this.scene.fog = null;
        }
        return !k;
    }
}
