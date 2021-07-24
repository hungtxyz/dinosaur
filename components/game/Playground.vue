<template>
    <div id="world"></div>
</template>

<script>
import {DinoPreview} from '../../core/dino-preview'

export default {
    name: 'Playground',
    created() {
        this.playground = new DinoPreview()
    },
    methods: {
        initWorld() {
            const world = this.playground.getWorldContainer()
            document.getElementById('world').appendChild(world)
            this.updateViewPort()
            this.playground.play()

        },
        updateViewPort() {
            console.log('Resize')
            const w = $('#world').width()
            this.playground.updateViewport(w, window.innerHeight)
        },
        changeModel(path, animation) {
            (async () => {
                this.playground.clearObjects()
                await this.playground.loadModel(path, 0.08, animation)
            })()
        },

        hideControl(){
            this.playground.hideControl();

        },
        removeFog(k){
            return this.playground.removeF(k);
        }

    },
    async mounted() {
        await this.playground.loadModel('/fbx/Triceratops.fbx', 0.08, 'Jump')
        this.initWorld()
        window.addEventListener('resize', this.updateViewPort)

    }
}
</script>

<style scoped>
#world {
    width: 100%;
}
</style>
