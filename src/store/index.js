import Vue from "vue";
import Vuex from "vuex";
import firebase from "firebase";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    userdb: "",
    user: ""
  },
  mutations: {
    setUserDb(state, userInformations) {
      state.userdb = userInformations;
      sessionStorage.favCharId = userInformations.favChar;
    },
    setUser(state, user) {
      state.user = user;
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
    }
  },
  modules: {}
});
