/* eslint-disable no-useless-constructor */
import {
  BufferGeometry,
  MeshLambertMaterial,
  BufferAttribute,
  Mesh,
  DoubleSide,
  TextureLoader,
  NearestFilter
} from 'three'
import Feature from '../../Feature'
import VoxelWorld from './VoxelWorld'
export default class Voxel extends Feature {
  /**
   * 体素模型
   * @param {Object} options
   * @extends {Feature}
   * @constructs Voxel
   * @author zhanzl
   */
  constructor (options) {
    super(options)
  }
  /**
   * 添加
   * @param {Scene} scene 添加到的CoinScene实例
   * @memberof Voxel
   */
  addTo (scene) {
    const { cellSize } = this
    const world = new VoxelWorld(this)
    console.log(new Date())
    for (let y = 0; y < cellSize; ++y) {
      for (let z = 0; z < cellSize; ++z) {
        for (let x = 0; x < cellSize; ++x) {
          const height = (Math.sin(x / cellSize * Math.PI * 2) + Math.sin(z / cellSize * Math.PI * 3)) * (cellSize / 6) + (cellSize / 2)
          if (y < height) {
            const b = randInt(1, 18) // 使用不同材质
            // console.log(b)
            world.setVoxel(x, y, z, b)
          }
        }
      }
    }
    console.log(new Date())

    function randInt (min, max) {
      return Math.floor(Math.random() * (max - min) + min)
    }
    const url = this.tileTexture
    const loader = new TextureLoader()
    const texture = loader.load(url)
    texture.magFilter = NearestFilter
    texture.minFilter = NearestFilter
    texture.imageUrl = url
    //
    console.log(new Date())
    const { positions, normals, uvs, indices } = world.generateGeometryDataForCell(0, 0, 0)
    console.log(new Date())
    const geometry = new BufferGeometry()
    const material = new MeshLambertMaterial({
      map: texture,
      side: DoubleSide,
      alphaTest: 1,
      transparent: true
    })
    const positionNumComponents = 3
    const normalNumComponents = 3
    const uvNumComponents = 2
    geometry.setAttribute('position', new BufferAttribute(new Float32Array(positions), positionNumComponents))
    geometry.setAttribute('normal', new BufferAttribute(new Float32Array(normals), normalNumComponents))
    geometry.setAttribute('uv', new BufferAttribute(new Float32Array(uvs), uvNumComponents))
    geometry.setIndex(indices)
    const mesh = new Mesh(geometry, material)
    this.object3d.add(mesh)
    super.addTo(scene)
    this.scene.render(true)
    return this
  }
}
