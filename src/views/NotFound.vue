<template>
  <div style="display: flex; flex-direction: column; align-items: flex-start">
    <a @click="$router.go(-1)" v-if="$store.state.user.uid !== $route.params.id" style="width: 100%; padding: 0 30px 50px;">
      <a-icon type="left" /> Back
    </a>
    <div style="width: 100%; display: flex; flex-direction: column; align-items: center">
      <h1 style="font-weight: bold; color: #F8AC10;">
        Oops, nothing has been found. (404)
      </h1>
      <img src="https://media1.tenor.com/images/ef0e8b92115b2273e026576effe54753/tenor.gif?itemid=15810119" alt="">
    </div>
  </div>
</template>

<script>
export default {

}
</script>

<style>

</style>