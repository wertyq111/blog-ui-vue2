import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from "vuex-persistedstate";

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    toolbar: {
      visible: false,
      enter: true
    },
    categoryInfo: [],
    currentUser: {},
    currentAdmin: {},
    webInfo: {
      webName: "",
      webTitle: [],
      notices: [],
      footer: "",
      backgroundImage: "",
      avatar: ""
    }
  },
  getters: {
    articleTotal: state => {
      if (state.categoryInfo !== null && state.categoryInfo.length !== 0) {
        if (state.categoryInfo.length === 1) {
          return state.categoryInfo[0].articles.length;
        } else {
          return state.categoryInfo.reduce((prev, curr) => {
            if (typeof prev === "number") {
              return prev + curr.articles.length;
            } else {
              return prev.articles.length + curr.articles.length;
            }
          });
        }
      } else {
        return 0;
      }
    },
    navigationBar: state => {
      if (state.categoryInfo !== null && state.categoryInfo.length !== 0) {
        return state.categoryInfo.filter(f => f.type === 0);
      } else {
        return [];
      }
    }
  },
  mutations: {
    changeToolbarStatus(state, toolbarState) {
      state.toolbar = toolbarState;
    },
    loadCategoryInfo(state, categoryInfo) {
      if (categoryInfo !== null && categoryInfo.length !== 0) {
        state.categoryInfo = categoryInfo.sort((s1, s2) => s1.priority - s2.priority);
      }
    },
    loadCurrentUser(state, user) {
      state.currentUser = user;
    },
    loadCurrentAdmin(state, user) {
      state.currentAdmin = user;
    },
    loadCurrentMember(state, member) {
      state.currentMember = member;
    },
    loadWebInfo(state, webInfo) {
      webInfo.webTitle = webInfo.webTitle.split('');
      webInfo.notices = JSON.parse(webInfo.notices);
      state.webInfo = webInfo;
    }
  },
  actions: {},
  modules: {},
  plugins: [
    createPersistedState({
      storage: window.localStorage
    })
  ]
})
