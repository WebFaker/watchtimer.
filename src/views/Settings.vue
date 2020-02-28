<template>
  <div style="display: flex; justify-content: center;">
    <a-card class="main-card">
      <div v-if="$store.state.userdb.uid">
        <a-button
          disabled
          v-if="!edit"
          style="position: absolute; top: 24px; right: 32px; z-index: 5;"
          @click="toggleEdit"
        >
          <a-icon type="edit" />
        </a-button>
        <a-button
          v-if="edit"
          style="position: absolute; top: 24px; right: 32px; z-index: 5;"
          @click="toggleEdit"
        >
          <a-icon type="close" />
        </a-button>
      </div>
      <div class="profile_main">
        <div class="profile_main_img-container">
          <div class="profile_main_img-container-inside">
            <img
              class="profile_main_img"
              :src="$store.state.userdb.photoURL"
              :alt="$store.state.userdb.displayName"
            />
          </div>
        </div>
        <div style="width: 100%;" class="profile_main_informations">
          <div style="display: flex; align-items: center;">
            <p style="margin-bottom: 0;" v-if="!edit">
              <span style="font-weight: bold;">
                {{ $store.state.userdb.displayName }}
              </span>
            </p>
            <img
              v-if="!edit && $store.state.user.emailVerified"
              style="width: 15px; margin: 0 5px;"
              src="@/assets/checked.svg"
              alt="User Approved"
            />
          </div>
          <p v-if="!edit">{{ $store.state.userdb.email }}</p>
          <a-form
            v-if="edit"
            id="components-form-demo-reset"
            :form="form"
            class="login-form"
          >
            <a-form-item label="E-mail">
              <a-input
                v-decorator="[
                  'email',
                  {
                    rules: [
                      {
                        required: true,
                        message: 'Please input a Nickname !'
                      }
                    ],
                    initialValue: $store.state.userdb.email
                  }
                ]"
                placeholder="E-mail"
              >
                <a-icon
                  slot="prefix"
                  type="mail"
                  style="color: rgba(0,0,0,.25)"
                />
              </a-input>
            </a-form-item>
            <a-form-item label="Password">
              <a-input
                placeholder="Password"
                v-decorator="[
                  'editPassword',
                  {
                    rules: [
                      {
                        required: true,
                        message: 'Please input your password!'
                      },
                      {
                        validator: validateToNextPassword
                      }
                    ]
                  }
                ]"
                type="password"
              >
                <a-icon
                  slot="prefix"
                  type="lock"
                  style="color: rgba(0,0,0,.25)"
                />
              </a-input>
            </a-form-item>
            <a-form-item label="Confirm password">
              <a-input
                placeholder="Confirm your password"
                v-decorator="[
                  'editConfirm',
                  {
                    rules: [
                      {
                        required: true,
                        message: 'Please confirm your password!'
                      },
                      {
                        validator: compareToFirstPassword
                      }
                    ]
                  }
                ]"
                type="password"
                @blur="handleConfirmBlur"
              >
                <a-icon
                  slot="prefix"
                  type="lock"
                  style="color: rgba(0,0,0,.25)"
                />
              </a-input>
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
          <a-button v-if="!edit" @click="deleteAccount" type="danger">
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
      edit: false
    };
  },
  beforeCreate() {
    this.form = this.$form.createForm(this, { name: "edit" });
  },
  methods: {
    toggleEdit() {
      if (this.edit == false) {
        this.edit = true;
      } else {
        this.edit = false;
      }
    },
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
    handleConfirmBlur(e) {
      const value = e.target.value;
      this.confirmDirty = this.confirmDirty || !!value;
    },
    compareToFirstPassword(rule, value, callback) {
      const form = this.form;
      if (value && value !== form.getFieldValue("editPassword")) {
        callback("Two passwords that you enter is inconsistent!");
      } else {
        callback();
      }
    },
    validateToNextPassword(rule, value, callback) {
      const form = this.form;
      if (value && this.confirmDirty) {
        form.validateFields(["editConfirm"], { force: true });
      }
      callback();
    },
    onUpload() {
      console.log("click");
    }
  }
};
</script>

<style lang="scss" scoped>
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
