// import { Vector3 } from 'three'
import config from '@core/config/config'
import Widgets from '../Base'
// import * as TWEEN from '@tweenjs/tween.js'
// import { DEG90, DEG180 } from '@core/math'
export default class Compass extends Widgets {
  /**
   * 名称
   *
   * @readonly
   * @memberof Compass
   */
  get name () {
    return 'Compass'
  }
  /**
   * css name
   * @private
   * @memberof Compass
   */
  _cssName= config.name + this.name

  /**
   * 罗盘
   * @constructs Compass
   * @extends {Widgets}
   * @author zhanzl
   */
  constructor () {
    super()
    this.domElement.className = this._cssName
    // css绘制立方体 ./compass.less
    for (let i = 1; i <= 6; i++) {
      const face = document.createElement('div')
      face.className = this._cssName + '-' + 'face' + i
      face.addEventListener('click', (e) => {
        this.goToDirection(i)
      })
      this.domElement.appendChild(face)
    }
    this.render = this.render.bind(this)
  }
  /**
   * 获取立方体三维矩阵style
   * @param {THREE.PerspectiveCamera} camera
   * @return {String} matrix3d css
   * @memberof Compass
   */
  getCameraCSSMatrix (camera) {
    const { elements } = camera.matrixWorldInverse
    const epsilon = (value) => {
      return Math.abs(value) < 1e-10 ? 0 : value
    }
    return `matrix3d(
      ${epsilon(elements[0])},
      ${epsilon(-elements[1])},
      ${epsilon(elements[2])},
      ${epsilon(elements[3])},
      ${epsilon(elements[4])},
      ${epsilon(-elements[5])},
      ${epsilon(elements[6])},
      ${epsilon(elements[7])},
      ${epsilon(elements[8])},
      ${epsilon(-elements[9])},
      ${epsilon(elements[10])},
      ${epsilon(elements[11])},
      ${epsilon(0)},
      ${epsilon(0)},
      ${epsilon(0)},
      ${epsilon(elements[15])})`
  }
  /**
   * 渲染时调用更新
   * @memberof Compass
   */
  render (event) {
    //
    const m = this.getCameraCSSMatrix(this.scene.camera)
    // console.log(m)
    this.domElement.style.transform = m
  }
  /**
   * 添加到场景
   * @param {Scene} scene CoinScene实例
   * @return {Widgets} 小组件实例
   * @memberof Compass
   */
  addTo (scene) {
    super.addTo(scene)
    this.scene.addEventListener('render', this.render)
    return this
  }
  /**
   * 销毁组件
   * @memberof Compass
   */
  destroy () {
    this.domElement.remove()
    this.scene.removeEventListener('render', this.render)
  }
  /**
   * 方向点击
   * @param {Number} index 1：下；2：西；3：北；4：上；5：东；6：南；
   * @memberof Compass
   */
  goToDirection (i) {
    const { range } = this.scene.getBoxRange()
    const sphere = this.scene.sphere
    const parseDirection = (num) => {
      const n = Math.abs(num)
      if (n === 0) {
        if (i === 1 || i === 2 || i === 3) { // 下、西、南 方向，返回-1
          return -1
        } else {
          return 1 // 上、东、北 方向，返回1
        }
      }
      return num
    }
    const p = sphere.center.clone()
    switch (i) {
    case 1: // Down
      p.y = parseDirection(range.down)
      break
    case 2: // west
      p.x = parseDirection(range.west)
      break
    case 3: // south
      p.z = parseDirection(range.south)
      break
    case 4: // Up
      p.y = parseDirection(range.up)
      break
    case 5: // east
      p.x = parseDirection(range.east)
      break
    case 6: // north
      p.z = parseDirection(range.north)
      break
    }
    this.scene.cameraControls.setPosition(p.x, p.y, p.z, true)
    this.scene.fitTo(this.scene)
  }
}
