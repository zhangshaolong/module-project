# 页面模块化开发
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
http://localhost:8080/task/list?proxy=xxx.xxx.xxx.xxx:80
设置proxy参数，指向rd的机器ip与端口
注意：一般联调可能有用户验证之类的操作，如果验证是利用cookie处理的，那么可以把代理地址的cookie手动在本地也设置一份，记得path设置为‘/’，这样的话，代理服务器会自动带上这个cookie。
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
    var dataFromNode = this.data;// 挂载在moduleNode的data-xxx属性上的数据。
};
```
#### 8：本地开发mock，比如我们的规则是以/module-project/开头的请求都认为是调用后端api的接口，比如：/module-proejct/common/user，那么映射到mock文件为/mock/common_user.js，对应的内容类似如下：
```
module.exports = {
    "status" : 200,
    "data": {
        id: 1,
        name: "张三\n12 sfdsd /nsdfsf "
    }
};
```
#### 可以支持直接的数据或者返回一个function，此function支持获取请求参数，并把return的数据作为mock的数据返回。function用于需要动态结果时使用，可以支持延时返回，对应的返回字段sleep，值为毫秒数。

#### 9：项目中的nginx-conf.txt文件中是部分nginx做前后端分离的配置信息，如果需要，请参考。
