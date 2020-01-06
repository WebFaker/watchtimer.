<template>
  <div>
    <div style="padding: 0 30px;" v-if="$route.params.follow === 'following'">
      <h2>{{ $store.state.userList[$route.params.id].displayName }}'s Following list</h2>
      <!-- eslint-disable-next-line -->
      <a-list-item v-for="(follow, fov) in $store.state.userList[this.$route.params.id].friends.following" :key="fov" slot="renderItem">
        <a-button slot="actions" v-if="follow !== $store.state.userdb.uid && Object.keys($store.state.userdb.friends.following).includes(follow) == false" @click.stop="addFriend(follow)" type="primary" size="small">
          <a-icon type="user-add" /> Follow
        </a-button>
        <a-button slot="actions" v-if="follow !== $store.state.userdb.uid && Object.keys($store.state.userdb.friends.following).includes(follow) == true" @click.stop="removeFriend(follow)" type="danger" size="small">
          <a-icon type="user-delete" /> Unfollow
        </a-button>
        <a-list-item-meta
          :description="$store.state.userList[follow].bio || 'Unknown'"
        >
          <a slot="title" href="https://www.antdv.com/">{{ $store.state.userList[follow].displayName || 'Unknown' }}</a>
          <a-avatar
            slot="avatar"
            :src="$store.state.userList[follow].photoURL || 'Unknown'"
          />
        </a-list-item-meta>
      </a-list-item>
    </div>
    <div style="padding: 0 30px;" v-if="$route.params.follow === 'followed'">
      <h2>{{ $store.state.userList[this.$route.params.id].displayName }}'s Followed list</h2>
      <!-- eslint-disable-next-line -->
      <a-list-item v-for="(follow, fov) in $store.state.userList[$route.params.id].friends.followed" :key="fov" slot="renderItem">
        <a-button slot="actions" v-if="follow !== $store.state.userdb.uid && Object.keys($store.state.userdb.friends.following).includes(follow) == false" @click.stop="addFriend(follow)" type="primary" size="small">
          <a-icon type="user-add" /> Follow
        </a-button>
        <a-button slot="actions" v-if="follow !== $store.state.userdb.uid && Object.keys($store.state.userdb.friends.following).includes(follow) == true" @click.stop="removeFriend(follow)" type="danger" size="small">
          <a-icon type="user-delete" /> Unfollow
        </a-button>
        <a-list-item-meta
          :description="$store.state.userList[follow].bio || 'Unknown'"
        >
          <a slot="title" href="https://www.antdv.com/">{{ $store.state.userList[follow].displayName || 'Unknown' }}</a>
          <a-avatar
            slot="avatar"
            :src="$store.state.userList[follow].photoURL || 'Unknown'"
          />
        </a-list-item-meta>
      </a-list-item>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
    }
  },
  mounted () {
  },
}
// 1. Récupérer toute la liste des gens
// 2. Prendre les amis de tous les gens
// 3. vérifier si la personne te suit ou non
// 4. si oui, récupérer ses données selon son uid
// 5. afficher les données selon la personne donnée
</script>

<style>

</style>