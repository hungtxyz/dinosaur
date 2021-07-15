import * as THREE from 'three';
import {FBXLoader} from 'three/examples/jsm/loaders/FBXLoader.js';

export class Player {
    private position_: THREE.Vector3;
    private velocity_: number;
    private playerBox_: THREE.Box3;
    private params_: any;
    private mesh_: any;
    private mixer_: THREE.AnimationMixer | undefined = undefined;
    private keys_: any;
    public gameOver: boolean = false;
    private model_path:string;


    constructor(params: any, model_path:string) {
        this.model_path = model_path;
        this.position_ = new THREE.Vector3(0, 0, 0);
        this.velocity_ = 0.0;

        this.playerBox_ = new THREE.Box3();
        this.params_ = params;
        this.keys_ = {
            space: false,
        }
        this.LoadModel_();
        this.InitInput_();
    }

    LoadModel_() {
        const loader = new FBXLoader();
        // loader.setPath('./resources/Dinosaurs/FBX/');
        console.log("model path:"+this.model_path);
        loader.load(this.model_path, (fbx) => {
            fbx.scale.setScalar(0.0017);
            fbx.quaternion.setFromAxisAngle(
                new THREE.Vector3(0, 1, 0), Math.PI / 2);

            this.mesh_ = fbx;
            this.params_.scene.add(this.mesh_);

            fbx.traverse(c => {
                let materials = (<any>c).material;
                if (!((<any>c).material instanceof Array)) {
                    materials = [(<any>c).material];
                }

                for (let m of materials) {
                    if (m) {
                        m.specular = new THREE.Color(0x000000);
                        m.color.offsetHSL(0, 0, 0.25);
                    }
                }
                c.castShadow = true;
                c.receiveShadow = true;
            });

            this.mixer_ = new THREE.AnimationMixer(fbx);

            for (let i = 0; i < fbx.animations.length; ++i) {
                console.log("animation: "+fbx.animations[i].name);
                if (fbx.animations[i].name.includes('Run')) {
                    const clip = fbx.animations[i];
                    const action = this.mixer_.clipAction(clip);
                    action.play();
                }
            }
        });
    }

    private InitInput_() {

        this.keys_ = {
            spacebar: false,
        };
        document.addEventListener('keydown', (e) => this.OnKeyDown_(e), false);
        document.addEventListener('keyup', (e) => this.OnKeyUp_(e), false);
    }

    CheckCollisions_() {
        const colliders = this.params_.world.GetColliders();

        this.playerBox_.setFromObject(this.mesh_);

        for (let c of colliders) {
            const cur = c.collider;

            if (cur.intersectsBox(this.playerBox_)) {
                this.gameOver = true;
            }
        }
    }

    Update(timeElapsed: number) {
        if (this.keys_.space && this.position_.y == 0.0) {
            this.velocity_ = 30;
        }

        const acceleration = -75 * timeElapsed;

        this.position_.y += timeElapsed * (
            this.velocity_ + acceleration * 0.5);
        this.position_.y = Math.max(this.position_.y, 0.0);

        this.velocity_ += acceleration;
        this.velocity_ = Math.max(this.velocity_, -100);


        if (this.mesh_) {
            this.mixer_?.update(timeElapsed);
            this.mesh_.position.copy(this.position_);
            this.CheckCollisions_();
        }
    }


    OnKeyDown_(event: KeyboardEvent) {
        switch (event.keyCode) {
            case 32:
                this.keys_.space = true;
                break;
        }
    }

    OnKeyUp_(event: KeyboardEvent) {
        switch (event.keyCode) {
            case 32:
                this.keys_.space = false;
                break;
        }
    }
}
