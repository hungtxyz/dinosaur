import {IModel} from '~/core/interfaces/model.interface';

export const ModelList: IModel[] = [
    {
        name: 'Triceratops',
        path: '/fbx/Triceratops.fbx'
    },

    {
        name: 'Velociraptor',
        path: '/fbx/Velociraptor.fbx'
    },
    {
        name: 'Parasaurolophus',
        path: '/fbx/Parasaurolophus.fbx'
    },
    {
        name: 'Trex',
        path: '/fbx/Trex.fbx'
    },
    {
        name: 'Stegosaurus',
        path: '/fbx/Stegosaurus.fbx'
    },


    {
        name: 'Apatosaurus',
        path: '/fbx/Apatosaurus.fbx'
    },
];

export enum GLTF_PACK {
    CLOUD_1 = "/resources/Clouds/GLTF/Cloud1.glb",
    CLOUD_2 = "/resources/Clouds/GLTF/Cloud2.glb",
    CLOUD_3 = "/resources/Clouds/GLTF/Cloud3.glb",
    SMALL_PALM_TREE = "/resources/DesertPack/GLTF/SmallPalmTree.glb",
    BIG_PALM_TREE = "/resources/DesertPack/GLTF/BigPalmTree.glb",
    SKULL = "/resources/DesertPack/GLTF/Skull.glb",
    PYRAMID = "/resources/DesertPack/GLTF/Pyramid.glb",
    MONUMENT = "/resources/DesertPack/GLTF/Monument.glb",
    CACTUS_1 = "/resources/DesertPack/GLTF/Cactus1.glb",
    CACTUS_2 = "/resources/DesertPack/GLTF/Cactus2.glb",
    CACTUS_3 = "/resources/DesertPack/GLTF/Cactus3.glb",
}

export enum TEX_PACK {
    PALM_TREE = "/resources/DesertPack/Blend/Textures/PalmTree.png",
    GROUND = "/resources/DesertPack/Blend/Textures/Ground.glb",
}
