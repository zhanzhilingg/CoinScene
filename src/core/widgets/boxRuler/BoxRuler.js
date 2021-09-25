// import * as THREE from 'three'
import config from '@core/config/config'
import {
  Box3,
  BufferGeometry,
  BufferAttribute,
  Points,
  Object3D,
  Vector3,
  PointsMaterial,
  Vector2,
  Texture,
  SpriteMaterial,
  Sprite
} from 'three'
import { calcP2PDistance } from '@core/math'
import Widgets from '../Base'
import { cloneDeep } from 'lodash'
import { Model, Tiles } from '@core/entities'
import { disposeObj3d, pxConversionMm, mmConversionPx, getViewDisFromCamera } from '@/core/utils'
export default class BoxRuler extends Widgets {
  /**
   * 名称
   *
   * @readonly
   * @memberof BoxRuler
   */
  get name () {
    return 'BoxRuler'
  }
  /**
   * css name
   * @private
   * @memberof BoxRuler
   */
  _cssName= config.name + this.name

  /**
   * object 3d
   * @memberof BoxRuler
   */
  object3d= new Object3D()

  /**
   * three boxhelper
   * @private
   * @memberof BoxRuler
   */
  _boxHelper= null

  /**
   * 标注边框颜色
   * @describe {Object} { r, g, b, a }
   * @memberof BoxRuler
   */
  borderColor= { r: 24, g: 144, b: 255, a: 1 }
  /**
   * 标注背景颜色
   * @describe {Object} { r, g, b, a }
   * @memberof BoxRuler
   */
  backgroundColor= { r: 0, g: 0, b: 0, a: 0 }

  /**
   * 标注字体颜色
   * @describe {Object} { r, g, b, a }
   * @memberof BoxRuler
   */
  fontcolor= { r: 24, g: 144, b: 255, a: 1 }

  /**
   * three box
   * @describe {THREE.Box3}
   * @private
   * @memberof BoxRuler
   */
  _box= new Box3()

  /**
   * 标注字体颜色
   * @describe {THREE.Vector3}
   * @private
   * @memberof BoxRuler
   */
   _scale= new Vector3(1, 1, 1)

   /**
   * 三维刻度尺
   * @constructs BoxRuler
   * @extends {Widgets}
   * @author zhanzl
   */
   constructor () {
     super()
     this.domElement.className = this._cssName
   }

   /**
   * 添加到场景
   * @param {Scene} scene CoinScene实例
   * @return {Widgets} 小组件实例
   * @memberof BoxRuler
   */
   addTo (scene) {
     super.addTo(scene)
     this._init()
     this._resize = this._resize.bind(this)
     this._update = this._update.bind(this)
     this._entitiesChange = this._entitiesChange.bind(this)
     //  this.scene.addEventListener('inited', this._init)
     this.scene.addEventListener('entitiesChange', this._entitiesChange)
     this.scene.addEventListener('cameraChange', this._update)
     return this
   }

   /**
   * 初始化组件
   * @private
   * @memberof BoxRuler
   */
   _init () {
     // 初始化包围盒
     this.initBoxHelper()
     // 点尺寸(刻度)
     const psize = calcP2PDistance(this.scene.cameraControls.getPosition(), new Vector3(0, 0, 0)) / 10
     const geometry = new BufferGeometry()
     // 所有点
     geometry.vertices = this.getCalibrations()
     geometry.verticesNeedUpdate = true
     // 点材质
     const material = new PointsMaterial({ color: 0x1890ff, size: psize })
     // 刻度
     this.calibrations = new Points(geometry, material)
     this.calibrations.matrixWorldNeedsUpdate = true
     this.calibrations.visible = false
     this.object3d.add(this.calibrations)
     // 标签组
     this.calibrationLabels = new Object3D()
     this.object3d.add(this.calibrationLabels)
     this.scene.scene.add(this.object3d)
   }

   /**
   * 生成场景包围盒
   *
   * @memberof BoxRuler
   */
   initBoxHelper () {
     //
     if (this._boxHelper) {
       disposeObj3d(this._boxHelper)
       this.object3d.remove(this._boxHelper)
     }
     const { box, vec3Arr } = this.scene.getBoxRange()
     this._boxHelper = box
     this._box = new Box3().setFromPoints(vec3Arr)
     this.object3d.add(this._boxHelper)
     return this._boxHelper
   }

   /**
   * 监听场景entities数组变化 => 重新计算范围边界 => 更新刻度及标注
   * @private
   * @memberof BoxRuler
   */
   _entitiesChange () {
     this._resize()
     this.scene.entities.map(item => {
       if (item instanceof Model || item instanceof Tiles) {
         item.addEventListener('loaded', () => {
           this._resize()
         })
       }
     })
   }

   /**
   * 适应场景范围边界改变
   *
   * @memberof BoxRuler
   */
   resize () {
     console.log('box ruler resize')
     this.initBoxHelper()
     this.updateCalibration()
     this.updateCalibLabel()
     this.scene.render(true)
   }

   /**
   * 适应场景范围边界改变 节流处理
   * @private
   * @memberof BoxRuler
   */
   _resize () {
     if (this.resizeTimer) {
       clearTimeout(this.resizeTimer)
     }
     const resizeBoxHelper = () => {
       this.resizeTimer = setTimeout(() => {
         this.resize()
       }, 1500)
     }
     // 节流处理 只在最后镜头停下时
     resizeBoxHelper()
   }

   /**
   * 更新（视角改变、场景范围边界改变时调用）
   *
   * @memberof BoxRuler
   */
   update () {
     console.log('box ruler updated')
     this.updateCalibration()
     this.updateCalibLabel()
     this.scene.render(true)
   }

   /**
   * 更新（视角改变、场景范围边界改变时调用）节流处理
   * @private
   * @memberof BoxRuler
   */
   _update (event) {
     //  console.log(event)
     if (this.updateTimer) {
       clearTimeout(this.updateTimer)
     }
     const updateBoxhelper = () => {
       this.updateTimer = setTimeout(() => {
         this.update()
       }, 500)
     }
     updateBoxhelper()
   }

   getScalerNum () {
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
     const scaler = d1 / d2
     //
     let scaleNumbers = [2, 5, 10]
     for (let i = 0; i < scaleNumbers.length; i++) {
       const num = scaleNumbers[i]
       let numtxt = ''
       const pxLen = mmConversionPx(scaler * num * 1000)
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

   /**
   * 获取所有刻度点
   *
   * @memberof BoxRuler
   */
   getCalibrations () {
     const dx = 2 * this.getScalerNum().num
     const dy = calcd(this._box, 'y')
     const dz = 2 * this.getScalerNum().num
     const scale = this._scale
     const pcount = this._boxHelper.geometry.attributes.position.count
     const p = this._boxHelper.geometry.attributes.position.array
     let vs = []
     // boxHelper（js内置对象） 的8个顶点
     /*
          5____4
        1/___0/|
        | 6__|_7
        2/___3/
    */
     for (let i = 0; i < pcount; i++) {
       // 每三个坐标为一个点
       const x = p[i * 3 + 0]
       const y = p[i * 3 + 1]
       const z = p[i * 3 + 2]
       // new V3
       const v = new Vector3(x, y, z)
       // 显示三个轴
       v.showaxis = 'all'
       v.showtxt = parseBoxLabelText(null, v, scale)
       vs.push(v)
     }
     const v0 = vs[0]; const v1 = vs[1]; const v2 = vs[2]; const v3 = vs[3]; const v4 = vs[4]; const v5 = vs[5]; const v6 = vs[6]; const v7 = vs[7]
     // 等分间距
     const county = Math.floor((v0.y - v3.y) / (dy * scale.y))
     const countx = Math.floor((v0.x - v1.x) / (dx * scale.x))
     const countz = Math.floor((v0.z - v4.z) / (dz * scale.z))
     // 根据顶点计算包围盒每条线上的点
     const verticesX = makeVertices(countx, [v2, v6], dx, 'x', scale)
     const verticesY = makeVertices(county, [v3, v6], dy, 'y', scale)
     const verticesZ = makeVertices(countz, [v6, v7], dz, 'z', scale)
     //
     vs = vs.concat(verticesX, verticesY, verticesZ)

     return vs
   }

   /**
   * 更新刻度点
   *
   * @memberof BoxRuler
   */
   updateCalibration () {
     if (this.calibrations) {
       const psize = calcP2PDistance(this.scene.cameraControls.getPosition(), new Vector3(0, 0, 0)) / 10
       this.calibrations.geometry.vertices = this.getCalibrations()
       this.calibrations.material.size = psize
     }
   }

   /**
   * 移除所有标注
   *
   * @memberof BoxRuler
   */
   removeLabels () {
     //
     for (let n = this.calibrationLabels.children.length - 1; n >= 0; n--) {
       disposeObj3d(this.calibrationLabels.children[n])
       this.calibrationLabels.remove(this.calibrationLabels.children[n])
     }
     this.calibrationLabels.children.length = 0
   }

   /**
   * 更新标注
   *
   * @memberof BoxRuler
   */
   updateCalibLabel () {
     //
     if (this.calibrationLabels) {
       this.removeLabels() // 移除上一次的标签
     }
     // 点数据
     const vertices = this.calibrations.geometry.vertices
     for (let i = 0; i < vertices.length; i++) {
       // 字体尺寸(尺寸)(精灵材料缩放)
       // 当前点到原始相机位置的距离/5
       const tsize = calcP2PDistance(vertices[i], this.scene.cameraControls._position0) / 4.5
       const scale = { x: parseInt(tsize / 1.5), y: parseInt(tsize / 3), z: 0 }
       // 生成标签
       const label = makeLabel(vertices[i], {
         borderColor: this.borderColor,
         backgroundColor: this.backgroundColor,
         fontcolor: this.fontcolor,
         scale: scale
       })
       if (!label) continue
       // 添加标签
       this.calibrationLabels.add(label)
       //
       if (this.calibrationLabels.children[i]) {
         // 调整位置
         this.calibrationLabels.children[i].position.copy(vertices[i])
         const p1 = this.scene.cameraControls._position0
         const p2 = this.scene.camera.position
         const p3 = this.calibrationLabels.children[i].position0
         const p4 = this.calibrationLabels.children[i].position
         // console.log('p3:' + JSON.stringify(p3))
         // console.log('p4:' + JSON.stringify(p4))
         // 点(当前)--镜头(当前)
         const dis1 = calcP2PDistance(p4, p2)
         // // 点(当前)--镜头(原始)
         // let dis2 = calcP2PDistance(p4, p1);
         // 点(原始)--镜头(原始)
         const dis3 = calcP2PDistance(p3, p1)
         // // 点(原始)--镜头(当前)
         // let dis4 = calcP2PDistance(p3, p2);
         //
         const preScalar = this.calibrationLabels.children[i].scalar
         const scalar = dis1 / dis3
         if (scalar !== preScalar) {
           // 更新缩放乘数值
           this.calibrationLabels.children[i].scalar = scalar
           // 原始缩放比例
           const scale0 = this.calibrationLabels.children[i].scale0
           const scale = {
             x: scale0.x * scalar,
             y: scale0.y * scalar,
             z: scale0.z * scalar
           }
           this.calibrationLabels.children[i].scale.set(scale.x, scale.y, scale.z)
         }
       }
     }
   }
   /**
   * 销毁
   *
   * @memberof BoxRuler
   */
   destroy () {
     super.destroy()
     this.scene.removeEventListener('inited', this._init)
     this.scene.removeEventListener('entitiesChange', this._entitiesChange)
     this.scene.removeEventListener('cameraChange', this._update)
     disposeObj3d(this.object3d)
   }
}

// 创建标注
function makeLabel (vertice, style) {
  // 生成点的时候showaxis已被赋值
  const axis = vertice.showaxis
  if (!axis) return false
  let text = vertice.showtxt[axis]
  if (axis === 'all') {
    text = `${vertice.showtxt.x}, ${vertice.showtxt.y}, ${vertice.showtxt.z}`
  }
  const txt = makeTextSprite(text, {
    fontsize: 24,
    borderColor: style.borderColor, /* 边框颜色 */
    backgroundColor: style.backgroundColor, /* 背景颜色 */
    fontcolor: style.fontcolor, /* 字体颜色 */
    scale: style.scale,
    borderThickness: 1
  })
  txt.center = new Vector2(0, 0.9)
  txt.position.copy(vertice)
  txt.position0 = txt.position.clone() // 记录原始位置
  txt.scale0 = txt.scale.clone() // 记录原始缩放值
  return txt
}

// 创建精灵材质
function makeTextSprite (message, parameters) {
  if (parameters === undefined) parameters = {}
  /* 绘制圆角矩形 */
  const roundRect = function (ctx, x, y, w, h, r) {
    ctx.beginPath()
    ctx.moveTo(x + r, y)
    ctx.lineTo(x + w - r, y)
    ctx.quadraticCurveTo(x + w, y, x + w, y + r)
    ctx.lineTo(x + w, y + h - r)
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
    ctx.lineTo(x + r, y + h)
    ctx.quadraticCurveTo(x, y + h, x, y + h - r)
    ctx.lineTo(x, y + r)
    ctx.quadraticCurveTo(x, y, x + r, y)
    ctx.closePath()
    ctx.fill()
    ctx.stroke()
  }
  /* 缩放 */
  const scale = !parameters.scale ? { x: 10000, y: 5000, z: 0 } : parameters.scale
  // 字体
  const fontface = !parameters.fontface ? 'Microsoft YaHei,siyuan' : parameters.fontface
  /* 字体大小 */
  const fontsize = !parameters.fontsize ? 18 : parameters.fontsize
  /* 边框厚度 */
  const borderThickness = !parameters.borderThickness ? 4 : parameters.borderThickness
  // 字体颜色
  const fontcolor = !parameters.fontcolor ? { r: 0, g: 0, b: 0, a: 1.0 } : parameters.fontcolor
  /* 边框颜色 */
  const borderColor = !parameters.borderColor ? { r: 0, g: 0, b: 0, a: 0 } : parameters.borderColor
  /* 背景颜色 */
  const backgroundColor = !parameters.backgroundColor ? { r: 255, g: 255, b: 255, a: 0 } : parameters.backgroundColor
  /* 画布尺寸 */
  const size = !parameters.size ? undefined : parameters.size
  /* 创建画布 */
  const canvas = document.createElement('canvas')
  canvas.width = 256
  canvas.height = 128
  if (size) {
    canvas.width = size.width
    canvas.height = size.height
  }
  const context = canvas.getContext('2d')
  /* 字体加粗 */
  context.font = `normal ${fontsize}px ${fontface}`
  /* 获取文字的大小数据，高度取决于文字的大小 */
  const metrics = context.measureText(message)
  const textWidth = metrics.width
  /* 背景颜色 */
  context.fillStyle = `rgba(${backgroundColor.r},${backgroundColor.g},${backgroundColor.b},${backgroundColor.a})`
  /* 边框的颜色 */
  context.strokeStyle = `rgba(${borderColor.r},${borderColor.g},${borderColor.b},${borderColor.a})`
  context.lineWidth = borderThickness
  /* 绘制圆角矩形 */
  roundRect(context, borderThickness / 2, borderThickness / 2, textWidth + borderThickness, fontsize * 1.4 + borderThickness, 6)
  /* 字体颜色 */
  context.fillStyle = `rgba(${fontcolor.r}, ${fontcolor.g}, ${fontcolor.b}, ${fontcolor.a})`
  context.fillText(message, borderThickness, fontsize + borderThickness)
  /* 画布内容用于纹理贴图 */
  const texture = new Texture(canvas)
  texture.needsUpdate = true
  const spriteMaterial = new SpriteMaterial({ map: texture })
  const sprite = new Sprite(spriteMaterial)
  // console.log(sprite.spriteMaterial);
  /* 缩放比例 */
  sprite.scale.copy(scale)
  return sprite
}
// 创建三维点
function makeVertices (count, plane, d, axis, scale) {
  //
  const pointsOnAxis = []
  // 与 axis 轴平行的四条边上的点（刻度）
  for (let i = 1; i < count; i++) {
    // 每个刻度之间的间距
    const di = d * i * scale[axis]
    const cplane = cloneDeep(plane)
    for (let j = 0; j < cplane.length; j++) {
      const vec = new Vector3(cplane[j].x, cplane[j].y, cplane[j].z)
      vec[axis] += di
      // 每个刻度显示的数字的所属轴
      vec.showaxis = axis
      // 计算显示（真实）的坐标值
      vec.showtxt = parseBoxLabelText(cplane[0], vec, scale, d)
      // 误差处理// 加上被取整操作减去的量
      vec[axis] += (vec.showtxt[axis] - vec.showtxt['_' + axis])
      // 存储所有点
      pointsOnAxis.push(vec)
    }
  }
  return pointsOnAxis
}
// 拼接标注文字
function parseBoxLabelText (vec0, vertice, scale, d) {
  const showtxt = {}
  if (vertice.showaxis !== 'all') {
    const a = vertice.showaxis
    if (vertice[a] !== undefined) {
      // 真实坐标
      const num = parseInt(vertice[a] / scale[a])
      const num0 = parseInt(vec0[a])
      // 取整
      showtxt['_' + a] = num
      showtxt[a] = calcInteger(num0, num, d)
    }
  } else {
    // 显示三维坐标，三个值
    showtxt.x = parseInt(vertice.x / scale.x)
    showtxt.y = parseInt(vertice.y / scale.y)
    showtxt.z = parseInt(vertice.z / scale.z)
  }
  return showtxt
}
// 取整
function calcInteger (num0, num, d) {
  if (d === undefined) {
    return num
  }
  num = num - ((num - num0) % d) // 模除取余，减去余数就是d倍数
  return num
}
// 计算刻度间隔
function calcd (box, axis) {
  const range = Math.abs(parseInt(box.max[axis] - box.min[axis]))
  const _range = range / 10
  const l = parseInt(_range).toString().length + 1
  let d = 1
  for (let i = 1; i < l; i++) {
    d *= 10
  }
  const ds = [d, 2 * d, 5 * d, 10 * d]
  let s = ds[0]
  for (let i = 1; i < ds.length; i++) {
    if (Math.abs(_range - s) > Math.abs(_range - ds[i])) {
      s = ds[i]
    }
  }
  return s
}
