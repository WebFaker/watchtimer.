<template>
  <div style="display: flex; flex-wrap: wrap; justify-content: center">
    <router-link
      @click.native="$event.stopImmediatePropagation()"
      v-for="(user, a) in $store.state.userList"
      :key="a"
      :to="`profile/${user.uid}`"
    >
      <a-card hoverable style="width: 150px; margin: 10px;">
        <img
          style="width: 150px; height: 150px; object-fit: cover;"
          :src="user.photoURL"
          alt=""
          slot="cover"
        />
        <a-card-meta :title="user.displayName">
          <template slot="description">
            {{ user.bio.substring(0, 50) + "..." }}
            <span>
              <a-button
                @click.prevent="addFriend(user.uid)"
                v-if="
                  user.uid !== $store.state.userdb.uid &&
                    Object.keys(
                      $store.state.userList[$store.state.userdb.uid].friends
                        .following
                    ).includes(user.uid) == false
                "
                type="primary"
                size="small"
              >
                <a-icon type="user-add" /> Follow
              </a-button>
              <a-button
                @click.prevent="removeFriend(user.uid)"
                v-if="
                  user.uid !== $store.state.userdb.uid &&
                    Object.keys(
                      $store.state.userList[$store.state.userdb.uid].friends
                        .following
                    ).includes(user.uid) == true
                "
                type="danger"
                size="small"
              >
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
  mounted() {},
  methods: {
    // Follow / Unfollow System
    addFriend(value) {
      var userID = firebase.auth().currentUser.uid;
      firebase
        .database()
        .ref()
        .child("users/" + value + "/friends/followed/" + userID)
        .set(userID);
      firebase
        .database()
        .ref()
        .child("users/" + userID + "/friends/following/" + value)
        .set(value)
        .catch(function(error) {
          console.error(error);
        });
      console.log(value);
    },
    removeFriend(value) {
      var userID = firebase.auth().currentUser.uid;
      firebase
        .database()
        .ref()
        .child("users/" + userID + "/friends/following/" + value)
        .remove();
      firebase
        .database()
        .ref()
        .child("users/" + value + "/friends/followed/" + userID)
        .remove();
    }
  }
};
</script>
