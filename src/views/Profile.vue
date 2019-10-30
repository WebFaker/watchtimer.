<template>
  <div style="display: flex; justify-content: center; align-items: center; flex-direction: column; align-items: center;">
    <a-alert v-if="$store.state.user.emailVerified === false" :message="`You must verify your email : ` + $store.state.user.email + `, before using this website properly.`" banner />
    <a-card style="position: relative; width: 75%; min-width: 320px;">
        <a-button v-if="!isEdit" style="position: absolute; top: 24px; right: 32px;" @click="toggleEdit">
          <a-icon type="edit" />
        </a-button>
        <a-button v-if="isEdit" style="position: absolute; top: 24px; right: 32px;" @click="toggleEdit">
          <a-icon type="close" />
        </a-button>
        <h2>My profile</h2>
        <div class="profile_main">
          <div class="profile_main_img-container">
            <div class="profile_main_img-container-inside">
              <a-tooltip placement="bottom">
                <template slot="title">
                  <span>Favorite character : {{ favChar.name }}</span>
                </template>
                <img style="width: 60px; height: 60px; object-fit: cover; border-radius: 100%; position: absolute; bottom: 0; right: 0;" :src="favChar.image_url" alt="">
              </a-tooltip>
              <img v-if="imageData == null" class="profile_main_img" :src="$store.state.userdb.photoURL" :alt="$store.state.userdb.displayName">
              <img v-if="imageData != null && previewURL" :src="previewURL" class="profile_main_img">
            </div>
            <div v-if="isEdit">
              <input id="uploadIMG" type="file" @change="previewImage" accept="image/*">
              <a-progress :percent="uploadValue" />
            </div>
            <button v-if="imageData != null" @click="cancelUpload">
              Cancel
            </button>
          </div>
          <div class="profile_main_informations">
            <p style="font-weight: bold;" v-if="!isEdit">{{ $store.state.userdb.displayName }}</p>
            <p style="white-space: pre-wrap" v-if="!isEdit">{{ $store.state.userdb.bio }}</p>
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
                      rules: [{ required: true, message: 'Please input a Nickname !' }],
                      initialValue: $store.state.userdb.displayName
                    },
                  ]"
                  placeholder="Nickname"
                >
                  <a-icon slot="prefix" type="user" style="color: rgba(0,0,0,.25)" />
                </a-input>
              </a-form-item>
              <a-form-item label="Bio">
                <a-textarea
                  v-decorator="[
                    'bio',
                    {
                      initialValue: $store.state.userdb.bio
                    },
                  ]"
                  placeholder="Nickname"
                >
                  <a-icon slot="prefix" type="user" style="color: rgba(0,0,0,.25)" />
                </a-textarea>
              </a-form-item>
              <a-button v-if="isEdit" @click="onUpload" type="primary" html-type="submit">Update profile</a-button>
            </a-form>
            <a-button v-if="isEdit" @click="deleteAccount" type="danger">Delete this account</a-button>
          </div>
        </div>
    </a-card>
  </div>
</template>

<script>
import firebase from "firebase"
import { message } from 'ant-design-vue'
const jikanjs = require("jikanjs");

export default {
  data() {
		return {
      headers: {
          authorization: 'authorization-text',
      },
      
      isEdit: false,
      isNicknameEdit: false,
      imageData: null,
      picture: null,
      uploadValue: 0,
      previewURL: "",
      favChar: ""
		}
  },
  beforeCreate () {
    this.bform = this.$form.createForm(this, { name: "edit" })
    if (this.$store.state.userdb.favChar) {
      jikanjs.loadCharacter(this.$store.state.userdb.favChar)
      .then(response => {
        this.favChar = response
      })
      .catch((err) => {
        console.error(err); // in case a error happens
      });
    }
  },
	methods: {
    toggleEdit() {
      if (this.isEdit === false) {
        this.isEdit = true
      } else {
        this.isEdit = false
      }
    },
    deleteAccount() {
      var user = firebase.auth().currentUser;
      user.delete()
      .then(function() {
        firebase.database().ref("users").child(user.uid).remove()
        message.success("Your account has just been deleted")
        window.location.href = "./"
      })
      .catch(function(error) {
        message.error(error.message)
      });
    },
    changeNickname() {
      this.isEdit = false;
      var user = firebase.auth().currentUser;
      let username = this.bform.getFieldValue("nickname")
      user.updateProfile({
        displayName: username,
      }).then(function() {
        firebase.database().ref("users/" + user.uid).update({
          displayName: username,
        }, function(error) {
          if (error) {
            message.error(error.message)
          } else {
            message.success("profil mis à jour enculé")
          }
        });
        // Update successful.
      }).catch(function(error) {
        console.log(error)
        // An error happened.
        message.error('Oops, ' + error.message)
      });
    },
    handleSubmit(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values); // eslint-disable-line
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
    previewImage(event) {
      this.uploadValue = 0;
      this.picture = null;
      this.imageData = event.target.files[0];
      this.previewURL = URL.createObjectURL(event.target.files[0]);
    },
    cancelUpload() {
      this.imageData = null
      document.getElementById("uploadIMG").value = "";
    },
    onUpload(){
      this.picture = null;
      let user = firebase.auth().currentUser;
      let username = this.bform.getFieldValue("nickname");
      let bio = this.bform.getFieldValue("bio");
      if (this.imageData !== null) {
        const storageRef=firebase.storage().ref(`${this.imageData.name}`).put(this.imageData);
        storageRef.on(`state_changed`,snapshot=>{
          this.uploadValue = (snapshot.bytesTransferred/snapshot.totalBytes)*100;
        }, error=>{console.log(error.message)},
        ()=>{this.uploadValue=100;
          storageRef.snapshot.ref.getDownloadURL().then((url)=>{
            this.picture = url;
            user.updateProfile({
              displayName: username,
              photoURL: url
            }).then(function() {
              firebase.database().ref("users/" + user.uid).update({
                displayName: username,
                photoURL: url,
                bio: bio
              });
              // Update successful.
              window.location.href = './'
            });
          });
        });
      } else {
        user.updateProfile({
          displayName: username,
        }).then(function() {
          firebase.database().ref("users/" + user.uid).update({
            displayName: username,
            bio: bio
          });
          // Update successful.
          window.location.href = './profile'
        });
      }
    }
	},
  mounted() {}
}
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