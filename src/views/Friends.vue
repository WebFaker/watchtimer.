<template>
  <div style="display: flex;">
    <a-card
      hoverable
      style="width: 200px; margin: 10px;"
      v-for="(user, a) in $store.state.userList"
      :key="a"
    >
      <img :src="user.photoURL" alt="" slot="cover" />
      <a-card-meta :title="user.displayName">
        <template slot="description">
          {{ user.bio.substring(0, 50) + "..." }}
          <span>
            <p>{{ $store.state.userdb.friends }}</p>
            <p v-if="user.uid == $store.state.userdb.friends">Followed</p>
            <a-button @click.stop="addFriend(user)" type="primary" size="small">
              <a-icon type="plus" /> Follow
            </a-button>
          </span>
        </template>
      </a-card-meta>
    </a-card>
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
    console.log(this.$store.state.userList);
  },
  methods: {
    addFriend(value) {
      var userID = firebase.auth().currentUser.uid;
      firebase
        .database()
        .ref().child("users/" + userID + "/friends/" + value.uid)
        .set(value)
        .catch(function(error) {
          console.error(error);
        });
        console.log(value)
    }
  }
};
</script>

<style></style>
