<template>
  <div class="home">
    <h1 style="margin-top: 50px; text-align: center;">Search for an anime :</h1>
    <a-input-group style="text-align: center;" compact>
      <a-select style="width: 115px;" defaultValue="anime" @change="handleChange">
        <a-select-option value="anime">Anime</a-select-option>
        <a-select-option value="character">Characters</a-select-option>
      </a-select>
      <a-input-search style="width: 50%;" type="name" @search="onSearch" />
    </a-input-group>
    <img
      v-if="isLoading"
      class="loader"
      style="width: 50px;"
      src="@/assets/eye.png"
      alt="Watchtimer Logo"
    />
    <transition name="fade">
      <div style="margin-top: 50px;" v-if="show">
        <h2 style="text-align: center;">Results for : {{ searchValue }}</h2>
        <div v-if="show" style="display: flex; flex-wrap: wrap; justify-content: center;">
          <a-card
            :value="i.mal_id"
            @click="showModal(i.mal_id)"
            v-for="(i, e) in animeResults"
            :key="e"
            hoverable
            style="margin: 10px; width: 240px; position: relative;"
          >
            <a-icon v-if="isLogged === 'true' && $store.state.userList[$store.state.userdb.uid].favChar.mal_id == i.mal_id" @click.stop="toggleFav(i.mal_id)" style="color: red; position: absolute; top: 10px; right: 10px; font-size: 20px;" twoToneColor="FF0000" type="heart" theme="filled" />
            <a-icon v-if="isLogged === 'true' && $store.state.userList[$store.state.userdb.uid].favChar.mal_id !== i.mal_id" @click.stop="toggleFav(i.mal_id)" style="color: red; position: absolute; top: 10px; right: 10px; font-size: 20px;" twoToneColor="FF0000" type="heart" theme="twoTone" />
            <img
              style="height: 370px; object-fit: contain; object-position: 50% 0%"
              :src="i.image_url"
              :alt="i.title"
              slot="cover"
            />
            <a-card-meta :title="i.title">
              <template slot="description">
                <p v-if="searchType == 'anime'">
                  En cours :
                  <span v-if="i.airing">Oui</span>
                  <span v-if="!i.airing">Non</span>
                  <br />
                  Score : {{ i.score }}/10
                </p>
                <p v-if="searchType == 'character'">{{ i.name }}</p>
                <div v-if="searchType == 'character' && i.alternative_names.length !== 0">
                  <span>Known as : </span>
                  <span v-for="(name, g) in i.alternative_names" :key="g">{{ name }}</span>
                </div>
              </template>
            </a-card-meta>
          </a-card>
        </div>
      </div>
    </transition>
    <a-modal
      :footer="null"
      :afterClose="afterClose"
      :title="this.modal.name + ' (' + this.modal.id + ')'"
      v-model="visible"
      @ok="handleOk"
    >
      <a-skeleton active :loading="loading">
        <div class="modal_container">
          <div style="display: flex; align-items: center;">
            <img style="max-width: 50%;" :src="this.modal.img" :alt="this.modal.name" />
            <div style="margin-left: 10px;" class="modal_titles">
              <h3>{{ modal.name }}</h3>
              <p style="color: grey; font-size: 12px;">{{ modal.japanese }}</p>
              <a-tag v-for="(genre, g) in modal.genres" :key="g">{{ genre.name }}</a-tag>
            </div>
          </div>
          <div class="modal_informations">
            <div v-if="searchType === 'anime' && modal.embed !== null" class="video_wrapper">
              <iframe
                :src="modal.embed"
                width="100%"
                height="100%"
                frameborder="0"
                rel="0"
                modestbranding="1"
                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen
              />
            </div>
            <a-collapse v-if="searchType === 'anime'" style="margin-top: 25px;" :bordered="false">
              <a-collapse-panel header="Synopsis :" key="1">
                <p style="white-space: pre-wrap;">{{ modal.synopsis }}</p>
              </a-collapse-panel>
            </a-collapse>
            <a-collapse
              v-if="searchType === 'character'"
              style="margin-top: 25px;"
              :bordered="false"
            >
              <a-collapse-panel header="About :" key="1">
                <p style="white-space: pre-wrap;">{{ modal.synopsis }}</p>
              </a-collapse-panel>
              <a-collapse-panel header="Appears in :" key="2">
                <p v-for="(anime, h) in modal.animeography" :key="h">{{ anime.name }}</p>
              </a-collapse-panel>
            </a-collapse>
          </div>
        </div>
      </a-skeleton>
    </a-modal>
    <div style="margin-top: 50px;" v-if="isShowingTop">
      <h2 style="text-align: center;">Best rated animes :</h2>
      <div style="display: flex; flex-wrap: wrap; justify-content: center;">
        <a-card
          @click="showModal(top.mal_id)"
          v-for="(top, f) in topResults"
          :key="f"
          hoverable
          style="margin: 10px; width: 240px; position: relative"
        >
          <a-icon v-if="isLogged === 'true' && Object.keys($store.state.userList[$store.state.userdb.uid].watchedAnimes).includes('anime' + top.mal_id) === false" @click.stop="addAnime(top)" style="color: red; position: absolute; top: 10px; right: 10px; font-size: 20px;" twoToneColor="FF0000" type="heart" theme="twoTone" />
          <a-icon v-if="isLogged === 'true' && Object.keys($store.state.userList[$store.state.userdb.uid].watchedAnimes).includes('anime' + top.mal_id) === true" @click.stop="addAnime(top)" style="color: red; position: absolute; top: 10px; right: 10px; font-size: 20px;" twoToneColor="FF0000" type="heart" theme="filled" />
          <img
            style="height: 370px; object-fit: contain; object-position: 50% 0%"
            :src="top.image_url"
            :alt="top.title"
            slot="cover"
          />
          <a-card-meta :title="top.title">
            <template slot="description">
              Started in {{ top.start_date }}
              <br />
              Score : {{ top.score }}/10
              <a-progress style="width: 100%;" :percent="percent" :format="() => ''" />
              <p>
                <span>{{ currentEpisode }}</span>
                / {{ top.episodes }}
              </p>
              <a-button icon="minus" @click.stop="decline(top.episodes)" />
              <a-button icon="plus" @click.stop="increase(top.episodes)" />
            </template>
          </a-card-meta>
        </a-card>
      </div>
    </div>
  </div>
</template>

<!-- The core Firebase JS SDK is always required and must be listed first -->
<script src="/__/firebase/7.2.1/firebase-app.js"></script>

<!-- TODO: Add SDKs for Firebase products that you want to use
     https://firebase.google.com/docs/web/setup#available-libraries -->
<script src="/__/firebase/7.2.1/firebase-analytics.js"></script>

<!-- Initialize Firebase -->
<script src="/__/firebase/init.js"></script>

<script>
import Vue from "vue";
const jikanjs = require("jikanjs");
import firebase from "firebase";
import { message } from 'ant-design-vue'

export default {
  name: "home",
  data() {
    return {
      isLogged: localStorage.isLogged,

      percent: 0,
      currentEpisode: 0,

      fullLoad: true,

      loading: true,
      visible: false,

      show: false,

      isShowingTop: true,
      isLoading: false,

      animeResults: "",

      topResults: "",

      searchValue: "",
      searchType: "anime",

      favCharId: undefined,
      getFavChar: undefined,

      watchedAnimes: [],

      modal: {
        name: "",
        japanese: "",
        img: "",
        id: "",
        synopsis: "",
        genres: "",
        embed: "",
        animeography: ""
      }
    };
  },
  beforeMount() {
    (this.isShowingTop = true),
    (this.isLoading = false),
    jikanjs.loadTop("anime").then(response => {
      this.topResults = response.top;
    });
  },
  mounted() {
    this.favCharId = this.$store.state.userList[this.$store.state.userdb.uid].favChar.mal_id
  },
  methods: {
    addAnime(value) {
      if (Object.keys(this.$store.state.userList[this.$store.state.userdb.uid].watchedAnimes).includes('anime' + value.mal_id) === false) {
        jikanjs.loadAnime(value.mal_id).then(response => {
          let user = firebase.auth().currentUser;
          var title = response.title
          firebase
          .database()
          .ref("users/" + user.uid + "/watchedAnimes/" + 'anime' + response.mal_id)
          .update({
            name: response.title,
            photoUrl: response.image_url,
            mal_id: response.mal_id,
            watched: 0
          });
          message.success("You just added " + title + " to your watchlist.");
        });
      } else {
        firebase
          .database()
          .ref().child("users/" + this.$store.state.userdb.uid + "/watchedAnimes/" + 'anime' + value.mal_id)
          .remove()
          message.success("You just removed " + value.title + " of your watchlist.");
      }
    },
    toggleFav(value) {
      if (this.$store.state.userList[this.$store.state.userdb.uid].favChar.mal_id === value) {
        let user = firebase.auth().currentUser;
        firebase
        .database()
        .ref("users/" + user.uid + "/favChar")
        .update({
          name: "nobody",
          photoUrl: "https://firebasestorage.googleapis.com/v0/b/watch-timer.appspot.com/o/18436.png?alt=media&token=68807595-a777-4c67-a16f-a49d043c2547",
          mal_id: "00000"
        });
        message.success("You just removed this character as your favourite character.");
      } else {
        jikanjs.loadCharacter(value).then(response => {
          console.log(response)
          let user = firebase.auth().currentUser;
          firebase
          .database()
          .ref("users/" + user.uid + "/favChar")
          .update({
            name: response.name,
            photoUrl: response.image_url,
            mal_id: response.mal_id
          });
          message.success("You just set " + this.$store.state.userList[this.$store.state.userdb.uid].favChar.name + " as your favourite character.");
        });
      }
    },
    increase(value) {
      if (this.currentEpisode === value) {
        this.currentEpisode + 0;
      } else {
        this.currentEpisode++;
      }
      let percent = this.percent + 100 / value;
      if (percent > 100) {
        percent = 100;
      }
      this.percent = percent;
    },
    decline(value) {
      if (this.currentEpisode === 0) {
        this.currentEpisode - 0;
      } else {
        this.currentEpisode--;
      }
      let percent = this.percent - 100 / value;
      if (percent < 0) {
        percent = 0;
      }
      this.percent = percent;
    },
    afterClose() {
      this.loading = true;
    },
    showModal(value) {
      setTimeout(() => {
        this.loading = false;
      }, 1500);
      this.visible = true;
      this.modal.id = value;
      if (this.searchType === "anime") {
        jikanjs.loadAnime(this.modal.id).then(response => {
          console.log(response); // eslint-disable-line
          this.modal.name = response.title;
          this.modal.japanese = response.title_japanese;
          this.modal.img = response.image_url;
          this.modal.synopsis = response.synopsis;
          this.modal.genres = response.genres;
          this.modal.embed = response.trailer_url;
        });
      }
      if (this.searchType === "character") {
        jikanjs.loadCharacter(this.modal.id).then(response => {
          console.log(response); // eslint-disable-line
          this.modal.name = response.name;
          this.modal.japanese = response.name_kanji;
          this.modal.img = response.image_url;
          this.modal.synopsis = response.about;
          this.modal.genres = response.genres;
          this.modal.embed = response.trailer_url;
          this.modal.animeography = response.animeography;
        });
      }
    },
    handleOk() {
      this.visible = false;
      this.loading = true;
    },
    handleChange(value) {
      this.searchType = value;
    },
    onSearch(value) {
      (this.animeResults = ""),
        (this.searchValue = value),
        (this.show = false),
        (this.isShowingTop = false),
        (this.isLoading = true),
        setTimeout(() => {
          (this.isLoading = false),
            jikanjs.search(this.searchType, value).then(response => {
              console.log(response); // eslint-disable-line
              response.results.forEach(element => {
                this.animeResults = response.results;
              });
            });
          this.show = true;
        }, 4000);
    }
  },
};
</script>

<style lang="scss" scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

.loader {
  -webkit-animation: scale-up-center 0.4s cubic-bezier(0.39, 0.575, 0.565, 1)
    infinite alternate;
  animation: scale-up-center 0.4s cubic-bezier(0.39, 0.575, 0.565, 1) infinite
    alternate;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
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

.video_wrapper {
  margin-top: 25px;
  position: relative;
  padding-bottom: 56.25%; /* 16:9, for an aspect ratio of 1:1 change to this value to 100% */
}
iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>
