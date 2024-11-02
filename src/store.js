// src/store.js
import { createStore } from 'vuex';

const store = createStore({
  state() {
    return {
      user: null, // Initialize user state
    };
  },
  mutations: {
    setUser(state, user) {
      state.user = user;
    },
    clearUser(state) {
      state.user = null;
    },
  },
  actions: {
    login({ commit }, user) {
      commit('setUser', user);
    },
    logout({ commit }) {
      commit('clearUser');
    },
  },
});

export default store;
