import Vue from "vue";
import Vuex from "vuex";
import firebase from "firebase";
import createPersistedState from "vuex-persistedstate";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    userdb: "",
    user: "",
    userList: "",
    comments: ""
  },
  getters: {
    comments(state) {
      return state.comments;
    }
  },
  plugins: [createPersistedState()],
  mutations: {
    setUserDb(state, userInformations) {
      state.userdb = userInformations;
    },
    setUser(state, user) {
      state.user = user;
    },
    setUserList(state, userList) {
      state.userList = userList;
    },
    setComments(state, commentary) {
      state.comments = commentary;
    }
  },
  actions: {
    updateProfile({ commit }) {
      firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          localStorage.isLogged = true;
          commit("setUser", user);
          var userID = firebase.auth().currentUser.uid;
          return firebase
            .database()
            .ref("/users/" + userID)
            .once("value")
            .then(function(snapshot) {
              commit("setUserDb", snapshot.val());
            });
        } else {
          // No user is signed in.
          localStorage.isLogged = false;
        }
      });
    },
    updateUserList({ commit }) {
      return firebase
        .database()
        .ref("/users")
        .on("value", function(snapshot) {
          commit("setUserList", snapshot.val());
        });
    },
    updateComments({ commit }) {
      return firebase
        .database()
        .ref("/comments")
        .on("value", function(snapshot) {
          commit("setComments", snapshot.val());
        });
    }
  },
  modules: {}
});
