# 一. 系统技术栈

## 1.1 技术栈

| 名称       | 简介                                |                             文档                             |
| :--------- | :---------------------------------- | :----------------------------------------------------------: |
| Node.js    | JavaScript 运行环境(建议版本16.x.x) |          [https://nodejs.org](https://nodejs.org/)           |
| NPM        | 包管理工具(建议版本8.x.x)           |    [https://www.npmjs.com.cn](https://www.npmjs.com.cn/)     |
| Webpack    | JavaScript 静态模块打包器           | [https://webpack.docschina.org](https://webpack.docschina.org/) |
| ES6        | ECMAScript 6                        |  [https://es6.ruanyifeng.com](https://es6.ruanyifeng.com/)   |
| Vue.js     | 渐进式 JavaScript 框架              |        [https://cn.vuejs.org](https://cn.vuejs.org/)         |
| Vue Router | Vue.js 官方路由管理器               |    [https://router.vuejs.org](https://router.vuejs.org/)     |
| Vuex       | Vue.js 官方状态管理库               |      [https://vuex.vuejs.org](https://vuex.vuejs.org/)       |
| Vue CLI    | Vue.js 官方标准开发工具             |       [https://cli.vuejs.org](https://cli.vuejs.org/)        |
| Axios      | 简洁、易用且高效的 http 库          |     [http://www.axios-js.com](http://www.axios-js.com/)      |
| Sass       | CSS 预处理、扩展语言                |         [https://www.sass.hk](https://www.sass.hk/)          |
| ElementUI  | 网站快速成型桌面端组件库            |    [https://element.eleme.cn](https://element.eleme.cn/)     |
| EleAdmin   | 后台管理模板                        |                    https://eleadmin.com/                     |

## 1.2 安装运行

### 1.2.1 docker 安装
```bash
# 1. 下载项目
$git clone git@github.com/wertyq111/blog-ui-vue2
  
# 2. 修改后端请求地址 VUE_APP_API_BASE_URL
$cd blog-ui-vue2
$vi app/.env.development 
  
# 3. 运行 docker
$docker compose up -d
  
# 4. 查看日志
$docker compose logs -f
```
### 1.2.2 本地安装

```bash

# 1. 下载项目
$git clone git@github.com/wertyq111/blog-ui-vue2
  
# 2. 修改后端请求地址 VUE_APP_API_BASE_URL
$cd blog-ui-vue2
$vi app/.env.development 
  
# 3. 镜像加速--registry
$npm install --registry=https://registry.npmmirror.com

# 4. 安装依赖
$npm install
  
# 5. 运行项目
$npm run dev
```

## 1.3 项目结构

```yaml
├── Dockerfile
├── LICENSE
├── README.md
├── babel.config.js
├── compose.yaml
├── package-lock.json
├── package.json
├── public
│   ├── index.html
│   └── pedestrian.jpg
├── src
│   ├── App.vue
│   ├── assets
│   │   ├── css
│   │   │   ├── animation.css
│   │   │   ├── color.css
│   │   │   ├── font-awesome.min.css
│   │   │   ├── index.css
│   │   │   ├── markdown-highlight.css
│   │   │   └── tocbot.css
│   │   ├── file
│   │   │   ├── bannerwave1.png
│   │   │   ├── bannerwave2.png
│   │   │   ├── bg.jpg
│   │   │   ├── bg1.jpg
│   │   │   ├── comment.jpg
│   │   │   ├── letter-1.jpg
│   │   │   ├── letter-2.jpg
│   │   │   ├── letter-3.jpg
│   │   │   ├── letter-4.jpg
│   │   │   ├── like.svg
│   │   │   └── top.jpg
│   │   └── fonts
│   │       ├── SmileySans.otf
│   │       ├── fontawesome-webfont.eot
│   │       ├── fontawesome-webfont.svg
│   │       ├── fontawesome-webfont.ttf
│   │       ├── fontawesome-webfont.woff
│   │       └── fontawesome-webfont.woff2
│   ├── components
│   │   ├── about.vue
│   │   ├── admin
│   │   │   ├── admin.vue
│   │   │   ├── commentList.vue
│   │   │   ├── common
│   │   │   │   ├── myHeader.vue
│   │   │   │   └── sidebar.vue
│   │   │   ├── loveList.vue
│   │   │   ├── main.vue
│   │   │   ├── postEdit.vue
│   │   │   ├── postList.vue
│   │   │   ├── resourceList.vue
│   │   │   ├── resourcePathList.vue
│   │   │   ├── sortList.vue
│   │   │   ├── treeHoleList.vue
│   │   │   ├── userList.vue
│   │   │   ├── verify.vue
│   │   │   └── webEdit.vue
│   │   ├── article.vue
│   │   ├── articleList.vue
│   │   ├── comment
│   │   │   ├── comment.vue
│   │   │   ├── commentBox.vue
│   │   │   └── graffiti.vue
│   │   ├── common
│   │   │   ├── card.vue
│   │   │   ├── emoji.vue
│   │   │   ├── loader.vue
│   │   │   ├── myFooter.vue
│   │   │   ├── photo.vue
│   │   │   ├── printer.vue
│   │   │   ├── proButton.vue
│   │   │   ├── proPage.vue
│   │   │   ├── proTag.vue
│   │   │   ├── process.vue
│   │   │   ├── treeHole.vue
│   │   │   ├── twoPoem.vue
│   │   │   ├── uploadPicture.vue
│   │   │   └── zombie.vue
│   │   ├── favorite.vue
│   │   ├── friend.vue
│   │   ├── funny.vue
│   │   ├── home.vue
│   │   ├── index.vue
│   │   ├── letter.vue
│   │   ├── love.vue
│   │   ├── message.vue
│   │   ├── myAside.vue
│   │   ├── sort.vue
│   │   ├── user.vue
│   │   └── weiYan.vue
│   ├── config
│   │   ├── axios-config.js
│   │   └── setting.js
│   ├── lang
│   │   ├── en.js
│   │   ├── index.js
│   │   ├── zh_CN.js
│   │   └── zh_TW.js
│   ├── main.js
│   ├── router
│   │   └── index.js
│   ├── store
│   │   └── index.js
│   └── utils
│       ├── common.js
│       ├── constant.js
│       ├── letter.js
│       ├── live2d.js
│       ├── mousedown.js
│       ├── request.js
│       ├── sakura.js
│       ├── title.js
│       ├── twopeople.js
│       └── zdog.js
└── vue.config.js
```
