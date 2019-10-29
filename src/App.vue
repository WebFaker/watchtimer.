<template>
  <div id="app">
    <div v-if="fullLoad && firstTime !== 'yes'" class="fullLoad">
      <img class="loader fullLoad_img" src="@/assets/eye.png" alt="">
    </div>
    <div id="nav">
      <router-link style="color: #000 !important;" to="/">
        <img style="margin-right: 10px; width: 20px" src="@/assets/eye.png" alt="Logo"><span style="font-weight: lighter;">Watchtimer.</span>
      </router-link>
      <div style="display: flex; align-items: center;">
        <router-link to="/">Home</router-link>
        <router-link v-if="isLogged === 'false'" style="margin-left: 10px;" to="login">Account</router-link>
        <span style="margin: 0 5px;"></span>
        <a-dropdown v-if="isLogged === 'true'">
          <span style="display: flex; align-items: center;">{{ $store.state.userdb.displayName }}<a-avatar style="margin-left: 5px;" :src="$store.state.userdb.photoURL" /></span>
          <a-menu slot="overlay">
            <a-menu-item key="1"><router-link to="/profile"><a-icon type="user" /> Profile</router-link></a-menu-item>
            <a-menu-item key="2"><router-link to="/settings"><a-icon type="setting" /> Settings</router-link></a-menu-item>
            <a-menu-item key="3" @click="signOut"><a-icon type="logout" /> Log out</a-menu-item>
          </a-menu>
        </a-dropdown>
      </div>
    </div>
    <router-view/>
    <div id="footer">
    </div>
  </div>
</template>

<script>
import firebase from 'firebase'
import { message } from 'ant-design-vue'

export default {
  name: 'App',
  data () {
    return {
      isLogged: localStorage.isLogged,
      fullLoad: true,
      firstTime: sessionStorage.firstTime
    }
  },
  beforeCreate() {
    if (localStorage.isLogged === null) {
      localStorage.isLogged = false
    }
  },
  mounted () {
    this.$store.dispatch('updateProfile')
    setTimeout(() => {
      this.fullLoad = false
      sessionStorage.firstTime = "yes"
    }, 4000)
  },
  methods: {
    signOut() {
      firebase.auth().signOut()
      .then(function() {
        // Sign-out successful.
        localStorage.isLogged = false
        window.location.href = './'
      })
      .catch(function(error) {
        // An error happened
        message.error('An error occured, please try again.' + error)
      });
    }
  }
}
</script>

<style lang="scss">
  .ant-message {
    z-index: 9999 !important;
  }
</style>

<style lang="scss" scoped>

.loader {
  -webkit-animation: scale-up-center 0.4s cubic-bezier(0.390, 0.575, 0.565, 1.000) infinite alternate ;
  animation: scale-up-center 0.4s cubic-bezier(0.390, 0.575, 0.565, 1.000) infinite alternate ;
}

@-webkit-keyframes scale-up-center {
  0% {
    -webkit-transform: translate(-50%, -50%) scale(0.5);
            transform: translate(-50%, -50%) scale(0.5);
  }
  100% {
    -webkit-transform: translate(-50%, -50%) scale(1);
            transform: translate(-50%, -50%) scale(1);
  }
}
@keyframes scale-up-center {
  0% {
    -webkit-transform: translate(-50%, -50%) scale(0.5);
            transform: translate(-50%, -50%) scale(0.5);
  }
  100% {
    -webkit-transform: translate(-50%, -50%) scale(1);
            transform: translate(-50%, -50%) scale(1);
  }
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #000;
}

#nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 30px;

  a {
    color: #000000;
    transition: 0.3s all;
    &:hover {
      color: #ffd500;
    }

    &.router-link-exact-active {
      color: #ffd500;
      text-decoration: none;
    }
  }
}

.fullLoad {
  position: fixed;
  z-index: 999;
  background: white;
  width: 100vw;
  height: 100vh;
  &_img {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 50px;
  }
}
</style>
