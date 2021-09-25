<script lang='jsx'>
import { defineComponent } from 'vue'
export default defineComponent({
  props: {},
  setup (props) { },
  render () {
    return (
      <a-button onClick={(e) => {
        this.test('123')
      }} type="primary">test</a-button>
    )
  },
  methods: {
    test (t) {
      console.log(t)
    }
  }
})
</script>
