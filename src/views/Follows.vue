<template>
  <div>
    <div v-if="this.$store.state.userdb.uid">
      <div style="padding: 0 30px;" v-if="$route.params.follow === 'following'">
        <h2>
          {{ $store.state.userList[$route.params.id].displayName }}'s Following
          list
        </h2>
        <!-- eslint-disable-next-line -->
        <a-list-item v-for="(follow, fov) in $store.state.userList[this.$route.params.id].friends.following" :key="fov" slot="renderItem">
          <a-button
            slot="actions"
            v-if="
              follow !== $store.state.userdb.uid &&
                Object.keys($store.state.userdb.friends.following).includes(
                  follow
                ) == false
            "
            @click.stop="addFriend(follow)"
            type="primary"
            size="small"
          >
            <a-icon type="user-add" /> Follow
          </a-button>
          <a-button
            slot="actions"
            v-if="
              follow !== $store.state.userdb.uid &&
                Object.keys($store.state.userdb.friends.following).includes(
                  follow
                ) == true
            "
            @click.stop="removeFriend(follow)"
            type="danger"
            size="small"
          >
            <a-icon type="user-delete" /> Unfollow
          </a-button>
          <a-list-item-meta :description="$store.state.userList[follow].bio">
            <router-link :to="`/profile/${follow}`" slot="title">
              {{ $store.state.userList[follow].displayName }}
              <a-tag
                v-if="
                  Object.keys(
                    $store.state.userList[follow].friends.following
                  ).includes($store.state.userdb.uid)
                "
              >
                Follows you
              </a-tag>
            </router-link>
            <a-avatar
              slot="avatar"
              :src="$store.state.userList[follow].photoURL"
            />
          </a-list-item-meta>
        </a-list-item>
      </div>
      <div style="padding: 0 30px;" v-if="$route.params.follow === 'followed'">
        <h2>
          {{ $store.state.userList[this.$route.params.id].displayName }}'s
          Followed list
        </h2>
        <!-- eslint-disable-next-line -->
        <a-list-item v-for="(follow, fov) in $store.state.userList[$route.params.id].friends.followed" :key="fov" slot="renderItem">
          <a-button
            slot="actions"
            v-if="
              follow !== $store.state.userdb.uid &&
                Object.keys($store.state.userdb.friends.following).includes(
                  follow
                ) == false
            "
            @click.stop="addFriend(follow)"
            type="primary"
            size="small"
          >
            <a-icon type="user-add" /> Follow
          </a-button>
          <a-button
            slot="actions"
            v-if="
              follow !== $store.state.userdb.uid &&
                Object.keys($store.state.userdb.friends.following).includes(
                  follow
                ) == true
            "
            @click.stop="removeFriend(follow)"
            type="danger"
            size="small"
          >
            <a-icon type="user-delete" /> Unfollow
          </a-button>
          <a-list-item-meta :description="$store.state.userList[follow].bio">
            <router-link :to="`/profile/${follow}`" slot="title">
              {{ $store.state.userList[follow].displayName }}
              <a-tag
                v-if="
                  Object.keys(
                    $store.state.userList[follow].friends.following
                  ).includes($store.state.userdb.uid)
                "
              >
                Follows you
              </a-tag>
            </router-link>
            <a-avatar
              slot="avatar"
              :src="$store.state.userList[follow].photoURL"
            />
          </a-list-item-meta>
        </a-list-item>
      </div>
    </div>
    <div
      v-else
      style="display: flex; align-items: center; justify-content: center; flex-direction: column;"
    >
      <a-card style="display: flex; align-items: center; margin-top: 50px;">
        <p style="margin-bottom: 5px;">
          You must log in or register to display
          <a-avatar
            style="margin-right: 5px;"
            :src="$store.state.userList[$route.params.id].photoURL"
          /><span style="font-weight: bolder;">{{
            $store.state.userList[$route.params.id].displayName
          }}</span
          >'s whole page.
        </p>
        <div style="margin-bottom: 10px;">
          <router-link to="/login">Go to Login/Register</router-link>
        </div>
        <img
          style="width: 100%;"
          src="https://media.giphy.com/media/zOsBDA2n43HPO/giphy.gif"
          alt=""
        />
      </a-card>
    </div>
  </div>
</template>

<script>
import firebase from "firebase";

export default {
  data() {
    return {};
  },
  mounted() {},
  methods: {
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
      location.reload();
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
      location.reload();
    }
  }
};
// 1. Récupérer toute la liste des gens
// 2. Prendre les amis de tous les gens
// 3. vérifier si la personne te suit ou non
// 4. si oui, récupérer ses données selon son uid
// 5. afficher les données selon la personne donnée
</script>

<style></style>
