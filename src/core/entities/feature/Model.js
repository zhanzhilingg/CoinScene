// import {
//   Mesh,
//   SphereBufferGeometry,
//   MeshBasicMaterial
// } from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
// import { LazyGLTFLoader } from 'lazy-gltf-loader'
import { FBXLoader } from '@core/loader/fbx/loader'
import Feature from '../Feature'
import { extName } from '@core/utils/path'
import ProgressBar from 'progressbar.js'
// import { disposeObj3d } from '@core/utils'
export default class Model extends Feature {
  /**
   * 模型格式
   * @readonly
   * @memberof Model
   */
  get ext () {
    return extName(this.url)
  }
  /**
   * 加载器
   * @readonly
   * @memberof Model
   */
  get loader () {
    switch (this.ext) {
    case '.gltf':
      this._loader = new GLTFLoader()
      break
    case '.fbx':
      this._loader = new FBXLoader()
      break
    }
    return this._loader
  }
  /**
   * 模型类
   *
   * @param {Object} options
   * @param {string} options.url 数据地址
   * @param {string} options.name 名称
   * @constructs Model
   * @extends {Feature}
   * @author zhanzl
   */
  constructor (options) {
    //
    super(options)
    this.object3d.userData.type = 'Model'
  }
  /**
   * 添加
   * @param {Scene} scene 添加到的CoinScene实例
   * @memberof Model
   */
  addTo (scene) {
    super.addTo(scene)
    if (!this.hasLoaded) { // 未加载过
      this.load()
    }
    // if (this.scene.loadingBar === undefined || this.scene.loadingBar) {
    this.barDom = document.createElement('div')
    this.scene.progressDom.appendChild(this.barDom)
    this.bar = new ProgressBar.Line(this.barDom, {
      strokeWidth: 1, // 跟踪路径的高度
      trailWidth: 1, // 未填充路径的高度
      trailColor: 'rgba(0,0,0,0.5)', // 如何适配主题？
      color: '#63B6FF'
    })
    this.addEventListener('loading', e => {
      const p = e.xhr.loaded / e.xhr.total
      // debugger
      this.bar.set(p)
      this.bar.setText(this.name + '：' + Math.ceil(p * 100) + '%')
      if (p === 1) {
        this.destroyLoadingBar()
      }
    })
    // }
    return this
  }

  /**
   * 开始加载模型
   * @return {Promise}
   * @memberof Model
   */
  load () {
    const { object3d } = this
    this.loader.load(this.url, (data) => {
      // gltf.scene.matrix.copy(new Matrix4())
      // gltf.scene.matrix.decompose(gltf.scene.position, gltf.scene.quaternion, gltf.scene.scale)
      let obj3d = null
      switch (this.ext) {
      case '.gltf':
        obj3d = data.scene
        break
      case '.fbx':
        obj3d = data
        break
      }
      if (obj3d) {
        object3d.add(obj3d)
      }
      this.dispatchEvent({ type: 'loaded', data: data })
      this.hasLoaded = true
      // this.scene.cameraControls.fitToSphere(this.scene.Sphere, true)
    }, (e) => {
      this.dispatchEvent({ type: 'loading', xhr: e })
      // console.log(e.loaded / e.total)
    }, (error) => {
      this.dispatchEvent({ type: 'loadError', error: error })
    })
  }
}
