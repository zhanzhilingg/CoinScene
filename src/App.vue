<template>
  <div class="home">
    <!-- <HelloWorld :msg="name" v-if="!isShow" /> -->
    <Scene />
  </div>
</template>

<script>
import config from '@core/config'
import { defineComponent } from 'vue'
import HelloWorld from './components/HelloWorld.vue'
import Scene from './components/Scene.vue'
export default defineComponent({
  name: 'App',
  components: {
    HelloWorld,
    Scene
  },
  data () {
    return {
      name: config.name + config.version,
      isShow: false
    }
  },
  mounted () {
    setTimeout(() => {
      this.isShow = true
    }, 5000)
  }
})

</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100%;
  width: 100%
}
.home {
  width: 100%;
  height: 100%;
}
</style>
