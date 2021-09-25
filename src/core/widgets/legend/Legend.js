/* eslint-disable no-dupe-class-members */
import { Color, Texture } from 'three'
import Widgets from '../Base'
import { Tiles, Model } from '@core/entities'
import config from '@core/config/config'
// import cloneDeep from 'lodash.clonedeep'
export default class Legend extends Widgets {
  /**
   * 名称
   * @readonly
   * @memberof Legend
   */
  get name () {
    return 'Legend'
  }
  /**
   * css name
   * @private
   * @memberof Legend
   */
  _cssName= {
    main: config.name + this.name,
    title: config.name + this.name + '-title',
    legendItem: config.name + this.name + '-item',
    legendTitle: config.name + this.name + '-item-title',
    legendContent: config.name + this.name + '-item-content',
    legendItemOne: config.name + this.name + '-item-one',
    open: 'iconfont icon-plus',
    close: 'iconfont icon-reduce'
  }
  /**
   * html icon dom
   * @private
   * @memberof Legend
   */
  _triggerIcon= document.createElement('i')
  /**
   * 图例
   * @constructs Legend
   * @extends {Widgets}
   * @author zhanzl
   */
  constructor () {
    super()
    this.domElement.className = this._cssName.main
    const titlediv = document.createElement('div')
    titlediv.className = this._cssName.title
    titlediv.innerText = '图例'
    this._triggerIcon.className = this._cssName.close
    // trigger legend div
    this._triggerIcon.addEventListener('click', (e) => {
      const divs = this.domElement.getElementsByClassName(this._cssName.legendContent)
      const className = this._triggerIcon.className
      if (className === this._cssName.close) {
        for (let i = 0; i < divs.length; i++) {
          divs[i].style.display = 'none'
        }
        this._triggerIcon.className = this._cssName.open
      } else if (className === this._cssName.open) {
        for (let i = 0; i < divs.length; i++) {
          divs[i].style.display = 'block'
        }
        this._triggerIcon.className = this._cssName.close
      }
    })
    titlediv.appendChild(this._triggerIcon)
    this.domElement.appendChild(titlediv)
    // bind this
    this._modelLoaded = this._modelLoaded.bind(this)
    this._tilesUpdate = this._tilesUpdate.bind(this)
    this._entitiesChange = this._entitiesChange.bind(this)
  }
  /**
   * 添加到场景
   * @param {Scene} scene CoinScene实例
   * @return {Widgets} 小组件实例
   * @memberof Legend
   */
  addTo (scene) {
    super.addTo(scene)
    this.scene.addEventListener('entitiesChange', this._entitiesChange)
    // cancel camera control
    this.scene.outOfControl(this.domElement)
    return this
  }
  /**
   * 场景实体发生变化 => 图例更新
   * @private
   * @param {Legend} event this
   * @memberof Legend
   */
  _entitiesChange (e) {
    // debugger
    const arr = e.array
    const legendsItemDivs = this.domElement.getElementsByClassName(this._cssName.legendItem)
    // 清除已被绘制过且被移除出entities的图例
    for (let j = legendsItemDivs.length - 1; j >= 0; j--) {
      let isHas = false
      for (let i = 0; i < arr.length; i++) {
        if (legendsItemDivs[j].id === arr[i].id) {
          isHas = true
          break
        }
      }
      if (!isHas) {
        legendsItemDivs[j].remove()
      }
    }
    // 更新图例
    for (let i = 0; i < arr.length; i++) {
      const item = arr[i]
      if (item.legends && item.legends.length) {
        const dom = this.#parseToDom(item, item.legends)
        this.#addLegendsDom(item.id, dom)
      } else {
        if (item instanceof Model) {
          item.addEventListener('loaded', this._modelLoaded)
        } else if (item instanceof Tiles) {
          item.addEventListener('updated', this._tilesUpdate)
        }
      }
    }
  }
  /**
   * set legends when model has loaded
   *
   * @param {Object} e model loaded event
   * @memberof Legend
   * @private
   */
  _modelLoaded (e) {
    const model = e.target
    const legends = model.legends
    const dom = this.#parseToDom(model, legends)
    this.#addLegendsDom(model.id, dom)
  }
  /**
   * set legends when tiles updated
   *
   * @param {Object} e tiles update event
   * @memberof Legend
   * @private
   */
  _tilesUpdate (e) {
    const model = e.target
    const legends = model.legends
    const dom = this.#parseToDom(model, legends)
    this.#addLegendsDom(model.id, dom)
  }
  /**
   * 添加一项图例
   * @private
   * @param {String} id entity id => legends HTMLElement id
   * @returns {HTMLElement} dom
   * @memberof Legend
   */
  #addLegendsDom (id, dom) {
    const el = document.getElementById(id)
    if (el) {
      const oldContent = el.getElementsByClassName(this._cssName.legendContent)
      const content = dom.getElementsByClassName(this._cssName.legendContent)
      if (content && content[0] && oldContent && oldContent[0]) {
        content[0].style.display = oldContent[0].style.display
      }
      el.remove()
    }
    this.domElement.appendChild(dom)
  }
  /**
   * 生成图例的style
   * @private
   * @param {Array} legends entity属性 图例数据
   * @returns {Map} [{name: String, style: []}]
   * @memberof Legend
   */
  #parseLegendsToStyle (legends) {
    const styles = new Map()
    legends.map(item => {
      const obj = { name: item.name, style: [] }
      if (Array.isArray(item.color)) {
        for (let i = 0; i < item.color.length; i++) {
          const color = item.color[i]
          if (!color) {
            continue
          } else if (color instanceof Color) {
            const str = `backgroundColor|${color.getStyle()}`
            obj.style.push(str)
          } else {
            debugger
          }
        }
      }
      if (Array.isArray(item.map)) {
        for (let i = 0; i < item.map.length; i++) {
          const t = item.map[i]
          if (!t) {
            continue
          } else if (t instanceof Texture) {
            const str = `backgroundImage|url(${t.imageUrl})`
            obj.style.push(str)
          } else {
            debugger
          }
        }
      }
      // 材质相同的设为同一项，名字用逗号隔开
      const key = obj.style.join('#')
      if (styles.has(key)) {
        const old = styles.get(key)
        obj.name += `, ${old.name}`
      }
      styles.set(key, obj)
    })
    return styles
  }
  /**
   * 生成图例HtmlElement
   * @private
   * @param {Object} item entity
   * @param {Array} legends entity属性 图例数据
   * @returns {HTMLElement} dom
   * @memberof Legend
   */
  #parseToDom (item, legends) {
    const itemdiv = document.createElement('div')
    itemdiv.id = item.id
    itemdiv.className = this._cssName.legendItem
    const itemTitle = document.createElement('div')
    itemTitle.className = this._cssName.legendTitle
    itemTitle.innerText = item.name
    itemTitle.addEventListener('click', () => {
      let show = itemTitle.nextSibling.style.display
      if (show === '') show = 'block'
      if (show === 'none') {
        itemTitle.nextSibling.style.display = 'block'
      } else if (show === 'block') {
        itemTitle.nextSibling.style.display = 'none'
      }
      const divs = this.domElement.getElementsByClassName(this._cssName.legendContent)
      let hasOpen = false
      for (let i = 0; i < divs.length; i++) {
        if (divs[i].style.display === 'block') {
          hasOpen = true
        }
      }
      if (hasOpen) {
        this._triggerIcon.className = this._cssName.close
      } else {
        this._triggerIcon.className = this._cssName.open
      }
    })
    itemdiv.appendChild(itemTitle)
    const itemContent = document.createElement('div')
    itemContent.className = this._cssName.legendContent
    itemdiv.appendChild(itemContent)
    // 生成图例样式
    const styles = this.#parseLegendsToStyle(legends)
    styles.forEach((val) => {
      const legendOne = document.createElement('div')
      legendOne.className = this._cssName.legendItemOne
      legendOne.setAttribute('title', val.name)
      val.style.map(styleItem => {
        const arr = styleItem.split('|')
        legendOne.style[arr[0]] = arr[1]
      })
      itemContent.appendChild(legendOne)
    })
    return itemdiv
  }
  /**
   * 销毁
   * @memberof Legend
   */
  destroy () {
    this.domElement.remove()
    this.scene.removeEventListener('entitiesChange', this._entitiesChange)
    this.scene.entities.map(item => {
      if (item instanceof Model) {
        item.removeEventListener('loaded', this._modelLoaded)
      }
      if (item instanceof Tiles) {
        item.removeEventListener('updated', this._tilesUpdate)
      }
    })
    this.scene.cameraControls.enabled = true
  }
}
