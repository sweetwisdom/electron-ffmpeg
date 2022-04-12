import fs from 'fs'
// 动态注入
import { contextBridge, ipcRenderer, shell, IpcRenderer } from 'electron'
import { domReady } from './utils'
import { useLoading } from './loading'

const isDev = process.env.NODE_ENV === 'development'
const { removeLoading, appendLoading } = useLoading()

domReady().then(() => {
    appendLoading()
})


// --------- Expose some API to Renderer process. ---------
contextBridge.exposeInMainWorld('fs', fs)

contextBridge.exposeInMainWorld('shell', shell)
contextBridge.exposeInMainWorld('removeLoading', removeLoading)
contextBridge.exposeInMainWorld('ipcRenderer', {
    ...ipcRenderer,
    // `exposeInMainWorld` will not expose attribute and mothods from the prototype
    on(...args: Parameters<IpcRenderer['on']>) {
        return ipcRenderer.on(...args)
    }
})
