<template>
  <div id="world"></div>
</template>

<script>
import { GameWorld } from '../../core/game-world'

export default {
  name: 'Playground',
  created () {
    this.playground = new GameWorld()
  },
  methods: {
    initWorld () {
      const world = this.playground.getWorldContainer()
      document.getElementById('world').appendChild(world)
      this.updateViewPort()
      this.playground.play()
    },
    updateViewPort () {
      console.log('Resize')
      const w = $('#world').width()
      this.playground.updateViewport(w, window.innerHeight)
    },
    changeModel (path) {
      (async () => {
        this.playground.clearObjects()
        await this.playground.loadModel(path, 0.08)
      })()
    }
  },
  async mounted () {
    await this.playground.loadModel('/fbx/Apatosaurus.fbx', 0.08)
    this.initWorld()
    window.addEventListener('resize', this.updateViewPort)
  }
}
</script>

<style scoped>
#world{
  width: 100%;
}
</style>
