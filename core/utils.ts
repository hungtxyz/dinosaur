import {GLTF, GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import {MathUtils} from "~/core/math";
import * as THREE from "three";

export const HasValue = (v: any): boolean => {
    return v !== undefined && v !== null;
}

export const GetOrDefault = <T>(defaultValue: T, value?: T) : T => {
    if(HasValue(value))
        return <T>value;
    return defaultValue;
}
