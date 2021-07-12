import {GameObject} from "~/core/game-object";
import {MathUtils} from "~/core/math";
import * as THREE from "three";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import {GLTF_PACK, TEX_PACK} from "~/core/constants";
import {IGameObject} from "~/core/interfaces/game-object-config";

export class CrapObject extends GameObject{
    constructor(initValue: IGameObject) {
        super(initValue);
    }

    public async loadModel(): Promise<void> {
        const assets = [
            [GLTF_PACK.SMALL_PALM_TREE, TEX_PACK.PALM_TREE, 3],
            [GLTF_PACK.BIG_PALM_TREE, TEX_PACK.PALM_TREE, 5],
            [GLTF_PACK.SKULL, TEX_PACK.GROUND, 1],
            [GLTF_PACK.PYRAMID, TEX_PACK.GROUND, 40],
            [GLTF_PACK.MONUMENT, TEX_PACK.GROUND, 10],
            [GLTF_PACK.CACTUS_1, TEX_PACK.GROUND, 5],
            [GLTF_PACK.CACTUS_2, TEX_PACK.GROUND, 5],
            [GLTF_PACK.CACTUS_3, TEX_PACK.GROUND, 5],
        ];

        const index = MathUtils.randInt(0, assets.length - 1);
        // const [asset, textureName, scale] = assets[MathUtils.randInt(0, assets.length - 1)];
        const asset = <string>assets[index][0]
        const tex = assets[index][1]
        const scale = assets[index][2]

        const texLoader = new THREE.TextureLoader();
        const texture = texLoader.load(<string>tex);
        texture.encoding = THREE.sRGBEncoding;

        const loader = new GLTFLoader();
        const glb = await loader.loadAsync(asset)

        this.mesh = glb.scene;
        this.scene.add(this.mesh);

        this.position.x = MathUtils.randRange(0, 2000);
        this.position.z = MathUtils.randRange(500, -1000);
        this.scale = <number>scale;

        const q = new THREE.Quaternion().setFromAxisAngle(
            new THREE.Vector3(0, 1, 0), MathUtils.randRange(0, 360));
        this.quaternion.copy(q);

        this.mesh.traverse((c: any) => {
            let materials = c.material;
            if (!(c.material instanceof Array)) {
                materials = [c.material];
            }
            for (let m of materials) {
                if (m) {
                    if (texture) {
                        m.map = texture;
                    }
                    m.specular = new THREE.Color(0x000000);
                }
            }
            c.castShadow = true;
            c.receiveShadow = true;
        });
    }
}
