<template>
  <div style="display: flex; justify-content: center; align-items: center; flex-direction: column; align-items: center;">
    <a-alert v-if="$store.state.user.emailVerified === false" :message="`You must verify your email : ` + $store.state.user.email + `, before using this website properly.`" banner />
    <a-card style="position: relative; width: 75%; min-width: 320px;">
        <a-button v-if="!isEdit" style="position: absolute; top: 10px; right: 10px;" @click="toggleEdit">
          <a-icon type="edit" />
        </a-button>
        <a-button v-if="isEdit" style="position: absolute; top: 10px; right: 10px;" @click="onUpload">
          <a-icon type="check" />
        </a-button>
        <h2>My profile</h2>
        <div class="profile_main">
          <img class="profile_main_img" :src="$store.state.userdb.photoURL" :alt="$store.state.userdb.displayName">
          <div v-if="isEdit">
            <div>
              <input type="file" @change="previewImage" accept="image/*" >
            </div>
            <div>
              <a-progress :percent="uploadValue" />
            </div>
            <div v-if="imageData!=null">
              <img v-if="previewURL" :src="previewURL" class="profile_main_img">
            </div>
          </div>
          <div class="profile_main_informations">
            <p v-if="!isEdit">{{ $store.state.userdb.displayName }}</p>
            <p v-if="!isEdit">{{ $store.state.userdb.bio }}</p>
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

export default {
  data() {
		return {
      isEdit: false,
      isNicknameEdit: false,
      imageData: null,
      picture: null,
      uploadValue: 0,
      previewURL: ""
		}
  },
  beforeCreate () {
    this.bform = this.$form.createForm(this, { name: "edit" })
  },
	methods: {
    toggleEdit() {
      this.isEdit = true
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
    previewImage(event) {
      this.uploadValue = 0;
      this.picture = null;
      this.imageData = event.target.files[0];
      this.previewURL = URL.createObjectURL(event.target.files[0]);
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
        });
      }
    }
	},
  mounted() {
    this.$store.dispatch('updateProfile')
    console.log(this.$store.state.user)
    console.log(this.$store.state.userdb)
  }
}
</script>

<style lang="scss" scoped>
img.preview {
  width: 200px;
}

.profile {
  &_main {
    display: flex;
    align-items: center;
    &_img {
      width: 150px;
      height: 150px;
      object-fit: cover;
      border-radius: 100%;
    }
    &_informations {
      margin-left: 25px;
    }
  }
}
</style>