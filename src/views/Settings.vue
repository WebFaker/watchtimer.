<template>
  <a-card>
		<h2>Settings</h2>
		<div class="profile_main">
			<img class="profile_main_img" :src="$store.state.user.photoURL" :alt="$store.state.user.displayName">
			<div class="profile_main_informations">
				<h3>{{ $store.state.user.displayName }}</h3>
			</div>
		</div>
	</a-card>
</template>

<script>
export default {
	data() {
		return {
			isNicknameEdit: false
		}
	},
	methods: {
		changeStateNickname() {
			this.isNicknameEdit = true;
		}
	}
}
</script>

<style lang="scss" scoped>
.profile {
  &_main {
    display: flex;
    align-items: center;
    &_img {
      width: 150px;
      border-radius: 100%;
    }
    &_informations {
      margin-left: 25px;
    }
  }
}
</style>