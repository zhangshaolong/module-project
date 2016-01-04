# 页面模块化开发
> page module dev amd
### 环境搭建
#### 1：安装nodejs，网上很多安装教程。安装完nodejs后，应该会自带npm，如果没有，还需要安装npm。
#### 2：安装全局的gulp
```
npm install -g gulp
```
#### 3：进入项目根目录
```
cd module-project
```
#### 4：安装项目依赖的库
```
npm install
```
#### 5：启动项目
```
gulp
```
#### 6：访问项目
在浏览器输入：http://localhost:8080
#### 7：项目构建
```
gulp build
```

### 使用教程
#### 1：支持本地代理，轻松与rd通过源代码联调。
```
http://localhost:8080/api/path?proxy=xxx.xxx.xxx.xxx:80
设置proxy参数，指向rd的机器ip与端口
```
#### 2：支持本地本地路由，参考local-server/routerConfig.js文件
#### 3：编码规范为src下的main.js为启动框架的js，建议设置<body data-module-path="main">，所有的页面入口js也都命名为xxx/main.js
#### 4：编译脚本自己压缩合并js代码、压缩合并编译less代码、编译tpl文件为js代码，并最终把页面的js进行md5处理。
#### 5：页面中如果有多层级的data-module-path声明，可以通过设置对应js的init返回deferred对象控制子模块的初始化时机。
#### 6：可以在声明了data-module-path的元素上声明data-interceptor-path进行模块初始化之前的一些处理，interceptor的init可以返回数据或者返回deferred，由deferred传出数据，返回的数据之间在data-module-path所指向的js的init方法的参数中获取。
#### 7：在每个模块的init方法中都可以获取到作用域元素、事件对象、数据存储对象以及作用域元素的data-xxx的数据。具体如下：
```
exports.init = function (dataFromInterceptor) {
    var moduleNode = this.element;// 所有的注册事件建议都代理到此元素上，可以安全地处理多个模块间的潜在的元素干扰。
    var eventEmitter = this.eventEmitter;// 页面间模块的事件通讯，建议子通过事件通知父模块，父直接通过调用子方法。
    var store = this.store;// 页面间所有模块的数据共享池。
    var dataFromNode = this.data;// 挂载在nodeleNode的data-xxx属性上的数据。
};
```
