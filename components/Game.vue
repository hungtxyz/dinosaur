<template>
  <div id="game-container" class="row">
    <div class="col-2 pl-0 pr-0 shadow-sm">
      <SideBar v-on:onModelChange="onModelChange" />
    </div>
    <div class="col-10">
      <Playground ref="pg" />
    </div>
  </div>
</template>

<script>
import Playground from './Playground'
export default {
  name: 'Game.vue',
  components: { Playground },
  methods: {
    onModelChange(path){
      console.log("Parent got " + path);
      this.$refs.pg.changeModel(path)
    }
  }
}
</script>

<style scoped>

#game-container {
  height: 100vh;
  background: #ffffff;
  padding: 0;
  margin: 0;
}
</style>
