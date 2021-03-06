import Vue from "vue";
import VueRouter from "vue-router";
import Home from "@/views/Home.vue";
import Anime from "@/views/Anime.vue";
import Login from "@/views/Login.vue";
import Profile from "@/views/Profile.vue";
import List from "@/views/List.vue";
import Follows from "@/views/Follows.vue";
import Users from "@/views/Users.vue";
import Settings from "@/views/Settings.vue";
import notFound from "@/views/NotFound.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "home",
    component: Home,
    meta: {
      title: "Watchtimer. - Explore animes !",
      metaTags: [
        {
          name: "description",
          content: "Explore anime's worlds freely !"
        },
        {
          property: "og:description",
          content: "Explore anime's worlds freely !"
        }
      ]
    }
  },
  {
    path: "/anime/:id",
    name: "anime",
    component: Anime
  },
  {
    path: "/login",
    name: "login",
    component: Login
  },
  {
    path: "/profile/:id",
    name: "profile",
    component: Profile
  },
  {
    path: "/profile/:id/:list",
    name: "list",
    component: List
  },
  {
    path: "/profile/:id/:follow",
    name: "follows",
    component: Follows
  },
  {
    path: "/users",
    name: "users",
    component: Users
  },
  {
    path: "/settings",
    name: "settings",
    component: Settings
  },
  {
    path: "*",
    name: "404",
    component: notFound
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
