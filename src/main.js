import { createApp } from 'vue'
import App from './App.vue'
import moment from 'moment'
import 'moment/locale/zh-cn'

import Antd from 'ant-design-vue'
import '@/assets/css/index.less'

const app = createApp(App)

app.config.globalProperties.$moment = moment

app.use(Antd)
app.mount('#app')
