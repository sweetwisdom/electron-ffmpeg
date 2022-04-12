# electron-ffmpeg（超级转码）



![image-20220412121741509](.imgs/image-20220412121741509.png)

Language:[English](./README-en.md)



> 技术栈: vue3 + vite + electron+elementui + ffmpeg
>
> 项目模板:🥳 `Electron` + `Vue3` + `Vite2` 整合模板 -- **结构简单，容易上手！**

这里特别感谢 [caoxiemeihao 的项目模板]([electron-vite/electron-vite-boilerplate: Electron + Vite + TypeScript. Support SerialPort, SQLite3 and node C/C++ addons. (github.com)](https://github.com/electron-vite/electron-vite-boilerplate))



## 功能

视频、音频格式转换

输入格式 = ["mp4", "flv", "ts", "mkv", "avi", "wmv"]

输出 格式= ["mp4", "flv", "ts", "mkv", "avi", "wmv", 'mp3']

> 注意：wmv格式抓换速度太慢，不建议使用

**使用效果**

![Honeycam 2022-04-12 12-29-07](.imgs/Honeycam%202022-04-12%2012-29-07.gif)



## 项目初始化

### 必要配置

- [ ] 	Node `version ">=16.0.0"`

- [ ] 	npm 包管理工具,推荐`yarn`

- [ ]   全局安装electron(项目开发使用)

  





如果node版本不好,建议使用nvm,管理多个版本.参照[nvm 2022 最新配置教程 - 知乎 (zhihu.com)](https://zhuanlan.zhihu.com/p/474109586)

![image-20220412114106710](./.imgs/image-20220412114106710.png)



安装yarn,electron 

```shell
 npm config set ELECTRON_MIRROR http://npm.taobao.org/mirrors/electron/
 # 设置electron 为国内镜像
npm i yarn -g
yarn global  add electron 
# 进入项目  安装依赖
yarn install
```

### 启动与打包

![image-20220412122100314](./.imgs/image-20220412122100314.png)

```
# dev
yarn dev

# build 

yarn build
```



## 目录结构

```tree
electron-vue3

├── dist
│   ├── main
│   │   ├── index.cjs
│   │   └── package.js
│   └── preload
│       └── index.cjs
├── public
│   ├── package.json 
│   ├── super.ico
│   ├── tool.exe  # ffmpeg 程序
│   └── yarn.lock   # 打包的node依赖
├
├── configs
├   ├── vite-main.config.ts          主进程配置文件，编译 src/main
├   ├── vite-preload.config.ts       预加载脚本配置文件，编译 src/preload
├   ├── vite-renderer.config.ts      渲染进程配置文件，编译 src/renderer
├
├── scripts
├   ├── build.mjs                    项目构建脚本，对应 npm run build
├   ├── electron-builder.config.mjs
├   ├── watch.mjs                    项目开发脚本，对应 npm run dev
├
├── src
├   ├── main                         主进程源码
├   ├── preload                      预加载脚本源码
├   ├── renderer                     渲染进程源码
├
```

#### `dist` 与 `src`

- 一旦启动或打包脚本执行过，会在根目录产生 **`dist` 文件夹，里面的文件夹同 `src` 一模一样**

- 在使用一些路径计算时，尤其是相对路径计算；`dist` 与 `src` 里面保持相同的目录结构能避开好多问题

```tree
├── dist
├   ├── main
├   ├── preload
├   ├── renderer
├── src
├   ├── main
├   ├── preload
├   ├── renderer
├
```


