import Vue from "vue";
import Antd from "ant-design-vue";
import "ant-design-vue/dist/antd.css";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import firebase from "firebase";
import moment from "moment";

Vue.config.productionTip = false;

Vue.prototype.moment = moment;

Vue.use(Antd);

const config = {
  apiKey: "AIzaSyBvs5dn75PTLtBopsedVaoGFFkUunCJrkM",
  authDomain: "watch-timer.firebaseapp.com",
  databaseURL: "https://watch-timer.firebaseio.com",
  projectId: "watch-timer",
  storageBucket: "watch-timer.appspot.com",
  appId: "1:552662465307:web:1039dd86ab4459dee571be",
  measurementId: "G-YWDBBNH97Q"
};

firebase.initializeApp(config);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
