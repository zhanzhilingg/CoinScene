/* eslint-disable no-proto */
/* eslint-disable standard/no-callback-literal */
/**
 * 监听数组变化
 * @param {Array} array 监听的数组
 * @param {function} callback 监听回调
 * @memberof utils
 */
export default function onChange (arr, callback) {
  // 获取Array的原型，并创建一个新的对象指向这个原型
  const arrayMethods = Object.create(Array.prototype)
  // 创建一个新的原型，这就是改造之后的数组原型
  // eslint-disable-next-line standard/computed-property-even-spacing
  const ArrayProto = []
  // 重新构建Array原型里面的虽有方法
  const methodsArr = [ 'push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse' ]
  methodsArr.forEach(method => {
    if (typeof arrayMethods[method] === 'function') {
      ArrayProto[method] = function () {
        const result = arrayMethods[method].apply(this, arguments)
        if (typeof callback === 'function') {
          callback(this, arguments, result)
        }
      }
    } else {
      ArrayProto[method] = arrayMethods[method]
    }
  })
  arr.__proto__ = ArrayProto
}
