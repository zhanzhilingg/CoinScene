import { Group } from 'three'
import Layer from '../Layer'

export default class LineLayer extends Layer {
  object3d= new Group()
  constructor ({ url }) {
    super()
  }

  addTo (CoinScene) {
  }
}
