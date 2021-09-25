/* eslint-disable no-useless-constructor */
import { EventDispatcher } from 'three'
// import config from '@/core/config'
export default class Widgets extends EventDispatcher {
  /**
   * HTMLElement
   * @memberof Widgets
   */
  domElement= document.createElement('div')
  /**
   * CoinScene 实例
   * @memberof Widgets
   */
  scene= null
  /**
   * domElement class name
   *
   * @private
   * @memberof Widgets
   */
  _cssName= ''
  /**
   * 小组件基类
   *
   * @constructs Widgets
   * @author zhanzl
   */
  constructor () {
    super()
  }
  /**
   * 添加到场景
   * @param {Scene} scene CoinScene实例
   * @return {Widgets} 小组件实例
   * @memberof Widgets
   */
  addTo (scene) {
    this.scene = scene
    this.scene.domElement.appendChild(this.domElement)
    this.dispatchEvent({ type: 'added', widget: this })
    return this
  }
  /**
   * 销毁
   * @memberof Widgets
   */
  destroy () {
    this.domElement.remove()
  }
}
