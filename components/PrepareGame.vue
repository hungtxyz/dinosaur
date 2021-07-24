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
            <select v-on:change="onAnimationChange($event)" class="form-control">
                <template v-for="ani in animations">
                    <option :value="ani">{{ani}}</option>
                </template>
            </select>

        </div>

    </div>

</template>
<script>
import {ModelList, ANIMATION} from '../core/constants'

export default {
    name: 'PrepareGame',
    methods: {
        onModelChange(event) {
            const modelPath = event.target.value;
            this.$emit("onModelChange", modelPath);
        },
        onAnimationChange(event){
            const animation = event.target.value;
            this.$emit("onAnimationChange", animation);
        }
    },
    created() {
        this.models = ModelList
        this.animations = ANIMATION;
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
