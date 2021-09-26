<script lang='jsx'>
import { defineComponent, reactive } from 'vue'
import { config } from '@core/config'
import { Cut } from '@core/controls'
// version infomation
const info = {
  name: 'Cut',
  title: '剖切'
}
/**
* @component Cut component
* @memberof CoinScene
* @author zhanzl
* @constructs Cut
*/
export default defineComponent({
  //
  data: () => {
    return {
      name: info.name,
      title: info.title,
      isChecked: { x: false, y: false, z: false },
      scene: null,
      box3: null,
      position: null,
      cutControl: null
    }
  },
  watch: {
    isChecked: {
      handler: function (val, old) {
        if (val.x || val.y || val.z) {
          this.cutControl.enable = true
        } else {
          this.cutControl.enable = false
        }
      },
      deep: true
    }
  },
  setup (props) { },
  mounted () { },
  methods: {
    // install coinscene
    install (scene) {
      this.scene = reactive(scene)
      this.scene.outOfControl(this.$el)
      this.scene.addEventListener('entitiesChange', e => { this.resizeBox() })
      this.scene.addEventListener('entity:loaded', e => { this.resizeBox() })
      this.cutControl = new Cut(scene)
    },
    resizeBox () {
      const box3 = this.scene.getBoxRange().box3
      this.box3 = box3
      this.position = box3.getCenter()
    },
    onPlaneCheck (k) {
      const bool = !this.isChecked[k]
      this.isChecked[k] = bool
      this.cutControl.axis.enable[k] = bool
      this.cutControl.setAxisPanel(k, this.position[k])
    },
    onPlaneChange (v, k) {
      this.position[k] = v
      this.cutControl.setAxisPosition(k, v)
    }
  },
  render () {
    const box3 = this.box3 ?? { min: { x: 0, y: 0, z: 0 }, max: { x: 0, y: 0, z: 0 } }
    const position = this.position ?? { x: 0, y: 0, z: 0 }
    const { title, name, isChecked } = this
    const className = `${config.name}${name} ${config.name}Component` // merge class name
    return (
      <div className={className}>
        <a-card title={title}>
          <a-row>
            <a-col span={4}>
              <a-checkbox v-model={isChecked.x} onChange={(e) => { this.onPlaneCheck('x') }}> x </a-checkbox>
            </a-col>
            <a-col span={14}>
              <a-slider
                disabled={!isChecked.x}
                min={box3.min.x}
                max={box3.max.x}
                onChange={(v) => { this.onPlaneChange(v, 'x') }}
                value={position.x}
              />
            </a-col>
            <a-col span={6}>
              <a-input-number disabled={!isChecked.x} style="width: 100%" value={position.x} />
            </a-col>
          </a-row>
          <a-row>
            <a-col span={4}>
              <a-checkbox v-model={isChecked.y} onChange={(e) => { this.onPlaneCheck('y') }}> y </a-checkbox>
            </a-col>
            <a-col span={14}>
              <a-slider
                disabled={!isChecked.y}
                min={box3.min.y}
                max={box3.max.y}
                onChange={(v) => { this.onPlaneChange(v, 'y') }}
                value={position.y}
              />
            </a-col>
            <a-col span={6}>
              <a-input-number disabled={!isChecked.y} style="width: 100%" value={position.y} />
            </a-col>
          </a-row>
          <a-row>
            <a-col span={4}>
              <a-checkbox v-model={isChecked.z} onChange={(e) => { this.onPlaneCheck('z') }}> z </a-checkbox>
            </a-col>
            <a-col span={14}>
              <a-slider
                disabled={!isChecked.z}
                min={box3.min.z}
                max={box3.max.z}
                onChange={(v) => { this.onPlaneChange(v, 'z') }}
                value={position.z}
              />
            </a-col>
            <a-col span={6}>
              <a-input-number disabled={!isChecked.z} style="width: 100%" value={position.z} />
            </a-col>
          </a-row>
        </a-card>
      </div>
    )
  }
})
</script>
