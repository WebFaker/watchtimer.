<template>
  <div class="home">
    <div v-if="fullLoad" class="fullLoad">
      <img class="loader fullLoad_img" src="@/assets/eye.png" alt="" />
    </div>
    <h1 style="margin-top: 50px; text-align: center;">Watchtimer.</h1>
    <a-input-group style="text-align: center;" compact>
      <a-select
        style="width: 130px;"
        defaultValue="anime"
        @change="handleChange"
      >
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
    <div
      style="display: flex; justify-content: center; align-items: center; flex-direction: column;"
    >
      <a-card class="main-card" style="margin-top: 50px;" v-if="show">
        <h2 style="text-align: center;">
          Results for :
          <span style="font-weight: bolder;">{{ searchValue }}</span>
        </h2>
        <div
          v-if="show"
          main-card_noMargin
          style="display: flex; flex-wrap: wrap; justify-content: center;"
        >
          <a-list
            style="width: 100%;"
            itemLayout="vertical"
            :dataSource="animeResults"
          >
            <div slot="footer">
              <b>You didn't found what you want ?</b> Try to be more accurate !
              <a-icon type="smile" />
            </div>
            <a-list-item
              @click="showModal(item.mal_id)"
              slot="renderItem"
              slot-scope="item"
              style="cursor: pointer"
            >
              <template
                v-if="isLogged === 'true' && searchType == 'character'"
                slot="actions"
              >
                <span
                  @click.stop="toggleFav(item.mal_id)"
                  v-if="searchType == 'character'"
                >
                  <a-icon
                    v-if="
                      $store.state.userList[$store.state.userdb.uid].favChar
                        .mal_id == item.mal_id && isAdding == false
                    "
                    style="color: #ff0000;"
                    twoToneColor="FF0000"
                    type="heart"
                    theme="filled"
                  />
                  <a-spin style="height: 18px;" v-if="isAdding == true">
                    <a-icon
                      slot="indicator"
                      type="loading"
                      style="color: #ff0000; font-size: 12px;"
                      spin
                    />
                  </a-spin>
                  <a-icon
                    v-if="
                      $store.state.userList[$store.state.userdb.uid].favChar
                        .mal_id !== item.mal_id && isAdding == false
                    "
                    style="color: #ff0000;"
                    twoToneColor="FF0000"
                    type="heart"
                    theme="twoTone"
                  />
                  <span class="desktop">
                    Favorite
                  </span>
                </span>
              </template>
              <template
                v-if="isLogged === 'true' && searchType == 'anime'"
                slot="actions"
              >
                <span v-if="searchType == 'anime'">
                  <a-icon type="heart" />
                  <span class="desktop">
                    Favorite
                  </span>
                </span>
                <span @click.stop="addAnime(item)">
                  <a-icon
                    v-if="
                      isLogged === 'true' &&
                        Object.keys(
                          $store.state.userList[$store.state.userdb.uid]
                            .watchedAnimes
                        ).includes('anime' + item.mal_id) === false &&
                        isAdding == false
                    "
                    @click.stop="addAnime(item)"
                    style="color: #ffd500; font-size: 16px;"
                    twoToneColor="ffd500"
                    type="eye"
                    theme="twoTone"
                  />
                  <a-spin style="height: 18px;" v-if="isAdding == true">
                    <a-icon
                      slot="indicator"
                      type="loading"
                      style="color: #ffd500; font-size: 12px;"
                      spin
                    />
                  </a-spin>
                  <a-icon
                    v-if="
                      isLogged === 'true' &&
                        Object.keys(
                          $store.state.userList[$store.state.userdb.uid]
                            .watchedAnimes
                        ).includes('anime' + item.mal_id) === true &&
                        isAdding == false
                    "
                    style="color: #ffd500; font-size: 16px;"
                    twoToneColor="ffd500"
                    type="eye"
                    theme="filled"
                  />
                  <span class="desktop">
                    Watchlist
                  </span>
                </span>
                <span v-if="item.episodes">
                  <a-icon
                    v-if="
                      isLogged === 'true' &&
                        Object.keys(
                          $store.state.userList[$store.state.userdb.uid]
                            .watchedAnimes
                        ).includes('anime' + item.mal_id) === true &&
                        isAdding == false &&
                        $store.state.userList[$store.state.userdb.uid]
                          .watchedAnimes['anime' + item.mal_id].watched ==
                          item.episodes
                    "
                    @click.stop="addAnimeFinished(item)"
                    style="color: #008000; font-size: 16px;"
                    type="check-circle"
                  />
                  <a-icon
                    v-else
                    @click.stop="addAnimeFinished(item)"
                    style="font-size: 16px;"
                    type="check-circle"
                  />
                  <span class="desktop">
                    Finished
                  </span>
                </span>
              </template>
              <img
                slot="extra"
                class="main-card_img"
                :alt="item.title"
                :src="item.image_url"
              />
              <a-list-item-meta>
                <p
                  v-if="searchType == 'anime'"
                  class="ant-list-item-meta-title"
                  slot="title"
                >
                  {{ item.title }}
                  <a-tag class="button-div_tags_item">{{ item.rated }}</a-tag>
                </p>
                <p
                  v-if="searchType == 'character'"
                  class="ant-list-item-meta-title"
                  slot="title"
                >
                  {{ item.name }}
                </p>
                <p v-if="searchType == 'anime'" slot="description">
                  {{ item.episodes || "?" }} episode<span
                    v-if="item.episodes !== 1"
                    >s</span
                  >
                  to watch
                </p>
                <p
                  v-if="
                    searchType == 'character' &&
                      item.alternative_names.length !== 0
                  "
                  slot="description"
                >
                  Also knowned as :
                  <span v-for="name in item.alternative_names" :key="name">
                    {{ name }},
                  </span>
                  ...
                </p>
              </a-list-item-meta>
              <span v-if="searchType == 'anime'">
                {{ item.synopsis || "There is no synopsis for this anime..." }}
              </span>
            </a-list-item>
          </a-list>
          <!-- <a-card
            :value="i.mal_id"
            @click="showModal(i.mal_id)"
            v-for="(i, e) in animeResults"
            :key="e"
            hoverable
            class="anime-card"
          >
            <div v-if="searchType == 'anime'">
              <a-icon
                v-if="isLogged === 'true' && Object.keys($store.state.userList[$store.state.userdb.uid].watchedAnimes).includes('anime' + i.mal_id) === false && isAdding == false"
                @click.stop="addAnime(i)"
                style="color: red; position: absolute; top: 5px; right: 5px; font-size: 20px;"
                twoToneColor="FF0000"
                type="heart"
                theme="twoTone"
              />
              <a-spin
                v-if="isLogged === 'true' && isAdding == true"
                style="position: absolute; top: 5px; right: 5px;"
              >
                <a-icon slot="indicator" type="loading" style="font-size: 24px; color: #ffd500; font-size: 20px;" spin />
              </a-spin>
              <a-icon
                v-if="isLogged === 'true' && Object.keys($store.state.userList[$store.state.userdb.uid].watchedAnimes).includes('anime' + i.mal_id) === true && isAdding == false"
                @click.stop="addAnime(i)"
                style="color: red; position: absolute; top: 5px; right: 5px; font-size: 20px;"
                twoToneColor="FF0000"
                type="heart"
                theme="filled"
              />
            </div>
            <div v-if="searchType == 'character'">
              <a-icon v-if="isLogged === 'true' && $store.state.userList[$store.state.userdb.uid].favChar.mal_id == i.mal_id" @click.stop="toggleFav(i.mal_id)" style="color: red; position: absolute; top: 5px; right: 5px; font-size: 20px;" twoToneColor="FF0000" type="heart" theme="filled" />
              <a-icon v-if="isLogged === 'true' && $store.state.userList[$store.state.userdb.uid].favChar.mal_id !== i.mal_id" @click.stop="toggleFav(i.mal_id)" style="color: red; position: absolute; top: 5px; right: 5px; font-size: 20px;" twoToneColor="FF0000" type="heart" theme="twoTone" />
            </div>
            <img
              class="anime-card_img"
              :src="i.image_url"
              :alt="i.title"
              slot="cover"
            />
          </a-card> -->
        </div>
      </a-card>
    </div>
    <a-modal
      :afterClose="afterClose"
      :title="modal.name"
      v-model="visible"
      @ok="handleOk"
    >
      <template slot="footer">
        <a-button disabled>
          <span style="display: flex; align-items: center;">
            <a-icon type="heart" />
            <span style="margin-left: 5px;" class="desktop">
              Favorite
            </span>
          </span>
        </a-button>
        <a-button @click.stop="addAnime(modal)">
          <span style="display: flex; align-items: center;">
            <a-icon
              v-if="
                isLogged === 'true' &&
                  Object.keys(
                    $store.state.userList[$store.state.userdb.uid].watchedAnimes
                  ).includes('anime' + modal.mal_id) === true
              "
              style="color: #ffd500; font-size: 16px;"
              type="eye"
              theme="filled"
            />
            <a-icon v-else style="font-size: 16px; color: #ffd500" type="eye" />
            <span
              v-if="
                isLogged === 'true' &&
                  Object.keys(
                    $store.state.userList[$store.state.userdb.uid].watchedAnimes
                  ).includes('anime' + modal.mal_id) === true
              "
              style="margin-left: 5px;"
              class="desktop"
            >
              Added
            </span>
            <span v-else style="margin-left: 5px;" class="desktop">
              Watchlist
            </span>
          </span>
        </a-button>
        <a-button
          v-if="modal.airing == false"
          @click.stop="addAnimeFinished(modal)"
        >
          <span style="display: flex; align-items: center;">
            <a-icon
              v-if="
                isLogged === 'true' &&
                  Object.keys(
                    $store.state.userList[$store.state.userdb.uid].watchedAnimes
                  ).includes('anime' + modal.mal_id) === true &&
                  isAdding == false &&
                  $store.state.userList[$store.state.userdb.uid].watchedAnimes[
                    'anime' + modal.mal_id
                  ].watched == modal.episodes
              "
              style="color: #008000; font-size: 16px;"
              type="check-circle"
              theme="filled"
            />
            <a-icon
              v-else
              style="color: #008000; font-size: 16px;"
              type="check-circle"
            />
            <span style="margin-left: 5px;" class="desktop">
              Finished
            </span>
          </span>
        </a-button>
      </template>
      <a-skeleton active :loading="loading">
        <div class="modal_container">
          <div style="display: flex; align-items: center;">
            <div style="max-width: 50%; position: relative;">
              <img style="width: 100%;" :src="modal.img" :alt="modal.name" />
            </div>
            <div style="margin-left: 10px;" class="modal_titles">
              <h3>
                {{ modal.name }}
                <a-tag v-if="modal.airing === true" color="#ffd500">{{
                  modal.status
                }}</a-tag
                ><a-tag v-else color="#008000">{{ modal.status }}</a-tag>
              </h3>
              <p style="color: grey; font-size: 12px;">{{ modal.japanese }}</p>
              <div>
                <a-tag
                  style="margin-bottom: 8px;"
                  v-for="(genre, g) in modal.genres"
                  :key="g"
                  >{{ genre.name }}</a-tag
                >
              </div>
              <div v-if="searchType == 'anime'">
                <router-link
                  class="desktop"
                  :to="`/anime/` + modal.mal_id"
                  target="_blank"
                >
                  <a-button style="margin-top: 5px;" size="small"
                    ><a-icon type="question-circle" /> More details</a-button
                  >
                </router-link>
                <router-link class="mobile" :to="`/anime/` + modal.mal_id">
                  <a-button style="margin-top: 5px;" size="small">
                    <a-icon type="question-circle" /> More details
                  </a-button>
                </router-link>
              </div>
            </div>
          </div>
          <div class="modal_informations">
            <p
              style="margin-top: 25px; margin-bottom: 0;"
              v-if="modal.broadcast"
            >
              <a-icon type="calendar" /> Broadcast : {{ modal.broadcast }}
            </p>
            <div
              v-if="searchType === 'anime' && modal.embed !== null"
              class="video_wrapper"
            >
              <iframe
                :src="modal.embed"
                width="100%"
                height="100%"
                frameborder="0"
                rel="0"
                modestbranding="1"
                allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen
              />
            </div>
            <a-collapse
              v-if="searchType === 'anime'"
              style="margin-top: 25px;"
              :bordered="false"
            >
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
                <p v-for="(anime, h) in modal.animeography" :key="h">
                  {{ anime.name }}
                </p>
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
          <a-button
            v-if="isLogged === 'true'"
            size="small"
            style="position: absolute; top: 5px; right: 5px;"
            @click.stop="addAnime(top)"
          >
            <a-icon
              v-if="
                Object.keys(
                  $store.state.userList[$store.state.userdb.uid].watchedAnimes
                ).includes('anime' + top.mal_id) === false && isAdding == false
              "
              style="color: #ffd500; font-size: 20px;"
              twoToneColor="ffd500"
              type="eye"
            />
            <a-spin v-if="isAdding == true">
              <a-icon
                slot="indicator"
                type="loading"
                style="font-size: 24px; color: #ffd500; font-size: 20px;"
                spin
              />
            </a-spin>
            <a-icon
              v-if="
                Object.keys(
                  $store.state.userList[$store.state.userdb.uid].watchedAnimes
                ).includes('anime' + top.mal_id) === true && isAdding == false
              "
              style="color: #ffd500; font-size: 20px;"
              twoToneColor="ffd500"
              type="eye"
              theme="filled"
            />
          </a-button>
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
              <span>
                <div class="icon-wrapper">
                  <a-icon type="frown-o" />
                  <a-slider
                    disabled
                    :tipFormatter="formatter"
                    :min="0"
                    :max="10"
                    v-model="top.score"
                    :step="0.01"
                  />
                  <a-icon type="smile-o" />
                </div>
              </span>
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
import moment from "moment";
import firebase from "firebase";
import { message } from "ant-design-vue";

export default {
  name: "home",
  data() {
    return {
      // Page Load
      fullLoad: true,

      isLogged: localStorage.isLogged,

      isAdding: false,

      percent: 0,
      currentEpisode: 0,

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
        mal_id: "",
        airing: "",
        status: "",
        synopsis: "",
        genres: "",
        embed: "",
        animeography: "",
        broadcast: ""
      }
    };
  },
  beforeMount() {
    (this.isShowingTop = true),
      (this.isLoading = false),
      jikanjs.loadTop("anime").then(response => {
        this.topResults = response.top;
        this.fullLoad = false;
      });
  },
  mounted() {
    this.favCharId = this.$store.state.userList[
      this.$store.state.userdb.uid
    ].favChar.mal_id;
  },
  methods: {
    formatter(value) {
      return "Score : " + value + "/10";
    },
    addAnime(value) {
      if (
        Object.keys(
          this.$store.state.userList[this.$store.state.userdb.uid].watchedAnimes
        ).includes("anime" + value.mal_id) === false
      ) {
        this.isAdding = true;
        jikanjs.loadAnime(value.mal_id).then(response => {
          let user = firebase.auth().currentUser;
          var title = response.title;
          firebase
            .database()
            .ref(
              "users/" +
                user.uid +
                "/watchedAnimes/" +
                "anime" +
                response.mal_id
            )
            .update({
              stopWatch: false,
              lastSeen: moment().format(),
              type: response.type,
              airing: response.airing,
              name: response.title,
              episodes: response.episodes,
              photoUrl: response.image_url,
              mal_id: response.mal_id,
              watched: 0
            })
            .then(function() {
              message.success(
                "You just added " + title + " to your watchlist."
              );
            });
          this.isAdding = false;
        });
      } else {
        this.isAdding = true;
        firebase
          .database()
          .ref()
          .child(
            "users/" +
              this.$store.state.userdb.uid +
              "/watchedAnimes/" +
              "anime" +
              value.mal_id
          )
          .remove()
          .then(function() {
            message.success(
              "You just removed " + value.title + " of your watchlist."
            );
          });
        this.isAdding = false;
      }
    },
    addAnimeFinished(value) {
      if (
        Object.keys(
          this.$store.state.userList[this.$store.state.userdb.uid].watchedAnimes
        ).includes("anime" + value.mal_id) === false
      ) {
        this.isAdding = true;
        jikanjs.loadAnime(value.mal_id).then(response => {
          let user = firebase.auth().currentUser;
          var title = response.title;
          firebase
            .database()
            .ref(
              "users/" +
                user.uid +
                "/watchedAnimes/" +
                "anime" +
                response.mal_id
            )
            .update({
              stopWatch: false,
              lastSeen: moment().format(),
              type: response.type,
              airing: response.airing,
              name: response.title,
              episodes: response.episodes,
              photoUrl: response.image_url,
              mal_id: response.mal_id,
              watched: response.episodes
            })
            .then(function() {
              message.success(
                "You just added " + title + " to your finished animes."
              );
            });
          this.isAdding = false;
        });
      } else if (
        Object.keys(
          this.$store.state.userList[this.$store.state.userdb.uid].watchedAnimes
        ).includes("anime" + value.mal_id) === true &&
        this.$store.state.userList[this.$store.state.userdb.uid].watchedAnimes[
          "anime" + value.mal_id
        ].watched !== value.episodes
      ) {
        this.isAdding = true;
        jikanjs.loadAnime(value.mal_id).then(response => {
          let user = firebase.auth().currentUser;
          var title = response.title;
          firebase
            .database()
            .ref(
              "users/" +
                user.uid +
                "/watchedAnimes/" +
                "anime" +
                response.mal_id
            )
            .update({
              lastSeen: moment().format(),
              watched: response.episodes
            })
            .then(function() {
              message.success(
                "You just added " + title + " to your finished animes."
              );
            });
          this.isAdding = false;
        });
      } else {
        this.isAdding = true;
        firebase
          .database()
          .ref(
            "users/" +
              this.$store.state.userdb.uid +
              "/watchedAnimes/" +
              "anime" +
              value.mal_id
          )
          .update({
            lastSeen: moment().format(),
            watched: 0
          })
          .then(function() {
            message.success(
              "You just removed " + value.title + " of your finished animes ."
            );
          });
        this.isAdding = false;
      }
    },
    toggleFav(value) {
      if (
        this.$store.state.userList[this.$store.state.userdb.uid].favChar
          .mal_id === value
      ) {
        let user = firebase.auth().currentUser;
        firebase
          .database()
          .ref("users/" + user.uid + "/favChar")
          .update({
            name: "nobody",
            photoUrl:
              "https://firebasestorage.googleapis.com/v0/b/watch-timer.appspot.com/o/18436.png?alt=media&token=68807595-a777-4c67-a16f-a49d043c2547",
            mal_id: "00000"
          });
        message.success(
          "You just removed this character as your favourite character."
        );
      } else {
        jikanjs.loadCharacter(value).then(response => {
          console.log(response);
          let user = firebase.auth().currentUser;
          firebase
            .database()
            .ref("users/" + user.uid + "/favChar")
            .update({
              name: response.name,
              photoUrl: response.image_url,
              mal_id: response.mal_id
            });
          message.success(
            "You just set " +
              this.$store.state.userList[this.$store.state.userdb.uid].favChar
                .name +
              " as your favourite character."
          );
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
      (this.modal.name = ""),
        (this.modal.japanese = ""),
        (this.modal.img = ""),
        (this.modal.mal_id = ""),
        (this.modal.broadcast = "");
      this.modal.airing = "";
      this.modal.status = "";
      (this.modal.synopsis = ""),
        (this.modal.genres = ""),
        (this.modal.embed = ""),
        (this.modal.animeography = "");
    },
    showModal(value) {
      this.loading = true;
      this.visible = true;
      this.modal.mal_id = value;
      if (this.searchType === "anime") {
        jikanjs.loadAnime(this.modal.mal_id).then(response => {
          console.log(response); // eslint-disable-line
          this.modal.name = response.title;
          this.modal.japanese = response.title_japanese;
          this.modal.img = response.image_url;
          this.modal.synopsis = response.synopsis;
          this.modal.genres = response.genres;
          this.modal.embed = response.trailer_url;
          this.modal.broadcast = response.broadcast;
          this.modal.airing = response.airing;
          this.modal.status = response.status;
          this.loading = false;
        });
      }
      if (this.searchType === "character") {
        jikanjs.loadCharacter(this.modal.mal_id).then(response => {
          console.log(response); // eslint-disable-line
          this.modal.name = response.name;
          this.modal.japanese = response.name_kanji;
          this.modal.img = response.image_url;
          this.modal.synopsis = response.about;
          this.modal.genres = response.genres;
          this.modal.embed = response.trailer_url;
          this.modal.animeography = response.animeography;
          this.loading = false;
        });
      }
    },
    handleOk() {
      this.visible = false;
      this.loading = true;
    },
    handleChange(value) {
      this.searchType = value;
      this.show = false;
      this.isShowingTop = true;
    },
    onSearch(value) {
      (this.animeResults = ""),
        (this.searchValue = value),
        (this.show = false),
        (this.isShowingTop = false),
        (this.isLoading = true),
        jikanjs.search(this.searchType, value).then(response => {
          console.log(response); // eslint-disable-line
          response.results.forEach(element => {
            this.animeResults = response.results;
          });
          this.show = true;
          this.isLoading = false;
        });
    }
  }
};
</script>

<style lang="scss">
.ant-slider-disabled {
  cursor: default;
}
.ant-slider-disabled .ant-slider-track {
  background-color: #ffd500 !important;
}
.ant-slider-disabled .ant-slider-handle,
.ant-slider-disabled .ant-slider-dot {
  cursor: default;
}
</style>

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

.fullLoad {
  position: fixed;
  top: 0;
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

.video_wrapper {
  margin-top: 5px;
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

.icon-wrapper {
  position: relative;
  padding: 0px 30px;
}

.icon-wrapper .anticon {
  position: absolute;
  top: -2px;
  width: 16px;
  height: 16px;
  line-height: 1;
  font-size: 16px;
  color: rgba(0, 0, 0, 0.25);
}

.icon-wrapper .anticon:first-child {
  left: 0;
}

.icon-wrapper .anticon:last-child {
  right: 0;
}
</style>
