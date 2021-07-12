<template>
    <div id="screen">
        <div id="container">
        </div>
    </div>
</template>

<script>
import {GameWorld} from "../core/game";
import {mapGetters} from "vuex";


export default {

    name: "GamePlay",


    computed: {
        ...mapGetters({
            modelPath: 'getModelPath'
        })
    },
    async mounted() {
        console.log(this.modelPath);

        this.gameWorld = new GameWorld(this.modelPath, );
        await this.gameWorld.spawnBackground();
        let worldDOM = this.gameWorld.getWorldContainer();
        document.getElementById('container').appendChild(worldDOM);
        this.gameWorld.start();
    },



}
</script>

<style scoped>


</style>
