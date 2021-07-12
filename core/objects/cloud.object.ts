import * as THREE from 'three';
import {GameObject} from "~/core/game-object";
import {IGameObject} from "~/core/interfaces/game-object-config";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import {MathUtils} from "~/core/math";
import {GLTF_PACK} from "~/core/constants";

export class CloudObject extends GameObject {
    constructor(initValue: IGameObject) {
        super(initValue);
    }

    public async loadModel(): Promise<void> {
        const clouds = [GLTF_PACK.CLOUD_1, GLTF_PACK.CLOUD_2, GLTF_PACK.CLOUD_3]
        const cloudPath = clouds[MathUtils.randInt(0, 2)];

        const loader = new GLTFLoader();
        const model = await loader.loadAsync(cloudPath);

        this.mesh = model.scene;
        this.scene.add(this.mesh);
        this.position.x = MathUtils.randRange(0, 2000);
        this.position.y = MathUtils.randRange(100, 200);
        this.position.z = MathUtils.randRange(500, -1000);
        this.scale = MathUtils.randRange(10, 20);

        const q = new THREE.Quaternion().setFromAxisAngle(
            new THREE.Vector3(0, 1, 0), MathUtils.randRange(0, 360)
        );
        this.quaternion.copy(q);

        this.mesh.traverse((c: any) => {
            if (c.geometry) {
                c.geometry.computeBoundingBox();
            }

            let materials = c.material;
            if (!(c.material instanceof Array)) {
                materials = [c.material];
            }
            for (let m of materials) {
                if (m) {
                    m.specular = new THREE.Color(0x000000);
                    m.emissive = new THREE.Color(0xC0C0C0);
                }
            }
            c.castShadow = true;
            c.receiveShadow = true;
        });
    }
}
