<template>
  <div id="app">
    <!-- Burger Menu -->
    <div>
      <a-drawer
        placement="right"
        :closable="false"
        @close="onClose"
        :visible="visible"
      >
        <div style="display: flex; justify-content: space-between; align-items: center;" slot="title">
          <span v-if="isLogged === 'true'" style="display: flex; align-items: center;">{{ $store.state.userdb.displayName }}<a-avatar style="margin-left: 5px;" :src="$store.state.userdb.photoURL" /></span>
          <span v-else>Welcome, guest.</span>
          <a-icon @click="onClose" style="padding: 10px;" type="close" />
        </div>
        <div slot="footer">
          COUCOU
        </div>
        <a-menu v-if="isLogged === 'true'" style="border-right: none;">
          <a-menu-item key="1" @click="onClose"><router-link :to="`/`"><a-icon type="home" /> Home</router-link></a-menu-item>
          <a-menu-item key="2" @click="onClose"><router-link :to="`/profile/${$store.state.userdb.uid}`"><a-icon type="user" /> Profile</router-link></a-menu-item>
          <a-menu-item key="3" @click="onClose"><router-link to="/friends"><a-icon type="team" /> Friends</router-link></a-menu-item>
          <a-menu-item key="4" @click="onClose"><router-link to="/settings"><a-icon type="setting" /> Settings</router-link></a-menu-item>
        </a-menu>
        <a-menu v-else style="border-right: none;">
          <a-menu-item key="1" @click="onClose"><router-link :to="`/`"><a-icon type="home" /> Home</router-link></a-menu-item>
          <a-menu-item key="2" @click="onClose"><router-link :to="`/login`"><a-icon type="login" /> Account</router-link></a-menu-item>
        </a-menu>
        <div
          :style="{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'absolute',
            left: 0,
            bottom: 0,
            width: '100%',
            borderTop: '1px solid #e9e9e9',
            padding: '10px 16px',
            background: '#fff',
            textAlign: 'right',
          }">
          <Moon />
          <a-button v-if="isLogged === 'true'" @click="signOut" style="margin-left: 10px;" type="danger"><a-icon type="logout"/> Logout</a-button>
          <p v-else style="margin: 0; font-size: 12px;">Made with <a-icon style="color: red;" theme="filled" type="heart" /> by fov and nico</p>
        </div>
      </a-drawer>
    </div>
    <!-- !Burger Menu -->
    <div v-if="fullLoad && firstTime !== 'yes'" class="fullLoad">
      <img class="loader fullLoad_img" src="@/assets/eye.png" alt="">
    </div>
    <div id="nav">
      <router-link style="color: #000 !important;" to="/">
        <img style="margin-right: 10px; width: 20px" src="@/assets/eye.png" alt="Logo"><span style="font-weight: lighter;">Watchtimer.</span>
      </router-link>
      <div style="display: flex; align-items: center;">
        <p style="margin: 0;" class="mobile" type="primary" @click="showDrawer">
          Menu
        </p>
        <router-link class="desktop" to="/">Home</router-link>
        <router-link class="desktop" v-if="isLogged === 'false'" style="margin-left: 10px;" to="/login">Account</router-link>
        <a-dropdown style="margin-left: 5px;" class="desktop" v-if="isLogged === 'true'">
          <span style="display: flex; align-items: center;">{{ $store.state.userdb.displayName }}<a-avatar style="margin-left: 5px;" :src="$store.state.userdb.photoURL" /></span>
          <a-menu slot="overlay">
            <a-menu-item key="1"><router-link :to="`/profile/${$store.state.userdb.uid}`"><a-icon type="user" /> Profile</router-link></a-menu-item>
            <a-menu-item key="2"><router-link to="/friends"><a-icon type="team" /> Friends</router-link></a-menu-item>
            <a-menu-item key="3"><router-link to="/settings"><a-icon type="setting" /> Settings</router-link></a-menu-item>
            <a-menu-item key="4" @click="signOut"><a-icon type="logout" /> Log out</a-menu-item>
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
import Moon from '@/components/Moon.vue'

export default {
  name: 'App',
  components: {
    Moon
  },
  data () {
    return {
      // Burger Menu
      visible: false,

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
    this.$store.registerModule('userdb', { preserveState: true })
    this.$store.registerModule('userList', { preserveState: true })
    this.$store.registerModule('user', { preserveState: true })
    this.$store.dispatch('updateProfile')
    this.$store.dispatch('updateUserList')
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
        localStorage.removeItem('token159910gichesnihich');
        window.location.href = '/'
      })
      .catch(function(error) {
        // An error happened
        message.error('An error occured, please try again.' + error)
      });
    },
    showDrawer() {
      this.visible = true;
    },
    onClose() {
      this.visible = false;
    },
  }
};
</script>

<style lang="scss">
.ant-avatar > img {
  object-fit: cover;
}
.ant-message {
  z-index: 9999 !important;
}
</style>

<style lang="scss" scoped>
.desktop {
  display: none !important;
  @media(min-width: 768px) {
    display: block !important;
  }
}

.mobile {
  display: block !important;
  @media(min-width: 768px) {
    display: none !important;
  }
}

.loader {
  -webkit-animation: scale-up-center 0.4s cubic-bezier(0.39, 0.575, 0.565, 1)
    infinite alternate;
  animation: scale-up-center 0.4s cubic-bezier(0.39, 0.575, 0.565, 1) infinite
    alternate;
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
  font-family: "Avenir", "Montserrat", Arial, sans-serif;
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
