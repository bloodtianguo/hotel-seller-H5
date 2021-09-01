<template>
  <div id="app">
    <router-view />
    <audio id="myaudio" class="audio_box">
      <source src="@/assets/mp3/newMan.aac" type="audio/mp3" />
      <source src="hangge.ogg" type="audio/ogg" />
    </audio>
    <audio id="myaudioquxiao" class="audio_box">
      <source src="@/assets/mp3/quxiao.aac" type="audio/mp3" />
      <source src="hangge.ogg" type="audio/ogg" />
    </audio>
    <!-- <audio
      src="@/assets/mp3/newMan.aac"
      class="audio_box"
      preload
      id="myaudio"
      hidden
      muted
    ></audio> -->
  </div>
</template>
<script>
export default {
  data() {
    return {};
  },
  computed: {},
  mounted() {},
  watch: {
    getAiduoStatus(newValue) {
      // var myAuto = document.getElementById("myaudio");
      // myAuto.play();
    },
  },

  methods: {},
};
</script>
<style lang="less">
#app {
  height: 100%;
  .audio_box {
    width: 0px;
    height: 0px;
  }
}
</style>
