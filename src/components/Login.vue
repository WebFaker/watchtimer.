<template>
  <a-card title="Watchtimer. - Login" style="width: 320px;">
    <a-form
      v-if="logStatus==='login'"
      id="components-form-demo-normal-login"
      :form="aform"
      class="login-form"
      @submit="handleSubmit"
    >
      <router-link to="/">
        <span>
          <a-icon type="left" /> Back to site
        </span>
      </router-link>
      <a-form-item label="E-mail">
        <a-input
          v-decorator="[
            'signInEmail',
            { rules: [{ required: true, message: 'Please input your email!' }] },
          ]"
          placeholder="Email"
        >
          <a-icon slot="prefix" type="mail" style="color: rgba(0,0,0,.25)" />
        </a-input>
      </a-form-item>
      <a-form-item label="Password">
        <a-input
          v-decorator="[
            'signInPassword',
            { rules: [{ required: true, message: 'Please input your password !' }] },
          ]"
          type="password"
          placeholder="Password"
        >
          <a-icon slot="prefix" type="lock" style="color: rgba(0,0,0,.25)" />
        </a-input>
      </a-form-item>
      <a-form-item>
        <a-button @click="toggleReset" type="link">
          Forgot password
        </a-button>
        <a-button @click="signIn" type="primary" html-type="submit" class="login-form-button">
          Log in
        </a-button>
        Or
        <a-button @click="toggleRegister" type="link">
          register now
        </a-button>
      </a-form-item>
    </a-form>
    <a-form
      v-if="logStatus==='register'"
      id="components-form-demo-register"
      :form="form"
      @submit="handleSubmit"
    >
      <span style="cursor: pointer;" @click="toggleLogin">
        <a-icon type="left" /> Login
      </span>
      <a-form-item label="Email">
        <a-input
          placeholder="Email"
          v-decorator="[
            'signUpEmail',
            {
              rules: [
                {
                  type: 'email',
                  message: 'The input is not valid E-mail!',
                },
                {
                  required: true,
                  message: 'Please input your E-mail!',
                },
              ],
            },
          ]"
        >
          <a-icon slot="prefix" type="mail" style="color: rgba(0,0,0,.25)" />
        </a-input>
      </a-form-item>
      <a-form-item label="Password">
        <a-input
          placeholder="Password"
          v-decorator="[
            'signUpPassword',
            {
              rules: [
                {
                  required: true,
                  message: 'Please input your password!',
                },
                {
                  validator: validateToNextPassword,
                },
              ],
            },
          ]"
          type="password"
        >
          <a-icon slot="prefix" type="lock" style="color: rgba(0,0,0,.25)" />
        </a-input>
      </a-form-item>
      <a-form-item label="Confirm password">
        <a-input
          placeholder="Confirm your password"
          v-decorator="[
            'confirm',
            {
              rules: [
                {
                  required: true,
                  message: 'Please confirm your password!',
                },
                {
                  validator: compareToFirstPassword,
                },
              ],
            },
          ]"
          type="password"
          @blur="handleConfirmBlur"
        >
          <a-icon slot="prefix" type="lock" style="color: rgba(0,0,0,.25)" />
        </a-input>
      </a-form-item>
      <a-form-item label="Nickname">
        <a-input
          placeholder="Nickname"
          v-decorator="[
            'signUpDisplayName',
            {
              rules: [{ required: true, message: 'Please input your nickname!', whitespace: true }],
            },
          ]"
        >
          <a-icon slot="prefix" type="user" style="color: rgba(0,0,0,.25)" />
        </a-input>
      </a-form-item>
      <a-form-item>
        <a-button @click="toggleReset" class="login-form-forgot" type="link">
          Forgot password
        </a-button>
        <a-button style="width: 100%;" @click="signUp" type="primary" html-type="submit" class="login-form-button">
          Register
        </a-button>
        Or
        <a-button @click="toggleLogin" type="link">
          log in
        </a-button>
      </a-form-item>
    </a-form>
    <a-form
      v-if="logStatus==='reset'"
      id="components-form-demo-reset"
      :form="bform"
      class="login-form"
      @submit="handleSubmit"
    >
      <span style="cursor: pointer;" @click="toggleLogin">
        <a-icon type="left" /> Login
      </span>
      <a-form-item label="Enter your email">
        <a-input
          v-decorator="[
            'resetEmail',
            { rules: [{ required: true, message: 'Please input your email!' }] },
          ]"
          placeholder="Enter your email address."
        >
          <a-icon slot="prefix" type="mail" style="color: rgba(0,0,0,.25)" />
        </a-input>
      </a-form-item>
      <a-form-item>
        <a-button @click="reset" type="primary" html-type="submit">
          Reset now !
        </a-button>
      </a-form-item>
    </a-form>
  </a-card>
</template>

<script>
import firebase from 'firebase'
import { message } from 'ant-design-vue'

export default {
  name: 'Login',
  data () {
    return {
      userLogged: false,
      logStatus: 'login',

      signUpDisplayName: '',
      signUpEmail: '',
      signUpPassword: '',

      signInEmail: '',
      signInPassword: '',

      resetEmail: ''
    }
  },
  beforeCreate () {
    this.form = this.$form.createForm(this, { name: 'register' })
    this.aform = this.$form.createForm(this, { name: 'normal_login' })
    this.bform = this.$form.createForm(this, { name: 'reset' })
  },
  methods: {
    toggleLogin () {
      this.logStatus = 'login'
    },
    toggleReset () {
      this.logStatus = 'reset'
    },
    toggleRegister () {
      this.logStatus = 'register'
    },
    handleConfirmBlur (e) {
      const value = e.target.value
      this.confirmDirty = this.confirmDirty || !!value
    },
    compareToFirstPassword (rule, value, callback) {
      const form = this.form
      if (value && value !== form.getFieldValue('signUpPassword')) {
        callback('Two passwords that you enter is inconsistent!')
      } else {
        callback()
      }
    },
    validateToNextPassword (rule, value, callback) {
      const form = this.form;
      if (value && this.confirmDirty) {
        form.validateFields(['confirm'], { force: true })
      }
      callback ();
    },
    signIn () {
      this.signInEmail = this.aform.getFieldValue('signInEmail')
      this.signInPassword = this.aform.getFieldValue('signInPassword')
      firebase.auth().signInWithEmailAndPassword(this.signInEmail, this.signInPassword)
      .then(function() {
        firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
        localStorage.isLogged = true
        window.location.href = './'
      })
      .catch(function(error) {
        message.error('Oops, ' + error.message)
      });
    },
    signUp() {
      var signUpEmail = this.form.getFieldValue('signUpEmail')
      var signUpPassword = this.form.getFieldValue('signUpPassword')
      let username = this.form.getFieldValue('signUpDisplayName')
      firebase.auth().createUserWithEmailAndPassword(signUpEmail, signUpPassword)
        .then(function (user) { // eslint-disable-line
          firebase.auth().currentUser.updateProfile ({
            displayName: username,
            photoURL: "https://api.adorable.io/avatars/285/abott@adorable.png"
          });
          var userID = firebase.auth().currentUser.uid
          firebase.database().ref("users").child(userID)
            .set({
              displayName: username,
              email: signUpEmail,
              photoURL : "https://api.adorable.io/avatars/285/abott@adorable.png",
              bio: "Je viens d'arriver, merci de bien m'accueillir !"
            })
            .catch(function(error) { console.error(error); 
          });
          firebase.auth().currentUser.sendEmailVerification()
          firebase.auth().signInWithEmailAndPassword(signUpEmail, signUpPassword)
          .then(function() {
            firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
            localStorage.isLogged = true
            window.location.href = './profile'
          })
        },
        function (err) {
          alert('Oops. ' + err.message)
        }
      );
    },
    reset() {
      this.resetEmail = this.bform.getFieldValue('resetEmail')
      firebase.auth().sendPasswordResetEmail(this.resetEmail)
      .then(function () {
        message.success('An email with resetting details has just been sent. Please check your inbox.');
      })
      .catch(function(error) {
        // Handle Errors here.
        message.error(error.message);
        // alert(error.code + ': ' + error.message);
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
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
#components-form-demo-normal-login .login-form {
  max-width: 300px;
}
#components-form-demo-normal-login .login-form-forgot {
  float: right;
}
#components-form-demo-normal-login .login-form-button {
  width: 100%;
}
</style>
