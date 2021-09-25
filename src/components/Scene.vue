<template>
  <div class="main">
    <div class="test-btns">
      <a-button @click="clear">清空场景</a-button>
      <a-button @click="reset">重置相机</a-button>
      <a-button @click="addgltf">添加gltf</a-button>
      <a-button @click="addfbx">添加fbx</a-button>
      <a-button @click="add3dtiles">添加3dtiles</a-button>
      <a-button @click="addVoxel">体素模型</a-button>
      <hr>
      <a-button @click="isShowCut=!isShowCut">剖切</a-button>
    </div>
    <div class="plane">
      <Cut ref="Cut" />
      <!-- v-if="isShowCut" -->
    </div>
  </div>
</template>

<script>
import Scene from '@core/Scene'
import { Tiles, Model, Voxel, Component, Compass, Legend, Scaler, BoxRuler } from '@/export'
import texture from '@core/assets/images/flourish-cc-by-nc-sa.png'
// import '../../cdn/coinscene.umd.js'
export default {
  components: {
    Cut: Component.Cut
  },
  data () {
    return {
      coinScene: null,
      isShowCut: false
    }
  },
  mounted () {
    //
    this.coinScene = new Scene({
      domElement: this.$el,
      stats: true,
      axes: true
    })
    this.coinScene.registerComponent(this.$refs.Cut)
    const compass = new Compass()
    const legend = new Legend()
    const scaler = new Scaler()
    // const boxRuler = new BoxRuler()
    this.coinScene.add([compass, legend, scaler])
    //
    this.addVoxel()
  },
  methods: {
    clear () {
      this.coinScene.clear()
    },
    reset () {
      // this.coinScene.cameraControls.reset()
      this.coinScene.cameraControls.setTarget(0, 0, 0, false)
      this.coinScene.cameraControls.setPosition(50, 50, 50, false)
      this.coinScene.fitTo(this.coinScene)
    },
    addgltf () {
      // 模型测试gltf
      const model = new Model({
        url: 'http://192.168.1.179:8088/UpLoadFile/models/2020-06-23/e3a04959-07eb-4b94-9bbc-f4d9f5827bd0/Q3s_N.gltf'
      }).addTo(this.coinScene)
      //
      model.addEventListener('loaded', e => {
        this.coinScene.fitTo(model)
      })
    },
    addfbx () {
      // 模型测试fbx
      const model = new Model({
        url: 'http://park.vr100.com/intest/upload_files/image/20210425/20210425161400_19019.fbx'
      }).addTo(this.coinScene)
      model.addEventListener('loaded', e => {
        this.coinScene.fitTo(model)
      })
    },
    add3dtiles () {
      // 3d tiles 模型测试
      const model = new Tiles({
        name: 'test model',
        // url: 'http://192.168.100.25:9090/Service/Scene/SceneModel.ashx?T=94741d06-2213-406a-be98-e318b60a416b&Flag=web&ModelName=Tile_+000_+000_+000/tileset.json'
        // url: 'https://ebeaufay.github.io/ThreedTilesViewer.github.io/momoyama/tileset.json'
        // url: 'http://ecloud.infoearth.com:9558/Service/Scene/SceneModel.ashx?T=c672a5644d95476182c1347471196798_30&Flag=web&ModelName=tileset.json'
        // url: 'http://ecloud.infoearth.com:9558/Service/Scene/SceneModel.ashx?T=b6d75519267849a0ae62f8456c43879e_2&Flag=web&ModelName=tileset.json'
        // url: 'http://192.168.1.179:8088/UpLoadFile/models/2021-02-09/ca9115b8-5d4f-4aa8-a1dc-b27ab86e51e3/LOAD/Data/tileset.json'
        url: 'http://ecloud.infoearth.com:9558/Service/Scene/SceneModel.ashx?T=31ac5705c7bf483fad3b9ab710b6baf2_1&Flag=web&ModelName=tileset.json'
      })
      model.addEventListener('loaded', e => {
        this.coinScene.fitTo(model)
      })
      this.coinScene.add(model)
    },
    addVoxel () {
      // 体素模型
      const vModel = new Voxel({
        cellSize: 60,
        tileSize: 16, // 材质的每个面的尺寸
        tileTextureWidth: 256, // 图片尺寸
        tileTextureHeight: 64, // 图片尺寸
        tileTexture: texture
      }).addTo(this.coinScene)
      this.coinScene.fitTo(vModel)
    }
  },
  destroyed () {
    this.coinScene.destroy()
  }
}

</script>

<style lang="less" scoped>
  //
  .main {
    width: 100%;
    height: 100%;
    .test-btns {
      position: absolute;
      right: 10px;
      top: 100px;
      width: 200px;
      z-index: 1;
    }
    :deep(button) {
      width: 100px
    }
    .plane {
      position: absolute;
      top: 50px;
      left: 0;
      z-index: 1;
    }
  }
</style>
