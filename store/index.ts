export interface AppState {
    modelPath: string | undefined
}

export const state = (): AppState => ({
    modelPath: undefined
})

export const getters = {
    getModelPath(state: AppState) {
        return state.modelPath
    }
}

export const actions = {
    updateModelPath(o: any, path: string) {
        o.commit('updateModelPath', path);
    }
}

export const mutations = {
    updateModelPath(state: AppState, path: string) {
        state.modelPath = path;
    }
}

