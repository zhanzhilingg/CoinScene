import { Object3D } from 'three'
import Feature from '../Feature'
export default class Point extends Feature {
  object3d= new Object3D()
  constructor ({ url }) {
    super()
  }

  addTo (CoinScene) {
  }
}
