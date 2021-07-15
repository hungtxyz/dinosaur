<template>
  <div class="sidebar">
    <h3 class="header">Final Project</h3>
    <hr>
    <div>
      <div class="choose-title">Select model</div>
      <select v-on:change="onModelChange($event)" class="form-control">
        <template v-for="model in models">
          <option :value="model.path">{{ model.name }}</option>
        </template>
      </select>
      <div class="choose-title">Background Color</div>
      <input type="color" value="#ffffff" class="form-control" />
      <div class="choose-title">Music</div>
        <select v-on:change="onTrackChange($event)" class="form-control">
          <template v-for="track in tracks">
            <option :value="track.path" >{{ track.name }}</option>
          </template>
        </select>
    </div>
  </div>
</template>
<script>
import { ModelList, SOUND_TRACK } from '../core/constants'

export default {
  name: 'PrepareGame',
  methods:{
    onModelChange(event){
      const modelPath = event.target.value;
      this.$emit("onModelChange", modelPath);
    },
    onTrackChange(event){
      const trackPath = event.target.value;
      console.log(trackPath);
    }
  },
  created () {
    this.models = ModelList
    this.tracks = SOUND_TRACK
  }
}
</script>

<style scoped>
  hr {
    margin-top: 0; 
    width: 80%;
    border-style: none;
    border-top-style: dotted;
    border-color: grey;
  }

  .header {
    padding: 1rem 0rem; 
    color: #125D98;
    text-align: center;
  }

  .choose-title {
    color: #3C8DAD;
    text-align: center;
    padding: 0.5rem 1rem;
  }

  .sidebar {
    background-color: #f1f1f1;
  }
</style>
