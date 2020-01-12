<template>
  <div>
    <div
      v-if="isLoading === true"
      style="width: 100%; height: calc(100vh - 92px); display: flex; justify-content: center; align-items: center;"
    >
      <a-spin>
        <a-icon
          slot="indicator"
          type="loading"
          style="font-size: 24px; color: #ffd500; font-size: 48px;"
          spin
        />
      </a-spin>
    </div>
    <div
      v-if="isLoading === false"
      style="display: flex; justify-content: center; align-items: center; flex-direction: column;"
    >
      <a-card class="main-card">
        <div
          style="display: flex; align-items: flex-start; justify-content: space-between;"
        >
          <div style="display: flex; width: 100%;">
            <img class="anime_img" :src="animeInfos.image_url" alt="" />
            <div style="margin: 0 10px; width: 100%;">
              <h2 style="display: flex; align-items: center; margin-bottom: 0;">
                <span
                  ><span style="margin-right: 5px;">{{ animeInfos.title }}</span
                  ><a-tag v-if="animeInfos.airing === true" color="#ffd500">{{
                    animeInfos.status
                  }}</a-tag
                  ><a-tag v-else color="#008000">{{
                    animeInfos.status
                  }}</a-tag></span
                >
              </h2>
              <p style="margin-top: 5px; margin-bottom: 5px;">
                {{ animeInfos.title_japanese }}
              </p>
              <div class="mobile" style="margin-top: 5px; margin-bottom: 5px;">
                <a-tag
                  class="button-div_tags_item"
                  v-for="(genre, g) in animeInfos.genres"
                  :key="g"
                  >{{ genre.name }}</a-tag
                >
              </div>
              <p>
                <a-icon type="eye" />
                {{ animeInfos.episodes || "?" }} episode<span
                  v-if="animeInfos.episodes > 1"
                  >s</span
                >
                to watch
              </p>
              <p class="desktop">{{ animeInfos.synopsis }}</p>
            </div>
          </div>
          <div class="button-div">
            <div class="button-div_tags desktop">
              <a-tag
                class="button-div_tags_item"
                v-for="(genre, g) in animeInfos.genres"
                :key="g"
                >{{ genre.name }}</a-tag
              >
            </div>
            <div class="video_wrapper desktop" style="width: 100%">
              <iframe
                :src="animeInfos.trailer_url"
                width="100%"
                height="100%"
                frameborder="0"
                rel="0"
                modestbranding="1"
                allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen
              />
            </div>
          </div>
        </div>
        <div class="synopsis" style="margin-top: 10px;">
          <a-collapse class="mobile" :bordered="false">
            <a-collapse-panel header="Synopsis (Click to expand)" key="1">
              <p class="mobile">{{ animeInfos.synopsis }}</p>
            </a-collapse-panel>
          </a-collapse>
          <div class="video_wrapper mobile" style="width: 100%">
            <iframe
              :src="animeInfos.trailer_url"
              width="100%"
              height="100%"
              frameborder="0"
              rel="0"
              modestbranding="1"
              allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen
            />
          </div>
          <p style="margin-top: 25px;">
            <a-icon type="question" /> Source : {{ animeInfos.source }}
          </p>
        </div>
        <template class="ant-card-actions" slot="actions">
          <a-button
            @click.stop="addAnime(animeInfos)"
            style="display: flex; align-items: center;"
            class="button-div_button"
            v-if="$store.state.userdb.uid"
          >
            <a-icon
              v-if="
                Object.keys(
                  $store.state.userList[$store.state.userdb.uid].watchedAnimes
                ).includes('anime' + [$route.params.id]) === true
              "
              style="color: #ffd500; font-size: 16px;"
              type="eye"
              theme="filled"
            />
            <a-icon v-else style="font-size: 16px; color: #ffd500" type="eye" />
            <span
              v-if="
                Object.keys(
                  $store.state.userList[$store.state.userdb.uid].watchedAnimes
                ).includes('anime' + [$route.params.id]) === true
              "
              class="desktop"
            >
              Added
            </span>
            <span class="desktop" v-else>Watchlist</span>
          </a-button>
          <a-button
            disabled
            style="display: flex; align-items: center;"
            class="button-div_button"
            v-if="$store.state.userdb.uid"
          >
            <a-icon type="heart" /><span class="desktop"> Favorite</span>
          </a-button>
          <a-button
            style="display: flex; align-items: center;"
            class="button-div_button"
            v-if="$store.state.userdb.uid"
          >
            <a-icon type="check-circle" /><span class="desktop"> Finished</span>
          </a-button>
        </template>
        <div class="button-div_inside"></div>
      </a-card>
      <a-card style="margin-top: 50px;" class="main-card">
        <h2>Comments :</h2>
        <a-comment v-for="(comment, f) in $store.state.comments['anime' + $route.params.id]" :key="f">
          <template slot="actions">
            <span>
              <a-tooltip title="Like">
                <a-icon type="like" />
              </a-tooltip>
              <span style="padding-left: '8px';cursor: 'auto'">
                {{ comment.likes }}
              </span>
            </span>
            <span>
              <a-tooltip title="Dislike">
                <!-- :theme="action === 'disliked' ? 'filled' : 'outlined'" -->
                <a-icon
                  type="dislike"
                />
              </a-tooltip>
              <span style="padding-left: '8px';cursor: 'auto'">
                {{ comment.dislikes }}
              </span>
            </span>
            <span>Reply to</span>
          </template>
          <a slot="author">{{ $store.state.userList[comment.uid].displayName }}</a>
          <a-avatar
            :src="$store.state.userList[comment.uid].photoURL"
            :alt="$store.state.userList[comment.uid].displayName"
            slot="avatar"
          />
          <p slot="content">
            {{ comment.message }}
          </p>
          <a-tooltip slot="datetime" :title="moment().format('YYYY-MM-DD HH:mm:ss')">
            <span>{{moment().fromNow()}}</span>
          </a-tooltip>
          <a-comment style="margin-left: 50px;" v-for="(reply, g) in comment.replies" :key="g">
            <template slot="actions">
              <span>
                <a-tooltip title="Like">
                  <a-icon type="like" />
                </a-tooltip>
                <span style="padding-left: '8px';cursor: 'auto'">
                  {{ reply.likes }}
                </span>
              </span>
              <span>
                <a-tooltip title="Dislike">
                  <!-- :theme="action === 'disliked' ? 'filled' : 'outlined'" -->
                  <a-icon
                    type="dislike"
                  />
                </a-tooltip>
                <span style="padding-left: '8px';cursor: 'auto'">
                  {{ reply.dislikes }}
                </span>
              </span>
            </template>
            <a slot="author">{{ $store.state.userList[reply.uid].displayName }}</a>
            <a-avatar
              :src="$store.state.userList[reply.uid].photoURL"
              :alt="$store.state.userList[reply.uid].displayName"
              slot="avatar"
            />
            <p slot="content">
              {{ reply.message }}
            </p>
            <a-tooltip slot="datetime" :title="moment().format('YYYY-MM-DD HH:mm:ss')">
              <span>{{moment().fromNow()}}</span>
            </a-tooltip>
          </a-comment>
        </a-comment>
      </a-card>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import firebase from "firebase";
import { message } from "ant-design-vue";
const jikanjs = require("jikanjs");
export default {
  name: "anime",
  data() {
    return {
      animeInfos: {},
      name: "Coucou",
      isLoading: true
    };
  },
  head: {
    title: function() {
      return {
        inner: `Watchtimer. | Anime page`
      };
    },
    // Meta tags
    meta: [
      { name: "application-name", content: `Watchtimer. | Anime page` },
      {
        name: "description",
        content: `See this anime page on Watchtimer.`,
        id: "desc"
      }, // id to replace intead of create element
      // ...
      // Twitter
      { property: "twitter:card", content: "summary_large_image" },
      { property: "twitter:title", content: `Watchtimer. | Anime page` },
      { property: "twitter:url", content: "https://watch-timer.web.app" },
      // with shorthand
      { p: "twitter:description", c: `See this anime page on Watchtimer.` },
      {
        p: "twitter:image",
        content:
          "https://firebasestorage.googleapis.com/v0/b/watch-timer.appspot.com/o/Splash.jpg?alt=media&token=3110bf05-5eb3-45b1-aca3-0a8d25389d8e"
      },
      // ...
      // Google+ / Schema.org
      { itemprop: "name", content: `Watchtimer. | Anime page` },
      {
        itemprop: "description",
        content: `See this anime page on Watchtimer.`
      },
      // ...
      // Facebook / Open Graph
      { property: "og:type", content: "website" },
      { property: "fb:app_id", content: "123456789" },
      { property: "og:url", content: "https://watch-timer.web.app" },
      { property: "og:title", content: `Watchtimer. | Anime page` },
      // with shorthand
      {
        p: "og:image",
        c:
          "https://firebasestorage.googleapis.com/v0/b/watch-timer.appspot.com/o/Splash.jpg?alt=media&token=3110bf05-5eb3-45b1-aca3-0a8d25389d8e"
      }
      // ...
    ]
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
            watched: 0
          })
          .then(function() {
            message.success(
              "You just removed " + value.title + " of your finished animes ."
            );
          });
        this.isAdding = false;
      }
    }
  },
  computed: {
    ...mapGetters({
      comments: "comments"
    })
  },
  mounted() {
    console.log(this.comments)
    // console.log(this.$store.state.comments['anime' + this.$route.params.id])
  },
  beforeCreate() {
    jikanjs.loadAnime(this.$route.params.id).then(response => {
      this.animeInfos = response;
      console.log(response);
      this.isLoading = false;
    });
  }
};
</script>

<style lang="scss" scoped>
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

.anime {
  &_img {
    width: 100px;
    object-fit: contain;
    object-position: 50% 0;
    @media (min-width: 768px) {
      width: 250px;
    }
    @media (min-width: 1024px) {
      width: auto;
    }
  }
}
.button {
  &-div {
    display: flex;
    align-items: center;
    flex-direction: column;
    width: 46px;
    @media (min-width: 768px) {
      width: 30%;
    }
    &_inside {
      display: flex;
      align-items: center;
      width: auto;
      flex-direction: row;
    }
    &_button {
      @media (min-width: 768px) {
        margin-top: 0;
        margin-right: 5px;
      }
    }
    &_tags {
      display: flex;
      flex-wrap: wrap;
      justify-content: flex-end;
      margin-top: 10px;
      &_items {
        margin-right: 0;
        @media (min-width: 768px) {
          margin-top: 0;
          margin-left: 5px;
        }
      }
    }
  }
}
</style>
