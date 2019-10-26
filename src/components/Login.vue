<template>
  <div>
    <a-popover trigger="click" placement="bottomRight">
      <template slot="content">
        <a-form
          v-if="logStatus==='login'"
          id="components-form-demo-normal-login"
          :form="aform"
          class="login-form"
          @submit="handleSubmit"
        >
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
            <a-checkbox
              v-decorator="[
                'remember',
                {
                  valuePropName: 'checked',
                  initialValue: true,
                },
              ]"
            >
              Remember me
            </a-checkbox>
            <a-button @click="toggleReset" class="login-form-forgot" type="link">
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
          <a-icon @click="toggleLogin" type="left" />
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
          <a-form-item label="Confirm Password">
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
            />
          </a-form-item>
          <a-form-item>
            <span slot="label">
              Nickname
            </span>
            <a-input
              placeholder="Nickname"
              v-decorator="[
                'signUpDisplayName',
                {
                  rules: [{ required: true, message: 'Please input your nickname!', whitespace: true }],
                },
              ]"
            />
          </a-form-item>
          <a-form-item>
            <a-checkbox
              v-decorator="[
                'remember',
                {
                  valuePropName: 'checked',
                  initialValue: true,
                },
              ]"
            >
              Remember me
            </a-checkbox>
            <a-button @click="toggleReset" class="login-form-forgot" type="link">
              Forgot password
            </a-button>
            <a-button @click="signIn" type="primary" html-type="submit" class="login-form-button">
              Register
            </a-button>
            Or
            <a-button @click="toggleRegister" type="link">
              log in
            </a-button>
          </a-form-item>
          <a-form-item>
            <a-button @click="signUp" type="primary" html-type="submit">
              Register
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
          <a-icon @click="toggleLogin" type="left" />
          <a-form-item>
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
      </template>
      <a-button type="link" v-if="!userLogged">Login</a-button>
    </a-popover>
    <a-button type="link" @click="signOut" v-if="userLogged">Log out</a-button>
  </div>
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
  mounted () {
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        // User is signed in.
        this.userLogged = true
      } else {
        // No user is signed in.
        this.userLogged = false
      }
    })
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
      .then(function(user) {
        message.success('Welcome, ' + user.user.displayName + '.')
        firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
      })
      .catch(function(error) {
        message.error('Oops, ' + error.message)
      });
    },
    signUp() {
      this.signUpEmail = this.form.getFieldValue('signUpEmail')
      this.signUpPassword = this.form.getFieldValue('signUpPassword')
      let username = this.form.getFieldValue('signUpDisplayName')
      firebase.auth().createUserWithEmailAndPassword(this.signUpEmail, this.signUpPassword)
        .then(function (user) { // eslint-disable-line
          firebase.auth().currentUser.updateProfile ({
            displayName: username,
          });
          firebase.auth().currentUser.sendEmailVerification()
          alert('Account successfully created !')
        },
        function (err) {
          alert('Oops. ' + err.message)
        }
      );
    },
    signOut() {
      firebase.auth().signOut()
      .then(function() {
        // Sign-out successful.
        message.success('Successfully logged out !')
      })
      .catch(function(error) {
        // An error happened
        message.error('An error occured, please try again.' + error)
      });
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
