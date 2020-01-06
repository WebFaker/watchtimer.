import Vue from "vue";
import Vuex from "vuex";
import firebase from "firebase";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    userdb: "",
    user: "",
    userList: ""
  },
  mutations: {
    setUserDb(state, userInformations) {
      state.userdb = userInformations;
    },
    setUser(state, user) {
      state.user = user;
    },
    setUserList(state, userList) {
      state.userList = userList;
    }
  },
  actions: {
    updateProfile({ commit }) {
      firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          localStorage.isLogged = true;
          commit("setUser", user);
          var userId = firebase.auth().currentUser.uid;
          return firebase
            .database()
            .ref("/users/" + userId)
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
    }
  },
  modules: {}
});
