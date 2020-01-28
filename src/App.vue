<template>
  <div id="app">
    <a-back-top />
    <!-- Burger Menu -->
    <div>
      <a-drawer
        placement="right"
        :closable="false"
        @close="onClose"
        :visible="visible"
      >
        <div
          style="display: flex; justify-content: space-between; align-items: center;"
          slot="title"
        >
          <span
            v-if="isLogged === 'true'"
            style="display: flex; align-items: center;"
            >{{ $store.state.userdb.displayName
            }}<a-avatar
              style="margin-left: 5px;"
              :src="$store.state.userdb.photoURL"
          /></span>
          <span v-else>Welcome, guest.</span>
          <a-icon @click="onClose" style="padding: 10px;" type="close" />
        </div>
        <div slot="footer">
          Made with ❤️ by fov and nico
        </div>
        <a-menu v-if="isLogged === 'true'" style="border-right: none;">
          <a-menu-item key="1" @click="onClose"
            ><router-link :to="`/`"
              ><a-icon type="home" /> Home</router-link
            ></a-menu-item
          >
          <a-menu-item key="2" @click="onClose"
            ><router-link :to="`/profile/${$store.state.userdb.uid}`"
              ><a-icon type="user" /> Profile</router-link
            ></a-menu-item
          >
          <a-menu-item key="3" @click="onClose"
            ><router-link to="/users"
              ><a-icon type="team" /> Users</router-link
            ></a-menu-item
          >
          <a-menu-item key="4" @click="onClose"
            ><router-link to="/settings"
              ><a-icon type="setting" /> Settings</router-link
            ></a-menu-item
          >
        </a-menu>
        <a-menu v-else style="border-right: none;">
          <a-menu-item key="1" @click="onClose"
            ><router-link :to="`/`"
              ><a-icon type="home" /> Home</router-link
            ></a-menu-item
          >
          <a-menu-item key="2" @click="onClose"
            ><router-link :to="`/login`"
              ><a-icon type="login" /> Account</router-link
            ></a-menu-item
          >
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
            textAlign: 'right'
          }"
        >
          <div
            style="width: 25px; height: 25px;"
            v-if="theme === 'light'"
            @click="loadDarkTheme"
          >
            <Moon />
          </div>
          <div
            style="width: 25px; height: 25px;"
            v-else
            @click="loadLightTheme"
          >
            <Sun />
          </div>
          <a-button
            v-if="isLogged === 'true'"
            @click="signOut"
            style="margin-left: 10px;"
            type="danger"
            ><a-icon type="logout" /> Logout</a-button
          >
          <p v-else style="margin: 0; font-size: 12px;">
            Made with
            <a-icon style="color: red;" theme="filled" type="heart" /> by fov
            and nico
          </p>
        </div>
      </a-drawer>
    </div>
    <!-- !Burger Menu -->
    <div id="nav">
      <div style="display: flex; align-items: center;">
        <router-link style="color: var(--main-font-color) !important;" to="/">
          <img
            style="margin-right: 10px; width: 20px"
            src="@/assets/eye.png"
            alt="Logo"
          /><span style="font-weight: lighter;">Watchtimer.</span
          ><a-tag style="margin-left: 5px;">v0.1</a-tag>
        </router-link>
        <div
          class="desktop"
          style="cursor: pointer; width: 25px; height: 25px; margin-left: 5px;"
          v-if="theme === 'light'"
          @click="loadDarkTheme"
        >
          <Moon />
        </div>
        <div
          class="desktop"
          style="cursor: pointer; width: 25px; height: 25px; margin-left: 5px;"
          v-else
          @click="loadLightTheme"
        >
          <Sun />
        </div>
      </div>
      <div style="display: flex; align-items: center;">
        <p style="margin: 0;" class="mobile" type="primary" @click="showDrawer">
          Menu
        </p>
        <router-link class="desktop" to="/">Home</router-link>
        <router-link
          class="desktop"
          v-if="isLogged === 'false'"
          style="margin-left: 10px;"
          to="/login"
          >Account</router-link
        >
        <a-dropdown
          style="margin-left: 10px;"
          class="desktop-flex"
          v-if="isLogged === 'true'"
        >
          <span style="display: flex; align-items: center;"
            >{{ $store.state.userdb.displayName
            }}<a-avatar
              style="margin-left: 5px;"
              :src="$store.state.userdb.photoURL"
          /></span>
          <a-menu slot="overlay">
            <a-menu-item key="1"
              ><router-link :to="`/profile/${$store.state.userdb.uid}`"
                ><a-icon type="user" /> Profile</router-link
              ></a-menu-item
            >
            <a-menu-item key="2"
              ><router-link to="/users"
                ><a-icon type="team" /> Users</router-link
              ></a-menu-item
            >
            <a-menu-item key="3"
              ><router-link to="/settings"
                ><a-icon type="setting" /> Settings</router-link
              ></a-menu-item
            >
            <a-menu-item key="4" @click="signOut"
              ><a-icon type="logout" />Log out</a-menu-item
            >
          </a-menu>
        </a-dropdown>
      </div>
    </div>
    <router-view style="margin-top: 100px;" />
    <div id="footer"></div>
  </div>
</template>

<script>
import firebase from "firebase";
import { message } from "ant-design-vue";
import Moon from "@/components/Moon.vue";
import Sun from "@/components/Sun.vue";

export default {
  name: "App",
  components: {
    Moon,
    Sun
  },
  data() {
    return {
      // Burger Menu
      visible: false,

      theme: localStorage.theme,

      isLogged: localStorage.isLogged
    };
  },
  beforeCreate() {
    if (!localStorage.isLogged) {
      localStorage.isLogged = false;
    }
    if (!localStorage.theme) {
      localStorage.theme = "light";
    }
  },
  mounted() {
    this.$store.registerModule("userdb", { preserveState: true });
    this.$store.registerModule("userList", { preserveState: true });
    this.$store.registerModule("user", { preserveState: true });
    this.$store.registerModule("comments", { preserveState: true });
    this.$store.dispatch("updateProfile");
    this.$store.dispatch("updateComments");
    this.$store.dispatch("updateUserList");
    this.fullLoad = true;
    if (localStorage.theme === "light") {
      this.loadLightTheme();
    } else if (localStorage.theme === "dark") {
      this.loadDarkTheme();
    }
  },
  methods: {
    loadDarkTheme() {
      console.log("Click !");
      if (localStorage.theme === "light") {
        localStorage.theme = "dark";
        this.theme = "dark";
      }
      document.documentElement.style.setProperty("--main-bg-color", "#1b1b1b");
      document.documentElement.style.setProperty(
        "--main-bg-component-color",
        "#2b2b2b"
      );
      document.documentElement.style.setProperty(
        "--main-opacity-color",
        "rgba(255, 255, 255, 0.75)"
      );
      document.documentElement.style.setProperty(
        "--main-opacity-more-color",
        "rgba(255, 255, 255, 0.45)"
      );
      document.documentElement.style.setProperty(
        "--main-font-button-disabled-color",
        "rgba(255, 255, 255, 0.25)"
      );
      document.documentElement.style.setProperty(
        "--main-font-color",
        "#ffffff"
      );
    },
    loadLightTheme() {
      console.log("Click !");
      if (localStorage.theme === "dark") {
        localStorage.theme = "light";
        this.theme = "light";
      }
      document.documentElement.style.setProperty("--main-bg-color", "#ffffff");
      document.documentElement.style.setProperty(
        "--main-bg-component-color",
        "#fafafa"
      );
      document.documentElement.style.setProperty(
        "--main-opacity-color",
        "rgba(0, 0, 0, 0.75)"
      );
      document.documentElement.style.setProperty(
        "--main-opacity-more-color",
        "rgba(0, 0, 0, 0.45)"
      );
      document.documentElement.style.setProperty(
        "--main-font-button-disabled-color",
        "rgba(0, 0, 0, 0.25)"
      );
      document.documentElement.style.setProperty(
        "--main-font-color",
        "#000000"
      );
    },
    signOut() {
      firebase
        .auth()
        .signOut()
        .then(function() {
          // Sign-out successful.
          localStorage.isLogged = false;
          window.location.href = "/";
        })
        .catch(function(error) {
          // An error happened
          message.error("An error occured, please try again." + error);
        });
    },
    showDrawer() {
      this.visible = true;
    },
    onClose() {
      this.visible = false;
    }
  }
};
</script>

<style lang="less">
@primary-color: #ffd500;
@normal-color: #d9d9d9;
@white: var(--main-bg-color);
@black: var(--main-font-color);
</style>

<style lang="scss">
// Light and Dark Theme
body {
  // --main-bg-color: #1b1b1b;
  // --main-bg-component-color: #2b2b2b;
  // --main-bg-opacity-color: rgba(255, 255, 255, 0.75);
  // --main-bg-opacity-more-color: rgba(255, 255, 255, 0.45);
  // --main-font-button-disabled-color: rgba(255, 255, 255, 0.25);
  // --main-font-color: #fff;
  background-color: var(--main-bg-color);
  color: var(--main-font-color);
}

.ant-dropdown-menu-item:hover,
.ant-select-dropdown-menu-item-selected,
.ant-card,
.ant-card-meta-title,
.ant-card-meta-description,
.ant-modal-content,
.ant-modal-header,
.ant-modal-title,
.ant-list-vertical .ant-list-item-meta-title {
  background-color: var(--main-bg-color) !important;
  color: var(--main-font-color);
}

.ant-btn-disabled,
.ant-btn.disabled,
.ant-btn[disabled],
.ant-btn-disabled:hover,
.ant-btn.disabled:hover,
.ant-btn[disabled]:hover,
.ant-btn-disabled:focus,
.ant-btn.disabled:focus,
.ant-btn[disabled]:focus,
.ant-btn-disabled:active,
.ant-btn.disabled:active,
.ant-btn[disabled]:active,
.ant-btn-disabled.active,
.ant-btn.disabled.active,
.ant-btn[disabled].active {
  color: var(--main-font-button-disabled-color);
  background-color: var(--main-bg-opacity-more-color);
}

.ant-tooltip-inner {
  color: var(--main-bg-color);
  background-color: var(--main-bg-opacity-color);
}

.ant-message-notice-content {
  background: var(--main-bg-component-color);
  color: var(--main-font-color);
}

.ant-tooltip-placement-top .ant-tooltip-arrow,
.ant-tooltip-placement-topLeft .ant-tooltip-arrow,
.ant-tooltip-placement-topRight .ant-tooltip-arrow {
  border-top-color: var(--main-bg-opacity-color);
}

.icon-wrapper .anticon {
  color: var(--main-font-color) !important;
}

.ant-collapse-borderless,
.ant-collapse-header {
  background: var(--main-bg-color);
  color: var(--main-font-color) !important;
}

.ant-collapse > .ant-collapse-item > .ant-collapse-header .ant-collapse-arrow {
  color: var(--main-font-color) !important;
}

h1,
h2,
h3,
h4,
h5,
p {
  color: var(--main-font-color);
}

.ant-back-top-content {
  background-color: var(--main-bg-opacity-more-color);
}

.ant-comment-content-author-name > * {
  color: var(--main-bg-opacity-color);
}

.ant-comment-actions > li > span,
.ant-dropdown-menu-item > a,
.ant-dropdown-menu-item {
  color: var(--main-bg-opacity-color);
}

.ant-card-actions {
  background: var(--main-bg-component-color);
}

.ant-input,
.ant-select-selection,
.ant-dropdown,
.ant-dropdown-menu,
.ant-select-dropdown,
.ant-select-dropdown-menu-item {
  color: var(--main-font-color);
  background: var(--main-bg-component-color);
}

.ant-select-arrow,
.ant-input-search-icon {
  color: var(--main-font-color);
}

// -----------------------------------------

.ant-avatar > img {
  object-fit: cover;
}
.ant-message {
  z-index: 9999 !important;
}
.desktop-flex {
  display: none !important;
  @media (min-width: 768px) {
    display: flex !important;
  }
}
.desktop {
  display: none !important;
  @media (min-width: 768px) {
    display: block !important;
  }
}
.mobile {
  display: block !important;
  @media (min-width: 768px) {
    display: none !important;
  }
}
.main-card {
  position: relative;
  width: 100%;
  min-width: 320px;
  &_noMargin {
    margin: 0 -5px;
    @media (min-width: 768px) {
      width: auto;
      margin: 0 -10px;
    }
  }
  &_img {
    width: 50px;
    @media (min-width: 768px) {
      width: 75px;
    }
    @media (min-width: 1024px) {
      width: 100px;
    }
    @media (min-width: 1440px) {
      width: 125px;
    }
  }
  @media (min-width: 768px) {
    width: 85%;
  }
  @media (min-width: 1024px) {
    width: 75%;
  }
}
.anime-card_outside > .anime-card {
  width: 100%;
  padding: 0;
  margin: 0;
}
.anime-card > .ant-card-body {
  padding: 0;
}
.anime-card {
  width: 50%;
  margin: 5px;
  @media (min-width: 768px) {
    width: 25%;
    margin: 10px;
  }
  @media (min-width: 1024px) {
    width: 20%;
  }
  @media (min-width: 1440px) {
    width: 16.66%;
  }
  &_outside {
    width: 50%;
    padding: 5px;
    @media (min-width: 468px) {
      width: 33.33%;
      padding: 5px;
    }
    @media (min-width: 768px) {
      width: 25%;
      padding: 10px;
    }
    @media (min-width: 1024px) {
      width: 20%;
    }
    @media (min-width: 1440px) {
      width: 16.66%;
    }
  }
  &_img {
    object-fit: cover;
    object-position: 50% 100%;
    height: 60vw;
    @media (min-width: 468px) {
      height: 40vw;
    }
    @media (min-width: 768px) {
      height: 27vw;
    }
    @media (min-width: 1024px) {
      height: 20vw;
    }
    @media (min-width: 1440px) {
      height: 15vw;
    }
  }
}
</style>

<style lang="scss" scoped>
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
  width: 100%;
  color: var(--main-font-color);
  background: var(--main-bg-color);
  border-bottom: 1px solid #e8e8e8;
  z-index: 998;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 30px;

  a {
    color: var(--main-font-color);
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
</style>
