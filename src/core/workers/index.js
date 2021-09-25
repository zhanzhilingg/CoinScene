//
onmessage = function (object3d) {
  const result = computeBoundingSphere(object3d)
  postMessage(result)
}
//
function computeBoundingSphere (object3d) {
}
