import { Object3D } from 'three'
import Feature from '../Feature'
export default class Label extends Feature {
  object3d= new Object3D()
  constructor ({ url }) {
    super()
  }

  addTo (CoinScene) {
  }
}
