<template>
    <div id="game-container" class="row">
        <div class="col-2 pl-0 pr-0 shadow character-selection-wrapper" :class="play ? 'hide' : ''">
            <PrepareGame v-on:onModelChange="onModelChange"/>
            <div style="text-align: center; margin-top: 3rem;" ref="pg">
                <button type="button" class="btn btn-primary" v-on:click="play=true" id="btn" @click="startGame()">Play
                    game
                </button>
            </div>
        </div>
        <div class="col-10 pl-0 pr-0">
            <Playground ref="pg"/>
        </div>
        <div class="button-wrapper">
            <!--            <button type="button" class="btn"><i class="far fa-lightbulb"></i></button>-->
            <button type="button" class="btn"><i class="fas fa-cloud" @click="fog_remove"></i></button>
        </div>
    </div>
</template>

<script>
import Playground from './game/Playground'
import PrepareGame from './PrepareGame'
import {mapActions} from "vuex";

export default {
    name: 'Game.vue',
    created() {
        this.updateModelPath('/fbx/Triceratops.fbx');
    },
    data: () => {
        return {
            play: false,
            fog: false,
        }
    },
    components: {PrepareGame, Playground},
    methods: {
        ...mapActions({
            updateModelPath: 'updateModelPath'
        }),
        onModelChange(path) {
            console.log("Parent got " + path);
            this.updateModelPath(path);
            this.$refs.pg.changeModel(path)
        },
        startGame() {
            this.$router.push('/play');
            this.$refs.pg.hideControl();
        },
        fog_remove() {

            this.fog =  this.$refs.pg.removeFog(this.fog);
        }

    }
}
</script>

<style scoped>
.character-selection-wrapper {
    z-index: 1000;
    transition: margin-left ease .3s;
}

.button-wrapper {
    display: block;
    position: fixed;
    align-items: center;
    top: 2rem;
    left: 20rem;
    z-index: 999999;
}

.character-selection-wrapper.hide {
    margin-left: -50vw !important;
}

#game-container {
    height: 100vh;
    background: #ffffff;
    padding: 0;
    margin: 0;
}
</style>
