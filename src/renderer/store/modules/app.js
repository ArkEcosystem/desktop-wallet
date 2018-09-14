export default {
  namespaced: true,

  state: {
    pinCode: null
  },

  getters: {
    pinCodeEnabled: state => !!state.pinCode,
    pinCode: state => state.pinCode
  },

  mutations: {
    SET_PIN_CODE (state, pinCode) {
      state.pinCode = pinCode
    }
  },

  actions: {
    setPinCode ({ commit }, value) {
      commit('SET_PIN_CODE', value)
    }
  }
}
