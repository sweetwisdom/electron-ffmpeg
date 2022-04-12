import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import 'element-plus/dist/index.css'
import('./assets/index.css')
const app = createApp(App)
    .use(ElementPlus, {
        locale: zhCn,
    })
    .mount('#app')
    .$nextTick(window.removeLoading)
// app.use(ElementPlus)

console.log('fs', window.fs)
console.log('ipcRenderer', window.ipcRenderer)
