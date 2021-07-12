import * as THREE from "three";
import {IGameObject} from "~/core/interfaces/game-object-config";
import {GetOrDefault} from "~/core/utils";
import {MathUtils} from "~/core/math";

export abstract class GameObject {
    protected scene: THREE.Scene;
    protected position: THREE.Vector3;
    protected quaternion: THREE.Quaternion;
    protected scale: number;
    protected mesh: any;

    protected constructor(initValue: IGameObject) {
        this.scene = initValue.scene;
        this.position = GetOrDefault(new THREE.Vector3(), initValue?.position);
        this.quaternion = GetOrDefault(new THREE.Quaternion(), initValue?.quaternion);
        this.scale = GetOrDefault(1.0, initValue?.scale);
        this.mesh = null;
    }

    public abstract loadModel(): Promise<void>;

    public update(timeElapsed: number): void{
        if (!this.mesh) {
            return;
        }
        this.position.x -= timeElapsed * 10;
        if (this.position.x < -100) {
            this.position.x = MathUtils.randRange(2000, 3000);
        }

        this.mesh.position.copy(this.position);
        this.mesh.quaternion.copy(this.quaternion);
        this.mesh.scale.setScalar(this.scale);
    }
}

