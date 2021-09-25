import { Object3D, EventDispatcher } from 'three'
import { disposeObj3d, computeBoundingSphere } from '@core/utils'
import { baseName } from '@core/utils/path'
export default class Feature extends EventDispatcher {
  /**
   * 标识符
   * @memberof Feature
   */
  get id () {
    return this.object3d.uuid
  }
  set id (val) {
    this.object3d.uuid = val
  }
  /**
   * coinScene实例
   * @memberof Feature
   */
  scene= null
  /**
   * 加载器
   * @private
   * @memberof Feature
   */
  _loader= null
  /**
   * 模型数据源路径
   * @memberof Feature
   */
  url= ''
  /**
   * 3d对象
   *
   * @memberof Feature
   */
  object3d= new Object3D()

  /**
   * 圆形包围盒
   *
   * @readonly
   * @memberof Feature
   */
  get sphere () {
    return computeBoundingSphere(this.object3d)
  }

  /**
   * 加载器
   * @readonly
   * @memberof Feature
   */
  get loader () {
    return this._loader
  }

  /**
   * 名称
   * @memberof Feature
   */
  get name () {
    if (!this._name) {
      this._name = baseName(this.url).replace(this.ext, '')
    }
    return this._name
  }
  set name (val) {
    this._name = val
  }
  /**
   * 模型图例数据
   * @readonly
   * @memberof Feature
   */
  get legends () {
    const arr = []
    const setData = (obj) => {
      if (obj.material) {
        // debugger
        const color = []
        const map = []
        if (obj.material.length) {
          for (let i = 0; i < obj.material.length; ++i) {
            color.push(obj.material[i].color)
            map.push(obj.material[i].map)
          }
        } else {
          color.push(obj.material.color)
          map.push(obj.material.map)
        }
        arr.push({ name: obj.name, color: color, map: map })
      }
      if (obj.children && obj.children.length) {
        obj.children.map(item => {
          setData(item)
        })
      }
    }
    setData(this.object3d)
    return arr
  }
  /**
   * 基类
   *
   * @extends {EventDispatcher}
   * @constructs Feature
   * @author zhanzl
   */
  constructor (options) {
    super()
    Object.assign(this, options)
  }

  /**
   * 添加到
   * @param {Scene} scene 添加到的CoinScene实例
   * @memberof Feature
   */
  addTo (scene) {
    const { object3d } = this
    this.scene = scene
    this.scene.scene.add(object3d)
    this.scene._entities.push(this)
    return this
  }
  /**
   * 销毁
   * @memberof Feature
   */
  destroy () {
    // 销毁3d对象
    disposeObj3d(this.object3d)
    // // 移除图例
    // const legendDiv = document.getElementById(this.id)
    // if (legendDiv) {
    //   legendDiv.remove()
    // }
    // 移除加载进度条
    this.destroyLoadingBar()
    // 渲染一次更新到视图
    this.scene.render(true)
  }

  /**
   * 移除加载进度条
   *
   * @memberof Feature
   */
  destroyLoadingBar () {
    if (this.barDom) {
      this.barDom.remove()
      delete this.barDom
      delete this.bar
      this.barDom = this.bar = null
    }
  }
}
