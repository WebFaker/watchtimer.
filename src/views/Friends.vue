<template>
  <div style="display: flex;">
    <router-link
        v-for="(user, a) in $store.state.userList"
        :key="a"
        :to="`profile/${user.uid}`"
      >
      <a-card
        hoverable
        style="width: 200px; margin: 10px;"
      >
          <img :src="user.photoURL" alt="" slot="cover" />
          <a-card-meta :title="user.displayName">
            <template slot="description">
              {{ user.bio.substring(0, 50) + "..." }}
              <span>
                <p v-if="Object.keys($store.state.userdb.friends).includes(user.uid) == true">Followed</p>
                <a-button v-if="user.uid !== $store.state.userdb.uid && Object.keys($store.state.userdb.friends.following).includes(user.uid) == false" @click.stop="addFriend(user.uid)" type="primary" size="small">
                  <a-icon type="user-add" /> Follow
                </a-button>
                <a-button v-if="user.uid !== $store.state.userdb.uid && Object.keys($store.state.userdb.friends.following).includes(user.uid) == true" @click.stop="removeFriend(user.uid)" type="danger" size="small">
                  <a-icon type="user-delete" /> Unfollow
                </a-button>
              </span>
            </template>
          </a-card-meta>
      </a-card>
    </router-link>
  </div>
</template>

<script>
import firebase from "firebase";

export default {
  name: "Friends",
  data() {
    return {};
  },
  mounted() {
  },
  methods: {
    // Follow / Unfollow System
    addFriend(value) {
      var userID = firebase.auth().currentUser.uid;
      firebase
        .database()
        .ref().child("users/" + value + "/friends/followed/" + userID)
        .set(userID)
      firebase
        .database()
        .ref().child("users/" + userID + "/friends/following/" + value)
        .set(value)
        .catch(function(error) {
          console.error(error);
        });
        console.log(value)
    },
    removeFriend(value) {
      var userID = firebase.auth().currentUser.uid;
      firebase
        .database()
        .ref().child("users/" + userID + "/friends/following/" + value)
        .remove()
      firebase
        .database()
        .ref().child("users/" + value + "/friends/followed/" + userID)
        .remove()
    }
  }
};
</script>
