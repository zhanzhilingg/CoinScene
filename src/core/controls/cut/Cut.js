import { EventDispatcher, PlaneGeometry, MeshBasicMaterial, Mesh, Vector3, Box3, Plane, DoubleSide } from 'three'
import { disposeObj3d } from '@core/utils'
export default class Cut extends EventDispatcher {
  /**
   * is enable cut
   * @memberof Cut
   */
  get enable () {
    return this.scene.renderer[0].clippingPlanes !== Object.freeze([])
  }
  set enable (v) {
    this.scene.renderer.map(item => {
      item.localClippingEnabled = !!v
      item.clippingPlanes = v ? this.globalPlanes : Object.freeze([])
    })
  }
  /**
   * scene
   * @memberof Cut
   */
  scene= null
  /**
   * cut panel plane
   * @memberof Cut
   */
  axis= {
    enable: { x: false, y: false, z: false },
    panel: { x: null, y: null, z: null },
    plane: { x: null, y: null, z: null }
  }
  /**
   * 记录所有剪裁面
   * @type {Array}
   * @memberof Cut
   */
  globalPlanes= []
  /**
   * 剪裁控制器
   * @param {Scene} scene CoinScene实例
   * @constructs Cut
   */
  constructor (scene) {
    super()
    this.scene = scene
    this.resetCutPanel = this.resetCutPanel.bind(this)
    this.scene.addEventListener('entitiesChange', this.resetCutPanel)
  }
  /**
   * 重新设置剪裁面
   * @memberof Cut
   */
  resetCutPanel (e) {
    const arr = e.array
    this.setAxisPanel('x')
    this.setAxisPanel('y')
    this.setAxisPanel('z')
  }
  /**
   * 设置剖切面板位置
   * @param {String} axis x,y,z
   * @param {Number|undefined} position 位置
   * @memberof Cut
   */
  setAxisPanel (axis, position) {
    if (this.axis.panel[axis]) { // 移除上一个预览面
      this.scene.scene.remove(this.axis.panel[axis])
      disposeObj3d(this.axis.panel[axis])
    }
    if (this.axis.plane[axis]) {
      this.scene.scene.remove(this.axis.plane[axis])
      disposeObj3d(this.axis.plane[axis])
    }
    const clipPlanes = []
    const m = makeAxisPanel.call(this, axis)
    m.panel.position[axis] = parseFloat(position)
    m.plane.constant = parseFloat(position)
    this.axis.panel[axis] = m.panel
    this.axis.plane[axis] = m.plane
    this.scene.scene.add(this.axis.panel[axis]) // 添加预览面到场景
    for (const i in this.axis.enable) { // 遍历三个轴
      if (this.axis.enable[i] && this.axis.plane[i]) {
        clipPlanes.push(this.axis.plane[i])
        this.axis.panel[i].visible = true
      }
    }
    this.scene.entities.map(item => {
      item.object3d.children.map(obj => {
        this.setClipPlanes(obj, clipPlanes) // 设置场景内实体的剪裁面
      })
    })
    this.scene.render(true)
  }
  /**
   * 设置三维物体剪裁面
   * @param {Object3D} obj
   * @param {Plane} clipPlanes
   * @memberof Cut
   */
  setClipPlanes (obj, clipPlanes) {
    if (obj.material) {
      obj.material.clippingPlanes = clipPlanes
      obj.material.clipIntersection = true
    }
    if (obj.children && obj.children.length) {
      obj.children.map(item => {
        this.setClipPlanes(item)
      })
    }
  }
  /**
   * 设置剪裁位置
   * @param {String} axis
   * @param {Number} position
   * @memberof Cut
   */
  setAxisPosition (axis, position) {
    this.axis.panel[axis].position[axis] = parseFloat(position)
    this.axis.plane[axis].constant = parseFloat(position)
    this.scene.render(true)
  }
  /**
   * 取消剪裁
   * @memberof Cut
   */
  destroy () {
    this.scene.removeEventListener('entitiesChange', this.resetCutPanel)
    this.scene.renderer[0].localClippingEnabled = false
    this.scene.renderer[1].localClippingEnabled = false
    const arr = ['x', 'y', 'z']
    arr.map(item => {
      disposeObj3d(this.axis.panel[item])
      disposeObj3d(this.axis.plane[item])
    })
  }
}
// 生成剖切面
function makeAxisPanel (axis) {
  axis = axis.toLowerCase()
  const isX = axis === 'x'
  const isY = axis === 'y'
  const isZ = axis === 'z'
  // debugger
  const box3 = this.scene.getBoxRange().box3
  const center = box3.getCenter()
  const size = {
    x: box3.max.x - box3.min.x,
    y: box3.max.y - box3.min.y,
    z: box3.max.z - box3.min.z
  }
  const len = { // 对角线长度
    x: Math.sqrt(Math.pow(size.z, 2) + Math.pow(size.y, 2)),
    y: Math.sqrt(Math.pow(size.z, 2) + Math.pow(size.x, 2)),
    z: Math.sqrt(Math.pow(size.x, 2) + Math.pow(size.y, 2))
  }
  const a = isX ? len.x : isY ? len.y : len.z // 长
  const b = isX ? len.z : isY ? len.x : len.x // 宽
  const c = isX ? 0xff0000 : isY ? 0x00ff00 : 0x0000ff // 颜色
  // const c = 0xFFFFFF
  const pg = new PlaneGeometry(a, b)
  const pm = new MeshBasicMaterial({
    wireframe: false,
    color: c,
    transparent: true,
    opacity: 0.5,
    side: DoubleSide
  })
  const p = new Mesh(pg, pm)
  p.visible = false
  p.position.copy(center)
  // 旋转
  // if (isX) { p.rotation.x = 0.5 * Math.PI; p.rotation.y = Math.PI ; p.rotation.z = -(Math.PI * 90 / 180); }
  // if (isY) { p.rotation.x = Math.PI; }
  // if (isZ) { p.rotation.y = Math.PI; }

  if (isX) { p.rotation.y = -0.5 * Math.PI; p.rotation.y += Math.PI }
  if (isY) { p.rotation.x = -0.5 * Math.PI; p.rotation.x += Math.PI; p.rotation.y += Math.PI }
  if (isZ) { p.rotation.x = Math.PI }

  const x = isX ? -1 : 0
  const y = isY ? -1 : 0
  const z = isZ ? -1 : 0
  const plane = new Plane(new Vector3(x, y, z), 0)

  return {
    panel: p,
    plane
  }
}
