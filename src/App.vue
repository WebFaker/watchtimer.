<template>
  <div id="app">
    <div v-if="fullLoad" class="fullLoad">
      <img class="loader fullLoad_img" src="@/assets/eye.png" alt="">
    </div>
    <div id="nav">
      <div>
        <img style="margin-right: 10px; width: 20px" src="@/assets/eye.png" alt="Logo"><span>Watchtimer.</span>
      </div>
      <div style="display: flex; align-items: center;">
        <router-link to="/">Home</router-link>
        <Login />
      </div>
    </div>
    <router-view/>
    <div id="footer">
    </div>
  </div>
</template>

<script>
import Login from '@/components/Login.vue'

export default {
  name: 'App',
  components: {
    Login
  },
  data () {
    return {
      fullLoad: true
    }
  },
  mounted () {
    if (!localStorage.isLogged) {
      localStorage.isLogged = false
    }
    setTimeout(() => {
      this.fullLoad = false
    }, 4000)
  },
  methods: {
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
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #ffd500;
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
