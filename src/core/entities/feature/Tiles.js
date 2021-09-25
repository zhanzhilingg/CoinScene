import { Sphere, Vector3 } from 'three'
import Feature from '../Feature'
import { Tileset } from '@core/loader'
export default class Tiles extends Feature {
  /**
   * 视角不同时update, 一个函数
   * @memberof Tiles
   */
  update= () => { console.error('未加入场景，无法更新') }
  /**
   * 圆形包围盒
   *
   * @private
   * @memberof Tiles
   */
  _sphere= null
  /**
   * 圆形包围盒
   * @private
   * @memberof Tiles
   */
  _updateTimer= null
  /**
   * 正在被渲染的3d瓦片（mesh）
   * @readonly
   * @memberof Tiles
   */
  get renderedTiles () {
    return this.loader.currentlyRenderedTiles
  }
  /**
   * 圆形包围盒
   *
   * @readonly
   * @memberof Tiles
   */
  get sphere () {
    if (!this._sphere && this.loader) {
      const spJson = this.loader.rootJson()
      if (!spJson) {
        console.error('3dtiles数据源为空：', spJson)
        return false
      }
      if (spJson.boundingVolume && spJson.boundingVolume.sphere) {
        const sp = spJson.boundingVolume.sphere
        const sphere = new Sphere(new Vector3(sp[0], sp[1], sp[2]), sp[3])
        this._sphere = sphere
        return sphere
      } else {
        console.error('未支持的Tiles定位类型boundingVolume：', spJson.boundingVolume)
        return false
      }
    } else {
      return this._sphere
    }
  }
  /**
   * 3dtiles类
   * @param {Object} options
   * @param {string} options.url 数据地址
   * @param {string} options.name 名称
   * @constructs Tiles
   * @extends {Feature}
   * @author zhanzl
   */
  constructor (options) {
    super(options)
    this.object3d.userData.type = 'Tiles'
  }
  /**
   * 添加到
   * @param {Scene} scene 添加到的CoinScene实例
   * @memberof Tiles
   */
  addTo (scene) {
    super.addTo(scene)
    this.update = () => {
      this.loader.update()
      if (this._updateTimer) clearTimeout(this._updateTimer)
      this._updateTimer = setTimeout(() => {
        this.dispatchEvent({ type: 'updated' })
      }, 300)
    }
    this.load()
    return this
  }
  /**
   * 加载
   *
   * @return {Promise}
   * @memberof Tiles
   */
  load () {
    const { camera } = this.scene
    const { object3d } = this
    this._loader = new Tileset(this.url, object3d, camera, 1, (mesh) => {
      if (!this.url) return
      if (!this._sphere && this.sphere) { // root JSON 加载完成
        const rootJson = this.loader.rootJson()
        this.dispatchEvent({ type: 'loaded', root: rootJson })
      }
      this.dispatchEvent({ type: 'loadding', mesh: mesh })
      this.update()
    })
    this.loader.setLoadOutsideView(true)
    this.scene.addEventListener('render', this.update)
  }
  /**
   * 销毁
   * @memberof Tiles
   */
  destroy () {
    // 移除渲染时更新
    this.scene.removeEventListener('render', this.update)
    // 移除三维对象
    this.loader.deleteFromCurrentScene()
    // // 移除图例
    // const legendDiv = document.getElementById(this.id)
    // if (legendDiv) {
    //   legendDiv.remove()
    // }
    this.loader.controller.abort()
    this.scene.render(true)
  }
}
