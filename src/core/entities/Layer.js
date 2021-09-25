/* eslint-disable no-useless-constructor */
import { EventDispatcher } from 'three'
export default class Layer extends EventDispatcher {
  /**
   * 唯一值
   *
   * @memberof Layer
   */
  get id () {
    return this.object3d.uuid
  }
  set id (val) {
    this.object3d.uuid = val
  }

  /**
   * 图层基类
   * @extends {EventDispatcher}
   * @constructs Layer
   * @author zhanzl
   */
  constructor () {
    super()
  }
  /**
   * 添加到
   * @param {Scene} CoinScene 添加到的CoinScene实例
   * @memberof Layer
   */
  addTo () {
    this.dispatchEvent('added', this)
  }

  /**
   * 销毁
   * @memberof Layer
   */
  destroy () {

  }
}
