<template>
  <div>
    <div v-if="this.$store.state.userdb.uid">
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
              <a-icon
                v-else
                style="font-size: 16px; color: #ffd500"
                type="eye"
              />
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
                    $store.state.userList[$store.state.userdb.uid]
                      .watchedAnimes['anime' + detailsModal.mal_id].watched ==
                      detailsModal.episodes
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
                  ><a-tag v-else color="#008000">{{
                    detailsModal.status
                  }}</a-tag>
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
                <router-link
                  class="mobile"
                  :to="`/anime/` + detailsModal.mal_id"
                >
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
                    ($store.state.userList[$store.state.userdb.uid]
                      .watchedAnimes['anime' + detailsModal.mal_id].watched /
                      detailsModal.episodes) *
                      100
                  "
                  :format="() => ''"
                />
                <span>
                  {{
                    $store.state.userList[$store.state.userdb.uid]
                      .watchedAnimes["anime" + detailsModal.mal_id].watched
                  }}
                </span>
                / {{ detailsModal.episodes || "?" }}
              </span>
              <div
                style="margin-top: 10px; display: flex; align-items: center;"
              >
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
      <div
        style="display: flex; justify-content: center; align-items: center; flex-direction: column;"
      >
        <a-alert
          v-if="
            $store.state.user.emailVerified === false &&
              $store.state.userdb.uid === $route.params.id
          "
          :message="
            'You must verify your email : ' +
              $store.state.user.email +
              ', before using this website properly.'
          "
          banner
        />
        <a
          @click="$router.go(-1)"
          v-if="$store.state.userdb.uid !== $route.params.id"
          style="width: 100%; padding: 0 30px 50px;"
        >
          <a-icon type="left" /> Back
        </a>
        <a-card class="main-card">
          <div v-if="$store.state.userdb.uid === $route.params.id">
            <a-button
              v-if="!edit"
              style="position: absolute; top: 24px; right: 32px;"
              @click="toggleEdit"
            >
              <a-icon type="edit" />
            </a-button>
            <a-button
              v-if="edit"
              style="position: absolute; top: 24px; right: 32px;"
              @click="toggleEdit"
            >
              <a-icon type="close" />
            </a-button>
          </div>
          <div v-if="$store.state.userdb.uid !== $route.params.id">
            <a-button
              v-if="
                Object.keys(
                  $store.state.userList[$store.state.userdb.uid].friends
                    .following
                ).includes($route.params.id) == false
              "
              @click.stop="addFriend($route.params.id)"
              style="position: absolute; top: 24px; right: 32px;"
              type="primary"
            >
              <a-icon type="user-add" /> Follow
            </a-button>
            <a-button
              v-if="
                Object.keys(
                  $store.state.userList[$store.state.userdb.uid].friends
                    .following
                ).includes($route.params.id) == true
              "
              @click.stop="removeFriend($route.params.id)"
              style="position: absolute; top: 24px; right: 32px;"
              type="danger"
            >
              <a-icon type="user-delete" /> Unfollow
            </a-button>
          </div>
          <h2 v-if="$store.state.userdb.uid === $route.params.id">
            My profile
          </h2>
          <h2 v-else>
            {{ $store.state.userList[$route.params.id].displayName }}'s profile
          </h2>
          <div class="profile_main">
            <div class="profile_main_img-container">
              <div class="profile_main_img-container-inside">
                <a-tooltip placement="bottom">
                  <template slot="title">
                    <div
                      style="display: flex; justify-content: center; align-items: center;"
                    >
                      <span
                        >Favorite character :<br />{{
                          $store.state.userList[$route.params.id].favChar.name
                        }}</span
                      >
                      <a-button
                        style="margin-left: 15px;"
                        v-if="
                          $store.state.userdb.uid === $route.params.id &&
                            $store.state.userList[$route.params.id].favChar
                              .name !== 'nobody'
                        "
                        @click="removeCharacter"
                        size="small"
                        type="danger"
                        >Remove</a-button
                      >
                      <a-button
                        style="margin-left: 15px;"
                        v-if="
                          $store.state.userdb.uid === $route.params.id &&
                            $store.state.userList[$route.params.id].favChar
                              .name == 'nobody'
                        "
                        @click="$router.push('/')"
                        size="small"
                        type="primary"
                        >Add one</a-button
                      >
                    </div>
                  </template>
                  <img
                    v-if="
                      !edit &&
                        $store.state.userList[$route.params.id].favChar
                          .photoUrl !== 'undefined'
                    "
                    style="width: 60px; height: 60px; object-fit: cover; border-radius: 100%; position: absolute; bottom: 0; right: 0;"
                    :src="
                      $store.state.userList[$route.params.id].favChar.photoUrl
                    "
                    alt="Favorite character"
                  />
                </a-tooltip>
                <img
                  v-if="imageData == null"
                  class="profile_main_img"
                  :src="$store.state.userList[$route.params.id].photoURL"
                  :alt="$store.state.userList[$route.params.id].displayName"
                />
                <img
                  v-if="imageData != null && previewURL"
                  :src="previewURL"
                  class="profile_main_img"
                />
              </div>
              <div v-if="edit">
                <input
                  style="width: 100%"
                  id="uploadIMG"
                  type="file"
                  @change="previewImage"
                  accept="image/*"
                />
                <a-progress style="width: 100%;" :percent="uploadValue" />
              </div>
              <button v-if="imageData != null" @click="cancelUpload">
                Cancel
              </button>
            </div>
            <div class="profile_main_informations">
              <div style="display: flex; align-items: center;">
                <p style="margin-bottom: 0;" v-if="!edit">
                  <span style="font-weight: bold;">
                    {{ $store.state.userList[$route.params.id].displayName }}
                  </span>
                </p>
                <img
                  v-if="!edit && $store.state.user.emailVerified"
                  style="width: 15px; margin: 0 5px;"
                  src="@/assets/checked.svg"
                  alt="User Approved"
                />
                <span
                  v-if="$store.state.userdb.uid !== $route.params.id"
                  style="font-size: 12px;"
                >
                  (last logged
                  {{
                    moment(
                      $store.state.userList[$route.params.id].lastSigned
                    ).fromNow()
                  }})
                </span>
              </div>
              <div
                v-if="!edit"
                style="display: flex; height: 100%; flex-direction: column; justify-content: space-between;"
              >
                <div>
                  <div style="display: flex;">
                    <router-link :to="`${$route.params.id}/${'following'}`"
                      >Following :
                      <span style="font-weight: bold">{{
                        Object.keys(
                          this.$store.state.userList[this.$route.params.id]
                            .friends.following
                        ).length - 1
                      }}</span></router-link
                    >
                    <span style="margin: 0 5px;">|</span>
                    <router-link :to="`${$route.params.id}/${'followed'}`"
                      >Followers :
                      <span style="font-weight: bold">{{
                        Object.keys(
                          this.$store.state.userList[this.$route.params.id]
                            .friends.followed
                        ).length - 1
                      }}</span></router-link
                    >
                  </div>
                  <p style="white-space: pre-wrap; margin-top: 1em;">
                    <a-icon type="environment" />
                    {{ $store.state.userList[$route.params.id].location.country
                    }}<span
                      v-if="
                        $store.state.userList[$route.params.id].location
                          .other !== ''
                      "
                      >,
                      {{
                        $store.state.userList[$route.params.id].location.other
                      }}</span
                    >
                  </p>
                  <p style="white-space: pre-wrap; margin-top: 1em;">
                    {{ $store.state.userList[$route.params.id].bio }}
                  </p>
                </div>
                <p style="margin: 0; font-size: 12px;">
                  Created at
                  {{
                    moment(
                      $store.state.userList[$route.params.id].createdAt
                    ).format("MM/DD/YYYY")
                  }}
                </p>
              </div>
              <a-form
                v-if="edit"
                id="components-form-demo-reset"
                :form="bform"
                class="login-form"
                @submit="handleSubmit"
              >
                <a-form-item label="Nickname">
                  <a-input
                    v-decorator="[
                      'nickname',
                      {
                        rules: [
                          {
                            required: true,
                            message: 'Please input a Nickname !'
                          }
                        ],
                        initialValue: $store.state.userdb.displayName
                      }
                    ]"
                    placeholder="Nickname"
                  >
                    <a-icon
                      slot="prefix"
                      type="user"
                      style="color: rgba(0,0,0,.25)"
                    />
                  </a-input>
                </a-form-item>
                <a-form-item label="Location">
                  <div style="display: flex; align-items: center;">
                    <a-select
                      v-decorator="[
                        'country',
                        {
                          rules: [
                            {
                              required: false
                            }
                          ],
                          initialValue:
                            $store.state.userList[$store.state.userdb.uid]
                              .location.country
                        }
                      ]"
                      style="float: left; width: 50%"
                      showSearch
                    >
                      <a-select-option value="0">Somewhere</a-select-option>
                      <a-select-option v-for="d in orderedCountries" :key="d">{{
                        d
                      }}</a-select-option>
                    </a-select>
                    <a-input
                      v-decorator="[
                        'other',
                        {
                          rules: [
                            {
                              required: false
                            }
                          ],
                          initialValue:
                            $store.state.userList[$store.state.userdb.uid]
                              .location.other
                        }
                      ]"
                      placeholder="Want to be more accurate ?"
                      style="width: 50%"
                    >
                      <a-icon
                        slot="prefix"
                        type="environment"
                        style="color: rgba(0,0,0,.25)"
                      />
                    </a-input>
                  </div>
                </a-form-item>
                <a-form-item label="Bio">
                  <a-textarea
                    autosize
                    v-decorator="[
                      'bio',
                      {
                        initialValue: $store.state.userdb.bio
                      }
                    ]"
                    placeholder="Tell us more about you"
                  >
                    <a-icon
                      slot="prefix"
                      type="user"
                      style="color: rgba(0,0,0,.25)"
                    />
                  </a-textarea>
                </a-form-item>
                <a-button
                  v-if="edit"
                  @click="onUpload"
                  type="primary"
                  html-type="submit"
                >
                  Update profile
                </a-button>
              </a-form>
              <a-button v-if="edit" @click="deleteAccount" type="danger">
                Delete this account
              </a-button>
            </div>
          </div>
        </a-card>
        <a-card class="main-card" style="margin-top: 50px;">
          <h2>
            <span v-if="$route.params.id === $store.state.userdb.uid"
              >My animes</span
            ><span v-else
              >{{ $store.state.userList[$route.params.id].displayName }}'s
              animes</span
            >
            ({{
              Object.keys(
                this.$store.state.userList[this.$route.params.id].watchedAnimes
              ).length - 1
            }})
          </h2>
          <div
            class="main-card_noMargin"
            style="display: flex; flex-wrap: wrap;"
          >
            <div
              style="width: 100%;"
              v-if="
                Object.keys(
                  this.$store.state.userList[this.$route.params.id]
                    .watchedAnimes
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
                        $store.state.userList[$store.state.userdb.uid]
                          .watchedAnimes
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
                        $store.state.userList[$store.state.userdb.uid]
                          .watchedAnimes
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
    </div>
    <div
      v-else
      style="display: flex; align-items: center; justify-content: center; flex-direction: column;"
    >
      <a-card class="main-card">
        <h2>
          {{ $store.state.userList[$route.params.id].displayName }}'s profile
        </h2>
        <div class="profile_main">
          <div class="profile_main_img-container">
            <div class="profile_main_img-container-inside">
              <a-tooltip placement="bottom">
                <template slot="title">
                  <span>Favorite character : {{ favCharName }}</span>
                </template>
                <img
                  v-if="!edit && favCharImg !== '' && favCharImg !== undefined"
                  style="width: 60px; height: 60px; object-fit: cover; border-radius: 100%; position: absolute; bottom: 0; right: 0;"
                  :src="favCharImg"
                  alt="Favorite character"
                />
              </a-tooltip>
              <img
                v-if="imageData == null"
                class="profile_main_img"
                :src="$store.state.userList[$route.params.id].photoURL"
                :alt="$store.state.userList[$route.params.id].displayName"
              />
            </div>
          </div>
          <div class="profile_main_informations">
            <div style="display: flex; align-items: center;">
              <p style="margin-bottom: 0;">
                <span style="font-weight: bold;">{{
                  $store.state.userList[$route.params.id].displayName
                }}</span>
              </p>
            </div>
            <div
              style="display: flex; height: 100%; flex-direction: column; justify-content: space-between;"
            >
              <div>
                <div style="display: flex;">
                  <p style="margin: 0;">
                    Following :
                    <span style="font-weight: bold">{{
                      Object.keys(
                        $store.state.userList[$route.params.id].friends
                          .following
                      ).length - 1
                    }}</span>
                  </p>
                  <span style="margin: 0 5px;">|</span>
                  <p style="margin: 0;">
                    Followers :
                    <span style="font-weight: bold">{{
                      Object.keys(
                        $store.state.userList[$route.params.id].friends.followed
                      ).length - 1
                    }}</span>
                  </p>
                </div>
                <p style="white-space: pre-wrap; margin-top: 1em;">
                  {{ $store.state.userList[$route.params.id].bio }}
                </p>
              </div>
              <p style="margin: 0; font-size: 12px;">
                Created at
                {{
                  moment(
                    $store.state.userList[$route.params.id].createdAt
                  ).format("MM/DD/YYYY")
                }}
              </p>
            </div>
          </div>
        </div>
      </a-card>
      <a-card style="display: flex; align-items: center; margin-top: 50px;">
        <p style="margin-bottom: 5px;">
          You must log in or register to display
          <a-avatar
            style="margin-right: 5px;"
            :src="$store.state.userList[$route.params.id].photoURL"
          /><span style="font-weight: bolder;">{{
            $store.state.userList[$route.params.id].displayName
          }}</span
          >'s whole page.
        </p>
        <div style="margin-bottom: 10px;">
          <router-link to="/login">Go to Login/Register</router-link>
        </div>
        <img
          style="width: 100%;"
          src="https://media.giphy.com/media/zOsBDA2n43HPO/giphy.gif"
          alt=""
        />
      </a-card>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import firebase from "firebase";
import { message } from "ant-design-vue";
const jikanjs = require("jikanjs");
import countries from "@/json/countries.json";

export default {
  name: "Profile",
  data() {
    return {
      headers: {
        authorization: "authorization-text"
      },

      countries: countries,

      isAdding: false,

      detailsVisible: false,
      detailsModal: {},
      loading: true,

      edit: false,

      otherVerified: "somewhere",
      imageData: null,
      picture: null,
      uploadValue: 0,
      previewURL: "",
      favCharName: this.$store.state.userList[this.$route.params.id].favChar
        .name,
      favCharImg: this.$store.state.userList[this.$route.params.id].favChar
        .photoUrl
    };
  },
  head: {
    title: function() {
      return {
        inner:
          "Watchtimer. | " +
          this.$store.state.userList[this.$route.params.id].displayName +
          `'s profile`
      };
    },
    // Meta tags
    meta: function() {
      return [
        { name: "application-name", content: `Watchtimer. | Profile page` },
        {
          name: "description",
          content: `See this user's profile page on Watchtimer.`,
          id: "desc"
        }, // id to replace intead of create element
        // ...
        // Twitter
        { name: "twitter:title", content: `Watchtimer. | Profile page` },
        // with shorthand
        {
          n: "twitter:description",
          c: `See this user's profile page on Watchtimer.`
        },
        // ...
        // Google+ / Schema.org
        { itemprop: "name", content: `Watchtimer. | Profile page` },
        {
          itemprop: "description",
          content: `See this user's profile page on Watchtimer.`
        },
        // ...
        // Facebook / Open Graph
        { property: "fb:app_id", content: "123456789" },
        { property: "og:url", content: "https://watch-timer.web.app" },
        { property: "og:title", content: `Watchtimer. | Profile page` },
        // with shorthand
        {
          p: "og:image",
          c: `https://firebasestorage.googleapis.com/v0/b/watch-timer.appspot.com/o/Splash.jpg?alt=media&token=3110bf05-5eb3-45b1-aca3-0a8d25389d8e`
        }
        // ...
      ];
    }
  },
  beforeCreate() {
    this.imageData = null;
    this.bform = this.$form.createForm(this, { name: "edit" });
  },
  computed: {
    orderedCountries: function() {
      return Vue._.orderBy(this.countries);
    },
    orderedWatchedAnimes: function() {
      return Vue._.orderBy(
        this.$store.state.userList[this.$route.params.id].watchedAnimes,
        "name"
      );
    }
  },
  methods: {
    // See anime details modal
    showDetails(value) {
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
            watched: (this.$store.state.userList[
              this.$store.state.userdb.uid
            ].watchedAnimes["anime" + value.mal_id].watched -= 1)
          });
      } else {
        console.log("Oops");
      }
    },
    // Remove Favorite character
    removeCharacter() {
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
    },
    // Add or Remove anime from list
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
    },
    // Follow / Unfollow System
    addFriend(value) {
      var userID = firebase.auth().currentUser.uid;
      firebase
        .database()
        .ref()
        .child("users/" + value + "/friends/followed/" + userID)
        .set(userID);
      firebase
        .database()
        .ref()
        .child("users/" + userID + "/friends/following/" + value)
        .set(value)
        .catch(function(error) {
          console.error(error);
        });
      console.log(value);
    },
    removeFriend(value) {
      var userID = firebase.auth().currentUser.uid;
      firebase
        .database()
        .ref()
        .child("users/" + userID + "/friends/following/" + value)
        .remove();
      firebase
        .database()
        .ref()
        .child("users/" + value + "/friends/followed/" + userID)
        .remove();
    },

    // Editing profile
    toggleEdit() {
      if (this.edit == false) {
        this.edit = true;
      } else {
        this.edit = false;
      }
    },

    // Deleting account, may be moved later
    deleteAccount() {
      var user = firebase.auth().currentUser;
      user
        .delete()
        .then(function() {
          firebase
            .database()
            .ref("users")
            .child(user.uid)
            .remove();
          message.loading(
            "Your account has just been deleted, returning to home page..."
          );
          setTimeout(() => {
            window.location.href = "./";
          }, 3000);
        })
        .catch(function(error) {
          message.error(error.message);
        });
    },
    handleSubmit(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log("Received values of form: ", values); // eslint-disable-line
        }
      });
    },
    // handleChange(info) {
    //   if (info.file.status !== 'uploading') {
    //     console.log(info.file, info.fileList);
    //   }
    //   if (info.file.status === 'done') {
    //     this.$message.success(`${info.file.name} file uploaded successfully`);
    //   } else if (info.file.status === 'error') {
    //     this.$message.error(`${info.file.name} file upload failed.`);
    //   }
    // },

    // Uploading profile picture to firebase system
    previewImage(event) {
      this.uploadValue = 0;
      this.picture = null;
      this.imageData = event.target.files[0];
      this.previewURL = URL.createObjectURL(event.target.files[0]);
    },
    cancelUpload() {
      this.imageData = null;
      document.getElementById("uploadIMG").value = "";
    },
    onUpload() {
      this.picture = null;
      let user = firebase.auth().currentUser;
      let username = this.bform.getFieldValue("nickname");
      let bio = this.bform.getFieldValue("bio");
      let country = this.bform.getFieldValue("country");
      let other = this.bform.getFieldValue("other");
      if (this.imageData !== null) {
        const storageRef = firebase
          .storage()
          .ref(`${this.imageData.name}`)
          .put(this.imageData);
        storageRef.on(
          "state_changed",
          snapshot => {
            this.uploadValue =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          },
          error => {
            console.log(error.message);
          },
          () => {
            this.uploadValue = 100;
            storageRef.snapshot.ref.getDownloadURL().then(url => {
              this.picture = url;
              user
                .updateProfile({
                  displayName: username,
                  photoURL: url
                })
                .then(function() {
                  firebase
                    .database()
                    .ref("users/" + user.uid)
                    .update({
                      displayName: username,
                      photoURL: url,
                      bio: bio,
                      location: {
                        country: country,
                        other: other
                      }
                    });
                  // Update successful.
                  window.location.reload(false);
                });
            });
          }
        );
      } else {
        user
          .updateProfile({
            displayName: username
          })
          .then(function() {
            firebase
              .database()
              .ref("users/" + user.uid)
              .update({
                displayName: username,
                bio: bio,
                location: {
                  country: country,
                  other: other
                }
              });
            // Update successful.
            window.location.reload(false);
          });
      }
    }
  },
  mounted() {}
};
</script>

<style lang="scss">
.ant-progress-show-info .ant-progress-outer {
  padding: 0 5px;
  margin: 0;
}

.ant-progress-text {
  display: none;
}
</style>

<style lang="scss" scoped>
img.preview {
  width: 200px;
}

.profile {
  &_main {
    display: flex;
    flex-direction: column;
    @media (min-width: 768px) {
      flex-direction: row;
    }
    &_img {
      width: 150px;
      height: 150px;
      object-fit: cover;
      border-radius: 100%;
      &-container {
        display: flex;
        flex-direction: column;
        &-inside {
          width: 150px;
          margin-bottom: 10px;
          position: relative;
        }
      }
    }
    &_informations {
      width: 100%;
      margin-left: 0;
      @media (min-width: 768px) {
        margin-left: 25px;
      }
    }
  }
}
</style>
