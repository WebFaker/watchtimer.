<template>
  <div
    style="display: flex; justify-content: center; align-items: center; flex-direction: column;"
  >
    <a-modal v-model="detailsVisible" :title="detailsModal.title">
      <template slot="footer">
        <a-button disabled>
          <span style="display: flex; align-items: center;">
            <a-icon type="heart" />
            <span style="margin-left: 5px;" class="desktop">
              Favorite
            </span>
          </span>
        </a-button>
        <a-button @click.stop="addAnime(detailsModal)">
          <span style="display: flex; align-items: center;">
            <a-icon
              v-if="
                Object.keys(
                  $store.state.userList[$store.state.userdb.uid].watchedAnimes
                ).includes('anime' + detailsModal.mal_id) === true
              "
              style="color: #ffd500; font-size: 16px;"
              type="eye"
              theme="filled"
            />
            <a-icon v-else style="font-size: 16px; color: #ffd500" type="eye" />
            <span style="margin-left: 5px;" class="desktop">
              Watchlist
            </span>
          </span>
        </a-button>
        <a-button
          v-if="detailsModal.airing == false"
          @click.stop="addAnimeFinished(detailsModal)"
        >
          <span style="display: flex; align-items: center;">
            <a-icon
              v-if="
                Object.keys(
                  $store.state.userList[$store.state.userdb.uid].watchedAnimes
                ).includes('anime' + detailsModal.mal_id) === true &&
                  isAdding == false &&
                  $store.state.userList[$store.state.userdb.uid].watchedAnimes[
                    'anime' + detailsModal.mal_id
                  ].watched == detailsModal.episodes
              "
              style="color: #008000; font-size: 16px;"
              type="check-circle"
              theme="filled"
            />
            <a-icon v-else style="font-size: 16px;" type="check-circle" />
            <span style="margin-left: 5px;" class="desktop">
              Finished
            </span>
          </span>
        </a-button>
      </template>
      <a-skeleton active :loading="loading">
        <div>
          <div style="display: flex; align-items: flex-start;">
            <div style="max-width: 50%;">
              <img
                style="width: 100%;"
                :src="detailsModal.image_url"
                :alt="detailsModal.title"
              />
            </div>
            <div style="margin-left: 10px;">
              <h3>
                {{ detailsModal.title }}
                <a-tag v-if="detailsModal.airing === true" color="#ffd500">{{
                  detailsModal.status
                }}</a-tag
                ><a-tag v-else color="#008000">{{ detailsModal.status }}</a-tag>
              </h3>
              <router-link
                class="desktop"
                :to="`/anime/` + detailsModal.mal_id"
                target="_blank"
              >
                <a-button style="margin-top: 5px;" size="small"
                  ><a-icon type="question-circle" /> More details</a-button
                >
              </router-link>
              <router-link class="mobile" :to="`/anime/` + detailsModal.mal_id">
                <a-button style="margin-top: 5px;" size="small"
                  ><a-icon type="question-circle" /> More details</a-button
                >
              </router-link>
            </div>
          </div>
          <div
            v-if="
              Object.keys(
                $store.state.userList[$store.state.userdb.uid].watchedAnimes
              ).includes('anime' + detailsModal.mal_id) === true
            "
          >
            <span>
              <a-progress
                v-if="detailsModal.episodes"
                style="width: 100%;"
                :percent="
                  ($store.state.userList[$store.state.userdb.uid].watchedAnimes[
                    'anime' + detailsModal.mal_id
                  ].watched /
                    detailsModal.episodes) *
                    100
                "
                :format="() => ''"
              />
              <span>
                {{
                  $store.state.userList[$store.state.userdb.uid].watchedAnimes[
                    "anime" + detailsModal.mal_id
                  ].watched
                }}
              </span>
              / {{ detailsModal.episodes || "?" }}
            </span>
            <div style="margin-top: 10px; display: flex; align-items: center;">
              <a-input-search
                placeholder="What episode are you in ?"
                @search="changeWatched"
                type="number"
                onkeypress="return event.charCode >= 48 && event.charCode <= 57"
              >
                <a-button slot="enterButton">
                  <a-icon type="edit" />
                </a-button>
              </a-input-search>
              <a-button icon="minus" @click.stop="decline(detailsModal)" />
              <a-button icon="plus" @click.stop="increase(detailsModal)" />
            </div>
          </div>
        </div>
      </a-skeleton>
    </a-modal>
    <a-card class="main-card" style="margin-top: 10px;">
      <h2>
        <span v-if="$route.params.id === $store.state.userdb.uid"
          >My animes</span
        ><span v-else
          >{{ $store.state.userList[$route.params.id].displayName }}'s
          animes</span
        >
        ({{
          Object.keys($store.state.userList[$route.params.id].watchedAnimes)
            .length - 1
        }})
      </h2>
      <div class="main-card_noMargin" style="display: flex; flex-wrap: wrap;">
        <div
          style="width: 100%;"
          v-if="
            Object.keys(
              this.$store.state.userList[this.$route.params.id].watchedAnimes
            ).length == 1
          "
        >
          <p>
            Oops,
            <span v-if="$route.params.id === $store.state.userdb.uid"
              >you have</span
            ><span v-else
              ><span style="font-weight: bold">{{
                $store.state.userList[$route.params.id].displayName
              }}</span>
              has</span
            >
            not added any animes yet.
          </p>
          <a-button
            v-if="$route.params.id === $store.state.userdb.uid"
            @click="$router.push('/')"
            style="margin-bottom: 1em"
            type="primary"
            >Go add some !</a-button
          >
          <img
            style="width: 100%;"
            src="https://media1.tenor.com/images/1f3e64eb5c24881b3d1b0c8cd54e4555/tenor.gif?itemid=11860845"
            alt=""
          />
        </div>
        <div
          class="anime-card_outside"
          v-else
          v-for="(anime, f) in orderedWatchedAnimes"
          :key="f"
        >
          <a-card
            @click="showDetails(anime.mal_id)"
            class="anime-card"
            v-if="anime !== 1"
            hoverable
            style="position: relative; cursor: pointer;"
          >
            <a-button
              @click.stop="addAnime(anime)"
              size="small"
              style="position: absolute; top: 5px; right: 5px;"
            >
              <a-icon
                v-if="
                  Object.keys(
                    $store.state.userList[$store.state.userdb.uid].watchedAnimes
                  ).includes('anime' + anime.mal_id) === false &&
                    isAdding == false
                "
                style="color: #ffd500; font-size: 20px;"
                twoToneColor="ffd500"
                type="eye"
              />
              <a-spin v-if="isAdding == true">
                <a-icon
                  slot="indicator"
                  type="loading"
                  style="color: #ffd500; font-size: 16px;"
                  spin
                />
              </a-spin>
              <a-icon
                v-if="
                  Object.keys(
                    $store.state.userList[$store.state.userdb.uid].watchedAnimes
                  ).includes('anime' + anime.mal_id) === true &&
                    isAdding == false
                "
                style="color: #ffd500; font-size: 20px;"
                twoToneColor="ffd500"
                type="eye"
                theme="filled"
              />
            </a-button>
            <div style="width: 100%; position: absolute; bottom: 0px;">
              <a-tag style="margin: 5px">
                {{
                  $store.state.userList[$route.params.id].watchedAnimes[
                    "anime" + anime.mal_id
                  ].watched
                }}
                / {{ anime.episodes || "?" }}
              </a-tag>
              <a-progress
                v-if="anime.airing === false"
                style="width: 100%;"
                :percent="
                  ($store.state.userList[$route.params.id].watchedAnimes[
                    'anime' + anime.mal_id
                  ].watched /
                    anime.episodes) *
                    100
                "
                :format="() => ''"
              />
            </div>
            <img
              class="anime-card_img"
              :src="anime.photoUrl"
              :alt="anime.name"
              slot="cover"
            />
          </a-card>
        </div>
      </div>
    </a-card>
  </div>
</template>

<script>
import Vue from "vue";
import firebase from "firebase";
import moment from "moment";
import { message } from "ant-design-vue";
const jikanjs = require("jikanjs");
export default {
  data() {
    return {
      isAdding: false,

      detailsVisible: false,
      detailsModal: {},
      loading: true
    };
  },
  methods: {
    addAnime(value) {
      if (
        Object.keys(
          this.$store.state.userList[this.$store.state.userdb.uid].watchedAnimes
        ).includes("anime" + value.mal_id) === false
      ) {
        this.isAdding = true;
        jikanjs.loadAnime(value.mal_id).then(response => {
          console.log(response);
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
              "You just removed " +
                (value.name || value.title) +
                " of your watchlist."
            );
          });
        this.isAdding = false;
      }
    },
    // Adding an anime as finished
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
    // See anime details modal
    showDetails(value) {
      console.log(value);
      this.loading = true;
      this.detailsVisible = true;
      jikanjs.loadAnime(value).then(response => {
        this.detailsModal = response;
        this.loading = false;
      });
    },
    // Increase and decline watched episodes value
    changeWatched(value) {
      if (
        this.detailsModal.episodes &&
        value !== (undefined || "") &&
        value <= this.detailsModal.episodes
      ) {
        firebase
          .database()
          .ref(
            "users/" +
              this.$store.state.userdb.uid +
              "/watchedAnimes/" +
              "anime" +
              this.detailsModal.mal_id
          )
          .update({
            lastSeen: moment().format(),
            watched: Number(value)
          });
      } else if (!this.detailsModal.episodes) {
        firebase
          .database()
          .ref(
            "users/" +
              this.$store.state.userdb.uid +
              "/watchedAnimes/" +
              "anime" +
              this.detailsModal.mal_id
          )
          .update({
            lastSeen: moment().format(),
            watched: Number(value)
          });
      } else {
        console.log("Oops");
      }
    },
    increase(value) {
      if (
        this.$store.state.userList[this.$store.state.userdb.uid].watchedAnimes[
          "anime" + value.mal_id
        ].watched < value.episodes
      ) {
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
            watched:
              this.$store.state.userList[this.$store.state.userdb.uid]
                .watchedAnimes["anime" + value.mal_id].watched + 1
          });
      } else {
        console.log("Oops");
      }
      let percent = this.percent + 100 / value;
      if (percent > 100) {
        percent = 100;
      }
      this.percent = percent;
    },
    decline(value) {
      if (
        this.$store.state.userList[this.$store.state.userdb.uid].watchedAnimes[
          "anime" + value.mal_id
        ].watched !== 0
      ) {
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
            watched: (this.$store.state.userList[
              this.$store.state.userdb.uid
            ].watchedAnimes["anime" + value.mal_id].watched -= 1)
          });
      } else {
        console.log("Oops");
      }
    }
  },
  computed: {
    orderedWatchedAnimes: function() {
      return Vue._.orderBy(
        this.$store.state.userList[this.$route.params.id].watchedAnimes,
        "name"
      );
    }
  }
};
</script>

<style></style>
