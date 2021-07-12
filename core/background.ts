import * as THREE from 'three';
import {CloudObject} from "~/core/objects/cloud.object";
import {CrapObject} from "~/core/objects/crap.object";

export class Background {
    private readonly scene: THREE.Scene;
    private readonly clouds: CloudObject[];
    private readonly craps: CrapObject[];

    constructor(scene: THREE.Scene) {
        this.scene = scene;
        this.clouds = [];
        this.craps = [];

        this.initClouds();
        this.initCraps();
    }

    private initClouds() {
        for (let i = 0; i < 25; ++i) {
            const cloud = new CloudObject({scene: this.scene});
            this.clouds.push(cloud);
        }
    }

    private initCraps() {
        for (let i = 0; i < 50; ++i) {
            const crap = new CrapObject({scene: this.scene});
            this.craps.push(crap);
        }
    }

    public async spawn() {
        const promises = [];
        for (const cloud of this.clouds) {
            promises.push(cloud.loadModel())
        }
        for (const crap of this.craps) {
            promises.push(crap.loadModel())
        }
        await Promise.all(promises)
    }

    public update(timeElapsed: number) {
        for (let c of this.clouds) {
            c.update(timeElapsed);
        }
        for (let c of this.craps) {
            c.update(timeElapsed);
        }
    }
}


