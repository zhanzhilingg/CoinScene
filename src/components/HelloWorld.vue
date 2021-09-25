<template>
  <div class="hello-world">
    <img alt="Vue logo" src="@/assets/logo.png" />
    <h1 :class="{'typing': isTypingShow}">{{ msg }}</h1>
    <!-- <a-button type="primary">confirm</a-button> -->
  </div>
</template>

<script>
// import { defineProps, reactive } from 'vue'
export default {
  props: {
    msg: String
  },
  data () {
    return {
      isTypingShow: false
    }
  },
  mounted () {
    setTimeout(() => {
      this.isTypingShow = true
    }, 2000)
  }
}

</script>

<style lang="less" scoped>
  //
  .hello-world {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    img {
      margin-top: -50px;
      animation:imageAni 2s;
    }
    h1 {
      display: inline-block;
      visibility: hidden;
      width: 20ch;
      font: bold 200% Consolas, Monaco, monospace;   /*等宽字体*/
      overflow: hidden;
      white-space: nowrap;
      font-weight: 500;
      font-size: 36px;
      border-right: 1px solid transparent;
      &.typing {
        visibility: visible;
        animation: typing 3s steps(20), caret .5s steps(1) infinite;
      }
    }
  }
  //
  @keyframes imageAni {
    0% {
      margin-top: 200px;
      opacity: 0;
    }
    60% {
      opacity: 1;
    }
    100% {
      margin-top: -50px;
    }
  }
  @keyframes typing{
    from {
        width: 0;
    }
  }
  @keyframes caret{
    50% { border-right-color: currentColor}
  }
</style>
