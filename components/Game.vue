<template>
  <div id="game-container" class="row">
    <div class="col-6 pl-0 pr-0 shadow character-selection-wrapper" :class="play ? 'hide' : ''">
      <PrepareGame v-on:onModelChange="onModelChange" />
      <div>
        <button type="button" class="btn btn-primary" v-on:click="play=true">Play</button>
      </div>
    </div>
    <div class="col-6 pl-0 pr-0">
      <Playground ref="pg" />
    </div>
  </div>
</template>

<script>
import Playground from './game/Playground'
import PrepareGame from './PrepareGame'
export default {
  name: 'Game.vue',
  data: ()=>{
    return {
      play: false
    }
  },
  components: { PrepareGame, Playground },
  methods: {
    onModelChange(path){
      console.log("Parent got " + path);
      this.$refs.pg.changeModel(path)
    }
  }
}
</script>

<style scoped>
.character-selection-wrapper{
  z-index: 1000;
  transition: margin-left ease .3s;
}
.character-selection-wrapper.hide{
  margin-left: -50vw!important;
}
#game-container {
  height: 100vh;
  background: #ffffff;
  padding: 0;
  margin: 0;
}
</style>
