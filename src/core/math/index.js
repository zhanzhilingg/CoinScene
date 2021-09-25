import { Vector3 } from 'three'

export const DEG90 = Math.PI * 0.5
export const DEG180 = Math.PI

/**
 * 计算两点之间的距离
 *
 * @param {Vector3} point1
 * @param {Vector3} point2
 * @return {Number}
 */
export function calcP2PDistance (point1, point2) {
  if (!(point1 instanceof Vector3)) {
    throw new Error('can not calculate distance form ' + typeof point1)
  }
  if (!(point2 instanceof Vector3)) {
    throw new Error('can not calculate distance form ' + typeof point2)
  }
  return Math.sqrt(
    Math.pow(point1.x - point2.x, 2) +
    Math.pow(point1.y - point2.y, 2) +
    Math.pow(point1.z - point2.z, 2)
  )
}
