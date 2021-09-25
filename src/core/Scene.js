// import * as proj4 from 'proj4'
import * as THREE from 'three'
import * as TWEEN from '@tweenjs/tween.js'
import CameraControls from 'camera-controls'
import { CSS2DRenderer, CSS2DObject } from 'three-css2drender'
import Stats from 'three/examples/jsm/libs/stats.module.js'
import { Widgets } from './widgets'
import { Feature, Layer } from './entities'
import { disposeObj3d, computeBoundingSphere, onChange } from '@core/utils'
import config from './config/config'
// camera controls
CameraControls.install({ THREE: THREE })
export default class Scene extends THREE.EventDispatcher {
  // /**
  //  * 坐标系统
  //  * @memberof Scene
  //  */
  // coordinateSystem= null

  /**
   * 页面HTML Element
   * @memberof Scene
   */
  domElement= null
  /**
   * 相机
   * @memberof Scene
   */
  camera= null
  /**
   * 相机控制器
   * @memberof Scene
   */
  cameraControls= null
  /**
   * 渲染器
   * @memberof Scene
   */
  renderer= []
  /**
   * THREE场景
   * @memberof Scene
   */
  scene= new THREE.Scene()
  /**
   * 时钟
   * @memberof Scene
   */
  clock= new THREE.Clock()

  /**
   * 宽度
   * @private
   * @memberof Scene
   */
  _width= 0
  /**
   * 高度
   * @private
   * @memberof Scene
   */
  _height= 0
  /**
   * 性能检测
   * @private
   * @memberof Scene
   */
  _stats= null
  /**
   * 坐标轴
   * @private
   * @memberof Scene
   */
  _axes= true
  /**
   * 已加载的三维实体
   * @private
   * @memberof Scene
   */
  _entities= []

  /**
   * 场景宽度（像素）
   * @readonly
   * @memberof Scene
   */
  get width () {
    return this._width
  }
  /**
   * 场景高度（像素）
   * @readonly
   * @memberof Scene
   */
  get height () {
    return this._height
  }

  /**
   * 帧率（性能检测） 为真时显示帧率监测工具
   * @memberof Scene
   */
  get stats () {
    return !!this._stats
  }
  set stats (val) {
    const bool = !!val
    if (bool) {
      this._stats = new Stats()
      this.domElement.appendChild(this._stats.dom)
    } else {
      if (this._stats) {
        this._stats.dom.remove()
        this._stats = undefined
      }
    }
  }

  /**
   * 坐标轴  为真时显示坐标轴
   * @memberof Scene
   */
  get axes () {
    return !!this._axes
  }
  set axes (val) {
    const bool = !!val
    if (bool) {
      this._axes = new THREE.AxesHelper(config.scene.far)
      this.scene.add(this._axes)
    } else {
      if (this._axes) {
        this.scene.remove(this._axes)
        this._axes = undefined
      }
    }
  }

  /**
   * 已加载的三维构件
   * @readonly
   * @memberof Scene
   */
  get entities () {
    return this._entities
  }

  /**
   * 圆形包围盒
   * @readonly
   * @memberof Scene
   */
  get sphere () {
    // /** ***********圆形包围盒 */
    // const boundingSphere = computeBoundingSphere(this.scene)
    // const sphereHelper = new THREE.Mesh(
    //   new THREE.SphereBufferGeometry(boundingSphere.radius, 16, 16),
    //   new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true })
    // )
    // sphereHelper.position.copy(boundingSphere.center)
    // this.scene.add(sphereHelper)
    return computeBoundingSphere(this.scene)
  }

  /**
   * 图例数据
   * @readonly
   * @memberof Scene
   */
  get legends () {
    const l = new Map()
    this._entities.forEach(item => {
      if (!l.has(item.id)) {
        l.set(item.id, item.legends)
      }
    })
    return l
  }

  /**
   * @param {Object} options
   * @param {HTMLElement} options.domElement
   * @constructs Scene
   * @author zhanzl
   */
  constructor (options) {
    // 继承EventDispatcher
    super(options)
    // // 定义模型坐标系
    // proj4.default.defs('MODEL', '+proj=tmerc +lat_0=0 +lon_0=105 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=15.8,-154.4,-82.3,0,0,0,0 +units=m +no_defs')
    // this.coordinateSystem = proj4.default.Proj('MODEL')
    //
    if (!(options.domElement instanceof HTMLElement)) {
      throw new Error('domElement参数必须是HTMLElement')
    }
    Object.assign(this, options)
    // dom setting
    this.domElement.id = config.name + 'Container'
    this.domElement.className = config.name + '-Container ' + this.domElement.className
    this._width = this.domElement.clientWidth
    this._height = this.domElement.clientHeight
    // 模型加载进度条容器
    const progressDom = document.createElement('div')
    progressDom.className = config.name + '-Progress'
    this.progressDom = progressDom
    this.domElement.appendChild(progressDom)
    // three
    this.initRenderer()
    this.initCamera()
    // 渲染
    this.render = this.render.bind(this)
    this.render()
    // 窗口大小改变
    window.addEventListener('resize', e => {
      const w = this.domElement.clientWidth
      const h = this.domElement.clientHeight
      this._width = w
      this._height = h
      this.camera.aspect = w / h
      this.camera.updateProjectionMatrix()
      // console.log(w, h)
      for (let i = 0; i < this.renderer.length; i++) {
        this.renderer[i].setSize(w, h)
      }
    })
    // 相机动画测试
    // this.cameraControls.azimuthAngle = 0
    // new TWEEN.Tween(this.cameraControls)
    //   .to({ azimuthAngle: 120 * THREE.MathUtils.DEG2RAD }, 3000)
    //   .easing(TWEEN.Easing.Exponential.Out)
    //   .onStart(() => {
    //     // disable user control while the animation
    //     this.cameraControls.enabled = false
    //   })
    //   .onComplete(() => {
    //     this.cameraControls.enabled = true
    //   })
    //   .start()

    // 环境光
    this.scene.add(new THREE.AmbientLight(0xFFFFFF, 0.6))
    // 方向光
    var dirLight = new THREE.DirectionalLight(0xffffff, 0.35)
    dirLight.position.set(-config.scene.far, config.scene.far, -config.scene.far)
    dirLight.target.position.set(0, 0, 0)
    this.scene.add(dirLight)
    this.scene.add(dirLight.target)
    this.dispatchEvent({ type: 'inited', scene: this })
    // 监听entities数组变化
    onChange(this._entities, (array, arg, result) => {
      this.dispatchEvent({ type: 'entitiesChange', array, arg, result })
    })
  }

  /**
   * 初始化渲染器
   * @memberof Scene
   */
  initRenderer () {
    const glRender = new THREE.WebGLRenderer({ preserveDrawingBuffer: true, antialias: true, alpha: true })
    const cssRender = new CSS2DRenderer()

    glRender.setPixelRatio(window.devicePixelRatio)
    glRender.setSize(this._width, this._height)
    glRender.autoClear = true // 清除上一次的渲染结果

    cssRender.setSize(this._width, this._height)
    cssRender.domElement.style.position = 'absolute'
    cssRender.domElement.style.top = 0
    cssRender.autoClear = true

    this.domElement.appendChild(glRender.domElement)
    this.domElement.appendChild(cssRender.domElement)
    this.renderer.push(glRender, cssRender)
  }

  /**
   * 初始化相机
   * @memberof Scene
   */
  initCamera () {
    this.camera = new THREE.PerspectiveCamera(45, this._width / this._height, config.scene.near, config.scene.far)
    this.cameraControls = new CameraControls(this.camera, this.domElement)
    this.cameraControls.maxDistance = this.camera.far
    this.cameraControls.minDistance = 0
    this.cameraControls.mouseButtons.left = CameraControls.ACTION.TRUCK
    this.cameraControls.mouseButtons.right = CameraControls.ACTION.ROTATE
    this.cameraControls.dampingFactor =	0.05	// 阻尼惯性
    this.cameraControls.draggingDampingFactor =	0.8	// 拖动时的阻尼惯性
    this.cameraControls.azimuthRotateSpeed =	0.5	// 方位角旋转速度
    this.cameraControls.polarRotateSpeed =	0.5	// 极轴旋转速度
    this.cameraControls.dollySpeed =	1.0	// 鼠标滚轮的速度
    this.cameraControls.truckSpeed =	2.0	// 卡车和基座的阻力速度
    this.cameraControls.setTarget(0, 0, 0, false)
    this.cameraControls.setPosition(50, 50, 50, false)
    // debugger
    this.cameraControls.addEventListener('control', (e) => {
      this.dispatchEvent({ type: 'cameraChange', control: e.target })
      // console.log(e)
      // console.log(this.cameraControls.distance)
    })
  }

  /**
   * 渲染函数，每帧调用
   * @param {Boolean} bool 外部调用请设置为true
   * @memberof Scene
   */
  render (bool) {
    let updated = null
    if (bool !== true) {
      const delta = this.clock.getDelta()
      const elapsed = this.clock.getElapsedTime()
      updated = this.cameraControls.update(delta)
      TWEEN.update(elapsed * 1000)
      // if ( elapsed > 30 ) return
      requestAnimationFrame(this.render)
    }
    if (updated || bool === true) {
      for (let i = 0; i < this.renderer.length; i++) {
        this.renderer[i].render(this.scene, this.camera)
      }
      // console.log('rendered')
      this.camera.updateMatrixWorld()
      if (this._stats) {
        this._stats.update()
      }
      this.dispatchEvent({ type: 'render', scene: this })
    }
  }

  /**
   * 重置场景到初始状态
   * @memberof Scene
   */
  reset () {
    this.cameraControls.reset(true)
  }

  /**
   * 添加
   * @param {Widgets|Feature|Layer|Array} object 三维构件
   * @memberof Scene
   */
  add (object) {
    const executeAdd = (obj) => {
      const isWidgets = obj instanceof Widgets
      const isFeature = obj instanceof Feature
      const isLayer = obj instanceof Layer
      if (isWidgets || isFeature || isLayer) {
        obj.addTo(this)
      }
    }
    if (Array.isArray(object)) {
      object.map(obj => {
        executeAdd(obj)
      })
    } else {
      executeAdd(object)
    }
  }

  /**
   * 组件注册
   * @param {VueComponent|Array} component
   * @memberof Scene
   */
  registerComponent (component) {
    //
    const setComponent = (c) => {
      c.install(this)
    }
    if (Array.isArray(component)) {
      for (let i = 0; i < component.length; i++) {
        setComponent(component)
      }
    } else {
      setComponent(component)
    }
  }

  /**
   * 光标在此区域时取消镜头控制
   * @param {HTMLElement} element
   * @memberof Scene
   */
  outOfControl (element) {
    // 滑入时取消镜头控制
    element.addEventListener('mouseenter', (e) => {
      this.cameraControls.enabled = false
    })
    element.addEventListener('mouseleave', (e) => {
      this.cameraControls.enabled = true
    })
  }

  /**
   * 获取entities实例的三维立方体包围盒
   * @return {Object} { box: THREE.BoxHelper, range: { up, down, east, west, south, north } }
   * @memberof Scene
   */
  getBoxRange () {
    const group = new THREE.Group()
    for (let i = 0; i < this.entities.length; i++) {
      const item = this.entities[i].object3d.clone()
      group.add(item)
    }
    const box = new THREE.BoxHelper(group, 0x1890ff)
    const pointArr = box.geometry.attributes.position.array
    // this.scene.add(box)
    const vec3Arr = []
    for (let i = 0; i < pointArr.length; i += 3) {
      vec3Arr.push(new THREE.Vector3(pointArr[i], pointArr[i + 1], pointArr[i + 2]))
    }
    const max = { x: vec3Arr[0].x, y: vec3Arr[0].y, z: vec3Arr[0].z }
    const min = { x: vec3Arr[6].x, y: vec3Arr[6].y, z: vec3Arr[6].z }
    const range = { up: max.y, down: min.y, east: max.x, west: min.x, south: min.z, north: max.z }
    const box3 = new THREE.Box3().setFromPoints(vec3Arr)
    return { box, range, vec3Arr, box3 }
  }

  /**
   * 视角定位到指定实体
   * @param {Feature|Layer|Scene} entity
   * @memberof Scene
   */
  fitTo (entity) {
    if (
      entity instanceof Feature ||
      entity instanceof Layer ||
      entity instanceof Scene
    ) {
      const fitobj = entity.sphere ? entity.sphere : entity.object3d
      return this.cameraControls.fitToSphere(fitobj, true)
    }
  }

  /**
   * 清空场景
   * @memberof Scene
   */
  clear () {
    for (let i = this.entities.length - 1; i >= 0; i--) {
      this.entities[i].destroy()
      for (const j in this.entities[i]) {
        delete this.entities[i][j]
      }
      this.entities.splice(i, 1)
    }
  }

  /**
   * 销毁场景
   *
   * @memberof Scene
   */
  destroy () {
    this.stats = false
    this.axes = false
    this.clear()
    disposeObj3d(this.scene)
    this.camera.dispose()
    this.cameraControls.dispose()
    this.domElement.remove()
    this.removeEventListener('entitiesChange')
    this.removeEventListener('cameraChange')
    this.removeEventListener('inited')
    this.removeEventListener('render')
    this.dispatchEvent({ type: 'destroyed' })
  }
}
