<template>
  <div>
    <div v-if="isLoading === true" style="width: 100%; height: calc(100vh - 92px); display: flex; justify-content: center; align-items: center;">
      <a-spin>
        <a-icon slot="indicator" type="loading" style="font-size: 24px; color: #ffd500; font-size: 48px;" spin />
      </a-spin>
    </div>
    <div v-if="isLoading === false" style="display: flex; justify-content: center; align-items: center; flex-direction: column;">
      <a-card class="main-card">
        <div style="display: flex; align-items: flex-start; justify-content: space-between;">
          <div style="display: flex; width: 100%;">
            <img class="anime_img" :src="animeInfos.image_url" alt="">
            <div style="margin-left: 10px; width: 100%;">
              <h2 style="display: flex; align-items: center; margin-bottom: 0;">
                <span><span style="margin-right: 5px;">{{ animeInfos.title }}</span><a-tag v-if="animeInfos.airing === true" color="#ffd500">{{ animeInfos.status }}</a-tag><a-tag v-else color="#008000">{{ animeInfos.status }}</a-tag></span>
              </h2>
              <p style="margin-top: 5px; margin-bottom: 5px;">{{ animeInfos.title_japanese }}</p>
              <div class="mobile" style="margin-top: 5px; margin-bottom: 5px;">
                <a-tag class="button-div_tags_item" v-for="(genre, g) in animeInfos.genres" :key="g">{{ genre.name }}</a-tag>
              </div>
              <p><a-icon type="eye" /> {{ animeInfos.episodes ||'?' }} episode<span v-if="animeInfos.episodes > 1">s</span> to watch</p>
              <a-collapse class="desktop" style="width: 100%" :bordered="false">
                <a-collapse-panel header="Synopsis (Click to expand)" key="1">
                  <p>{{ animeInfos.synopsis }}</p>
                </a-collapse-panel>
              </a-collapse>
            </div>
          </div>
          <div class="button-div">
            <div class="button-div_inside">
              <a-button
                style="display: flex; align-items: center;"
                v-if="$store.state.userdb.uid"
              >
                <a-icon type="eye" /><span class="desktop"> Watchlist</span>
              </a-button>
              <a-button
                style="display: flex; align-items: center;"
                class="button-div_button"
                v-if="$store.state.userdb.uid"
              >
                <a-icon type="heart" /><span class="desktop"> Favorite</span>
              </a-button>
            </div>
            <div class="button-div_tags desktop">
              <a-tag class="button-div_tags_item" v-for="(genre, g) in animeInfos.genres" :key="g">{{ genre.name }}</a-tag>
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
              <p>{{ animeInfos.synopsis }}</p>
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
          <p style="margin-top: 25px;"><a-icon type="question" /> Source : {{ animeInfos.source }}</p>
        </div>
      </a-card>
    </div>
  </div>
</template>

<script>
const jikanjs = require("jikanjs");
export default {
  name: "anime",
  data() {
    return {
      animeInfos: {},
      name: 'Coucou',
      isLoading: true
    }
  },
  head: {
    title: function () {
      return {
        inner: `Watchtimer. | Anime page`
      }
    },
    // Meta tags
    meta: [
      { name: 'application-name', content: `Watchtimer. | Anime page` },
      { name: 'description', content: `See this anime page on Watchtimer.`, id: 'desc' }, // id to replace intead of create element
      // ...
      // Twitter
      { property: 'twitter:card', content: 'summary_large_image' },
      { property: 'twitter:title', content: `Watchtimer. | Anime page` },
      { property: 'twitter:url', content: 'https://watch-timer.web.app' },
      // with shorthand
      { p: 'twitter:description', c: `See this anime page on Watchtimer.`},
      { p: 'twitter:image', content: 'https://firebasestorage.googleapis.com/v0/b/watch-timer.appspot.com/o/Splash.jpg?alt=media&token=3110bf05-5eb3-45b1-aca3-0a8d25389d8e' },
      // ...
      // Google+ / Schema.org
      { itemprop: 'name', content: `Watchtimer. | Anime page` },
      { itemprop: 'description', content: `See this anime page on Watchtimer.` },
      // ...
      // Facebook / Open Graph
      { property: 'og:type', content: 'website' },
      { property: 'fb:app_id', content: '123456789' },
      { property: 'og:url', content: 'https://watch-timer.web.app' },
      { property: 'og:title', content: `Watchtimer. | Anime page` },
      // with shorthand
      { p: 'og:image', c: 'https://firebasestorage.googleapis.com/v0/b/watch-timer.appspot.com/o/Splash.jpg?alt=media&token=3110bf05-5eb3-45b1-aca3-0a8d25389d8e' },
      // ...
    ],
  },
  mounted() {

  },
  beforeCreate() {
    jikanjs.loadAnime(this.$route.params.id).then(response => {
      this.animeInfos = response
      console.log(response)
      this.isLoading = false
    });
  }
}
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
      width: calc(229.78px + 5px);
    }
    &_inside {
      display: flex;
      align-items: center;
      flex-direction: column;
      width: auto;
      @media (min-width: 768px) {
        min-width: calc(229.78px + 5px);
        height: 32px;
        flex-direction: row;
      }
    }
    &_button {
      margin-top: 5px;
      margin-left: 0px;
      @media (min-width: 768px) {
        margin-top: 0;
        margin-left: 5px;
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