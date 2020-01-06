import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import Login from "../views/Login.vue";
import Profile from "../views/Profile.vue";
import Follows from "../views/Follows.vue";
import Friends from "../views/Friends.vue";
import Settings from "../views/Settings.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "home",
    component: Home
  },
  {
    path: "/login",
    name: "login",
    component: Login
  },
  {
    path: "/profile/:id",
    name: "profile",
    component: Profile,
  },
  {
    path: '/profile/:id/:follow',
    name: "follows",
    component: Follows
  },
  {
    path: "/friends",
    name: "friends",
    component: Friends
  },
  {
    path: "/settings",
    name: "settings",
    component: Settings
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
