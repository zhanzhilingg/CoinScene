/* eslint-disable no-array-constructor */
import onChange from './watchArray'
import { Box3, Vector3, Sphere } from 'three'

/**
 * 销毁三维对象
 *
 * @param {THREE.Object3D} object
 * @memberof utils
 */
export function disposeObj3d (obj) {
  if (obj.parent) {
    obj.parent.remove(obj)
    obj.remove()
  }
  if (obj.geometry) {
    obj.geometry.dispose()
  }
  if (obj.material) {
    if (obj.material.length) {
      for (let i = 0; i < obj.material.length; ++i) {
        obj.material[i].dispose()
      }
    } else {
      if (obj.material.dispose) {
        obj.material.dispose()
      }
    }
  }
  if (obj.children && obj.children.length) {
    obj.children.forEach(element => {
      obj.remove(element)
      if (element.children && element.children.length) {
        disposeObj3d(element)
      }
    })
  }
}

/**
 * 计算原型包围盒
 *
 * @param {THREE.Object3D} object
 * @returns {Sphere}
 * @memberof utils
 */
export function computeBoundingSphere (object3d) {
  // const myWorker = new Worker('../workers/index.js')
  // myWorker.postMessage(this.scene)
  // myWorker.onmessage = (e) => {
  //   debugger
  // }
  const _box = new Box3()
  const _vec3 = new Vector3()
  // var meshCount = 0;
  const points = []
  const boundingSphere = new Sphere()
  const center = boundingSphere.center
  // find the center
  object3d.traverse(function (object) {
    if (!object.isMesh) return
    _box.expandByObject(object)
  })
  _box.getCenter(center)
  // find the radius
  var maxRadiusSq = 0
  object3d.traverse(function (object) {
    if (!object.isMesh) return
    const position = object.geometry.attributes.position
    for (var i = 0, l = position.count; i < l; i++) {
      _vec3.fromBufferAttribute(position, i)
      maxRadiusSq = Math.max(maxRadiusSq, center.distanceToSquared(_vec3))
    }
  })
  boundingSphere.radius = Math.sqrt(maxRadiusSq)
  return boundingSphere
}

// 屏幕像素密度
let dpi = []
// 获取屏幕像素密度
function getDPI () {
  // eslint-disable-next-line no-array-constructor
  if (dpi.length) {
    return dpi
  }
  var arrDPI = new Array()
  if (window.screen.deviceXDPI) {
    arrDPI[0] = window.screen.deviceXDPI
    arrDPI[1] = window.screen.deviceYDPI
  } else {
    var tmpNode = document.createElement('DIV')
    tmpNode.style.cssText = 'width:1in;height:1in;position:absolute;left:0px;top:0px;z-index:99;visibility:hidden'
    document.body.appendChild(tmpNode)
    arrDPI[0] = parseInt(tmpNode.offsetWidth)
    arrDPI[1] = parseInt(tmpNode.offsetHeight)
    tmpNode.parentNode.removeChild(tmpNode)
  }
  dpi = arrDPI
  return arrDPI
}
/**
 * px转换为mm
 * @param {Number} value 像素
 * @return {Number} 毫米
 * @memberof utils
 */
export function pxConversionMm (value) {
  var inch = value / getDPI()[0]
  var c_value = inch * 25.4
  return c_value
}
/**
 * mm转换为px
 * @param {Number} value 毫米
 * @return {Number} 像素长度
 * @memberof utils
 */
export function mmConversionPx (value) {
  var inch = value / 25.4
  var c_value = inch * getDPI()[0]
  return c_value
}

/**
 * 屏幕实际距离（米）
 * @param {THREE.PerspectiveCamera} c
 * @return {Number} 实际距离 米
 * @memberof utils
 */
export function getViewDisFromCamera (camera) {
  // 相机位置
  const p = camera.position
  // 相机到场景中心点距离
  const d0 = Math.sqrt(Math.pow(p.x, 2) + Math.pow(p.y, 2) + Math.pow(p.z, 2))
  // 夹角
  const n = camera.fov
  // 视域距离
  const d = 2 * d0 * Math.tan(n / 2)
  // let d = d0 * Math.sin(n)
  return d
}

export { onChange }
