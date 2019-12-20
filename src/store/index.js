import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    word: {
      addDialogVisible: false,
      editDialogVisible: false
    }
  },
  mutations: {
    changeWordAddDialogVisible(state, visible){
      state.word.addDialogVisible = visible;
    },
    changeWordEditDialogVisible(state, visible){
      state.word.editDialogVisible = visible;
    }
  },
  actions: {
  },
  modules: {
  }
})
