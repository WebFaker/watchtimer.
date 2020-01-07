<template>
  <div>
    <a-drawer
      placement="right"
      :closable="false"
      @close="onClose"
      :visible="visible"
    >
      <div slot="title">
        
      </div>
      <p>fov...</p>
      <p>Some contents...</p>
      <p>Some contents...</p>
    </a-drawer>
  </div>
</template>

<script>
export default {
  data() {
    return {
      visible: false,
    };
  },
  props: {
    showDrawer: {
      type: Function,
    }
  },
  methods: {
    showDrawer() {
      this.visible = true;
    },
    onClose() {
      this.visible = false;
    },
  },
};

</script>

<style>

</style>