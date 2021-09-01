import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    orderStatus:"",
    // orderData:{
    //   messageType:6
    // },
    orderData:{},
    aiduoStatus:false,
  },
  mutations: {
    setOrderStatus(state, value) {
      state.orderStatus = value
    },
    setOrderData(state, value) {
      state.orderData = value
    },
    setAiduoStatus(state, value) {
      state.aiduoStatus = value
    }
  },
  actions: {
    
  },
  modules: {
  }
})
