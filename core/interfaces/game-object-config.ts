import * as THREE from "three";

export interface IGameObject {
    scene: THREE.Scene;
    position?: THREE.Vector3;
    quaternion?: THREE.Quaternion;
    scale?: number;
    mesh?: any;
}
