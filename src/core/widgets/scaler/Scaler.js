// import * as THREE from 'three'
import Widgets from '../Base'
import { pxConversionMm, mmConversionPx, getViewDisFromCamera } from '@core/utils'
import config from '@core/config/config'
export default class Scaler extends Widgets {
  /**
   * 名称
   *
   * @readonly
   * @memberof Scaler
   */
  get name () {
    return 'Scaler'
  }
  /**
   * css name
   * @private
   * @memberof Scaler
   */
  _cssName= config.name + this.name
  /**
   * 比例尺
   * @constructs Scaler
   * @extends {Widgets}
   * @author zhanzl
   */
  constructor () {
    super()
    this.domElement.className = this._cssName
    this.update = this.update.bind(this)
  }
  /**
   * 添加到场景
   * @param {Scene} scene CoinScene实例
   * @return {Widgets} 小组件实例
   * @memberof Scaler
   */
  addTo (scene) {
    super.addTo(scene)
    this.scene.addEventListener('cameraChange', this.update)
    this.scene.addEventListener('inited', (event) => {
      this.update()
    })
    return this
  }
  /**
   * 渲染时调用更新
   * @memberof Scaler
   */
  update (event) {
    const mainDom = this.scene.domElement
    const left = parseFloat(mainDom.clientLeft)
    const top = parseFloat(mainDom.clientTop)
    const w = parseFloat(mainDom.clientWidth)
    const h = parseFloat(mainDom.clientHeight)
    const p1 = { left, top }
    const p2 = { left: left + w, top }
    const p3 = { left: left + w, top: top + h }
    const p4 = { left: left, top: top + h }
    // 屏幕像素距离
    let d1 = Math.sqrt(Math.pow(p2.left - p1.left, 2) + Math.pow(p2.top - p1.top, 2))
    // 屏幕实际距离（米）
    const d2 = getViewDisFromCamera(this.scene.camera)
    // 像素距离转米
    d1 = pxConversionMm(d1) / 1000
    // console.log('屏幕距离：'+ d1+'米')
    // console.log('实际距离：'+ d2+'米')
    // eslint-disable-next-line use-isnan
    this.scaler = d1 / d2
    const scale = this.getPxAndScaleNum()
    this.domElement.style.width = scale.pxLen + 'px'
    const prevTxt = this.domElement.getAttribute('scalerLabel')
    if (prevTxt !== scale.numtxt) {
      this.domElement.setAttribute('scalerLabel', scale.numtxt)
    }
    this.dispatchEvent({ type: 'onchange' })
  }

  /**
   * 从1/2/5或其倍数获取像素长度和实际距离
   * @return {Object} { pxLen, num, numtxt }
   * @memberof Scaler
   */
  getPxAndScaleNum () {
    let scaleNumbers = [2, 5, 10]
    for (let i = 0; i < scaleNumbers.length; i++) {
      const num = scaleNumbers[i]
      let numtxt = ''
      const pxLen = mmConversionPx(this.scaler * num * 1000)
      if (pxLen > 50) {
        if (num >= 1000) {
          numtxt = num / 1000 + 'km'
        } else {
          numtxt = num + 'm'
        }
        return { pxLen, num, numtxt }
      }
      if (i === scaleNumbers.length - 1) {
        scaleNumbers = scaleNumbers.map((e) => {
          return e * 10
        })
        i = 0
      }
    }
  }
}
