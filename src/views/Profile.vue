<template>
  <div
    style="display: flex; justify-content: center; align-items: center; flex-direction: column; align-items: center;"
  >
    <a-alert
      v-if="$store.state.user.emailVerified === false && $store.state.user.uid === $route.params.id"
      :message="
        'You must verify your email : ' +
          $store.state.user.email +
          ', before using this website properly.'
      "
      banner
    />
    <router-link v-if="$store.state.user.uid !== $route.params.id" to="/friends" style="width: 100%; padding: 0 30px 50px;">
      <a-icon type="left" /> Back to users list
    </router-link>
    <a-card style="position: relative; width: 75%; min-width: 320px;">
      <div v-if="$store.state.user.uid === $route.params.id">
        <a-button
          v-if="!isEdit"
          style="position: absolute; top: 24px; right: 32px;"
          @click="toggleEdit"
        >
          <a-icon type="edit" />
        </a-button>
        <a-button
          v-if="isEdit"
          style="position: absolute; top: 24px; right: 32px;"
          @click="toggleEdit"
        >
          <a-icon type="close" />
        </a-button>
      </div>
      <div v-if="$store.state.user.uid !== $route.params.id">
        <a-button 
          v-if="Object.keys($store.state.userdb.friends.following).includes($route.params.id) == false" 
          @click.stop="addFriend($route.params.id)" 
          style="position: absolute; top: 24px; right: 32px;"
          type="primary"
        >
          <a-icon type="user-add" /> Follow
        </a-button>        
        <a-button
          v-if="Object.keys($store.state.userdb.friends.following).includes($route.params.id) == true" 
          @click.stop="removeFriend($route.params.id)" 
          style="position: absolute; top: 24px; right: 32px;" 
          type="danger"
        >
          <a-icon type="user-delete" /> Unfollow
        </a-button>
      </div>
      <h2 v-if="$store.state.user.uid === $route.params.id">My profile</h2>
      <h2 v-else>{{ $store.state.userList[$route.params.id].displayName }}'s profile</h2>
      <div class="profile_main">
        <div class="profile_main_img-container">
          <div class="profile_main_img-container-inside">
            <a-tooltip placement="bottom">
              <template slot="title">
                <span>Favorite character : {{ favCharName }}</span>
              </template>
              <img
                v-if="!isEdit && favCharImg !== '' && favCharImg !== undefined"
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
            <img
              v-if="imageData != null && previewURL"
              :src="previewURL"
              class="profile_main_img"
            />
          </div>
          <div v-if="isEdit">
            <input
              id="uploadIMG"
              type="file"
              @change="previewImage"
              accept="image/*"
            />
            <a-progress :percent="uploadValue" />
          </div>
          <button v-if="imageData != null" @click="cancelUpload">
            Cancel
          </button>
        </div>
        <div class="profile_main_informations">
          <div style="display: flex; align-items: center;">
            <p style="font-weight: bold; margin-bottom: 0;" v-if="!isEdit">
              {{ $store.state.userList[$route.params.id].displayName }}
            </p>
            <img
              v-if="!isEdit && $store.state.user.emailVerified"
              style="width: 15px; margin-left: 5px;"
              src="@/assets/checked.svg"
              alt="User Approved"
            />
          </div>
          <div v-if="!isEdit" style="display: flex; height: 100%; flex-direction: column; justify-content: space-between;">
            <div>
              <div style="display: flex;">
                <router-link :to="`${$route.params.id}/${'following'}`" style="margin: 0 5px 0 0;">Following : <span style="font-weight: bold">{{ Object.keys(this.$store.state.userList[this.$route.params.id].friends.following).length - 1 }}</span></router-link>
                <router-link :to="`${$route.params.id}/${'followed'}`">Followed : <span style="font-weight: bold">{{ Object.keys(this.$store.state.userList[this.$route.params.id].friends.followed).length - 1 }}</span></router-link>
              </div>
              <p style="white-space: pre-wrap; margin-top: 1em;">
                {{ $store.state.userList[$route.params.id].bio }}
              </p>
            </div>
            <p style="margin: 0; font-size: 12px;">Created at {{ $store.state.userList[$route.params.id].createdAt }}</p>
          </div>
          <a-form
            v-if="isEdit"
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
            <a-form-item label="Bio">
              <a-textarea
                v-decorator="[
                  'bio',
                  {
                    initialValue: $store.state.userdb.bio
                  }
                ]"
                placeholder="Nickname"
              >
                <a-icon
                  slot="prefix"
                  type="user"
                  style="color: rgba(0,0,0,.25)"
                />
              </a-textarea>
            </a-form-item>
            <a-button
              v-if="isEdit"
              @click="onUpload"
              type="primary"
              html-type="submit"
            >
              Update profile
            </a-button>
          </a-form>
          <a-button v-if="isEdit" @click="deleteAccount" type="danger">
            Delete this account
          </a-button>
        </div>
      </div>
    </a-card>
  </div>
</template>

<script>
import firebase from "firebase";
import { message } from "ant-design-vue";

export default {
  data() {
    return {
      headers: {
        authorization: "authorization-text"
      },

      isEdit: false,
      isNicknameEdit: false,
      imageData: null,
      picture: null,
      uploadValue: 0,
      previewURL: "",
      favCharName: "",
      favCharImg: ""
    };
  },
  beforeCreate() {
    this.bform = this.$form.createForm(this, { name: "edit" });
  },
  methods: {
    // Follow / Unfollow System
    addFriend(value) {
      var userID = firebase.auth().currentUser.uid;
      firebase
        .database()
        .ref().child("users/" + value + "/friends/followed/" + userID)
        .set(userID)
      firebase
        .database()
        .ref().child("users/" + userID + "/friends/following/" + value)
        .set(value)
        .catch(function(error) {
          console.error(error);
        });
        console.log(value)
    },
    removeFriend(value) {
      var userID = firebase.auth().currentUser.uid;
      firebase
        .database()
        .ref().child("users/" + userID + "/friends/following/" + value)
        .remove()
      firebase
        .database()
        .ref().child("users/" + value + "/friends/followed/" + userID)
        .remove()
    },

    // Editing profile
    toggleEdit() {
      if (this.isEdit === false) {
        this.isEdit = true;
      } else {
        this.isEdit = false;
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
          message.loading("Your account has just been deleted, returning to home page...");
          setTimeout(() => {
            window.location.href = "./";
          }, 3000)
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
                      bio: bio
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
                bio: bio
              });
            // Update successful.
            window.location.reload(false);
          });
      }
    }
  },
  mounted() {
    this.favCharName = this.$store.state.userList[this.$route.params.id].favChar.name
    this.favCharImg = this.$store.state.userList[this.$route.params.id].favChar.photoUrl
  }
};
</script>

<style lang="scss" scoped>
img.preview {
  width: 200px;
}

.profile {
  &_main {
    display: flex;
    &_img {
      width: 150px;
      height: 150px;
      object-fit: cover;
      border-radius: 100%;
      &-container {
        display: flex;
        flex-direction: column;
        &-inside {
          position: relative;
        }
      }
    }
    &_informations {
      margin-left: 25px;
      width: 100%;
    }
  }
}
</style>
