<template>
  <div class="sidebar">
    <div>
      <div>Select model</div>
      <select v-on:change="onModelChange($event)" class="form-control">
        <template v-for="model in models">
          <option :value="model.path">{{ model.name }}</option>
        </template>
      </select>
    </div>
  </div>
</template>
<script>
import { ModelList } from '../core/constants'

export default {
  name: 'PrepareGame',
  methods:{
    onModelChange(event){
      const modelPath = event.target.value;
      this.$emit("onModelChange", modelPath);
    }
  },
  created () {
    this.models = ModelList
  }
}
</script>

<style scoped>
.sidebar {
  background-color: #f1f1f1;
}
</style>
