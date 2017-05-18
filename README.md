# **HERO 一个更好的移动跨平台开发方案**

hero移动开发方案源起于点融网LB业务部门的一次大胆的尝试，在点融的黑帮文化中发展出来的一个业界领先的开发方案。

###### 解释上述表

## Hero 框架图

![Hero　Core](https://raw.githubusercontent.com/dianrong/hero/master/heroapp/images/github1.png)
![Hero　extend](https://raw.githubusercontent.com/dianrong/hero/master/heroapp/images/github2.png)
![Hero　App](https://raw.githubusercontent.com/dianrong/hero/master/heroapp/images/github3.png)

# hero-cli

Create Hero apps with no build configuration.

* [Getting Started](#getting-started) – How to create a new app.
* [User Guide](#user-guide) – How to develop apps bootstrapped with Hero App.

Hero App works on Android, iOS, and Modem browser.<br>
If something doesn’t work please [file an issue](https://github.com/hero-mobile/hero-cli/issues/new).

## Quick Overview

```sh
npm install -g hero-mobile/hero-cli

hero init my-app
cd my-app/

npm install

```
Once the installation is done, you can run some commands inside the project folder:

* `npm start` Start the application.
* `npm run build` When you’re ready to deploy to production, create a minified bundle with this command.

Run `npm start` and then open [http://localhost:3000/index.html](http://localhost:3000/index.html) to see your app.<br>

<img src='https://github.com/hero-mobile/hero-cli/blob/master/images/readme/start-homepage.png?raw=true' width='367' height='663' alt='npm start'>

### Get Started Immediately

hero-cli using [Webpack](http://webpack.github.io/) to build the boudle for deployment while you don't need to install or configure them.<br>
They are preconfigured and hidden so that you can focus on the code. Just create a project, and you’re good to go.

## Getting Started

### Installation

Install it once globally:

```sh
npm install -g hero-mobile/hero-cli
```

**You’ll need to have Node >= 4 on your machine**.

**We strongly recommend to use Node >= 6 and npm >= 3 for faster installation speed and better disk usage.** You can use [nvm](https://github.com/creationix/nvm#usage) to easily switch Node versions between different projects.

### Creating an App

To create a new app, run:

```sh
hero init my-app
cd my-app
```

It will create a directory called `my-app` inside the current folder.<br>
Inside that directory, it will generate the initial project structure and then you can run command `npm install` to install the dependencies manually:

```
├── public
│   ├── ...
│   └── favicon.ico
├── src
│   ├── ...
│   ├── environments
│   │   ├── environment-dev.js
│   │   └── environment-prod.js
│   ├── index.html
│   └── index.js
├── .babelrc
├── .editorconfig
├── .eslintrc
├── .gitattributes
├── .gitignore
├── .hero-cli.json
├── package.json
└── README.md
```
For the project to build, **these files must exist with exact filenames**:

* `src/index.html` is the entry page;
* `src/index.js` is the JavaScript entry point.
* `.hero-cli.json` is the configuration file for hero-cli build, it tell hero loads which configuration when you run command `hero start -e dev` or `hero build -e prod`(which is invoked by `npm start` or `npm build`) according to the value of `-e` parameter. For more build options please refer to [Build Scripts](#build-scripts).

You can delete or rename the other files.

* `public` assets like images inside this folder will **copied into the build folder untouched**. It will not be processed by Webpack.
* `src` For faster rebuilds, only files inside this folder are processed by Webpack. You need to **put any JS and CSS files inside this folder**, or Webpack won’t see them.
* `src/environments` where your configurations exists(these file path configured in file `.hero-cli.json`, you can change it later) and you can access the configuration values in JavaScript or HTML code. See [Adding Custom Environment Variables](#adding-custom-environment-variables).

You may curious about where is the `pages/start.html`. Yes, it's generated by hero-cli. See [Generate HTML](#generate-html)

## User Guide

* [Generate HTML](#generate-html)
* [Adding Custom Environment Variables](#adding-custom-environment-variables)
  * [Referencing Environment Variables in the JavaScript](#referencing-environment-variables-in-the-javascript)
  * [Referencing Environment Variables in the HTML](#referencing-environment-variables-in-the-html)
  * [Adding Temporary Environment Variables In Your Shell](#adding-temporary-environment-variables-in-your-shell)
  * [Adding Development Environment Variables via `.hero-cli.json`](#adding-development-environment-variables-via-hero-clijson)
* [Proxying API Requests in Development](#proxying-api-requests-in-development)
* [Build Scripts](#build-scripts)
  * [`hero start`](#hero-start)
  * [`hero build`](#hero-build)

### Generate HTML

Any JS file meet the following 2 conditions will treat as JavaScript entry point.

* Declaration of `class` exists in the JS file.
* `class` marked by [Decorator](https://github.com/wycats/javascript-decorators/blob/master/README.md) `@Entry` from [hero-cli/decorator](https://github.com/hero-mobile/hero-cli/blob/master/decorator.js).

Which would cause a HTML file generated using Webpack plugin [html-webpack-plugin](https://www.npmjs.com/package/html-webpack-plugin):

* Options specified in `@Entry(options)` will passed to `html-webpack-plugin` transparently.
* Destination of generated HTML file will keep the file path structure of the Javascript entry, or you can override it using the option `filename` provided by `html-webpack-plugin`.
* Generated HTML file can access the [Custom Environment Variables](#adding-custom-environment-variables).

Example:<br>

Below JavaScript file `src/pages/start.js` will generate a HTML file access by URL `/pages/start.html`, that's why we can visit [http://localhost:3000/pages/start.html](http://localhost:3000/pages/start.html).

```javascript
// content of file: src/pages/start.js
import { Entry } from 'hero-cli/decorator';

// class marked by @Entry
// will generate HTML accessed by URL /pages/start.html
// Equal to
// @Entry({
//   filename: 'pages/start.html'
// })
//
@Entry()
export class DecoratePage {

    sayHello(data){
      console.log('Hello Hero!')
    }

}

```

### Adding Custom Environment Variables
Your project can consume variables declared in your environment as if they were declared locally in your JS files. By default you will have any environment variables starting with `HERO_APP_`. These environment variables can be useful for consuming sensitive data that lives outside of version control.<br>

**The environment variables are embedded during the build time**.<br>

#### Referencing Environment Variables in the JavaScript

These environment variables will be defined for you on `process.env`.
For example, having an environment variable named `HERO_APP_SECRET_CODE` will be exposed in your JS as `process.env.HERO_APP_SECRET_CODE`.

```javascript

console.log('Send Request with Token: '+ process.env.HERO_APP_SECRET_CODE);

```

There is also exist two special built-in environment variable called `NODE_ENV` and `HOME_PAGE`. <br>

You can read it from `process.env.NODE_ENV`. When you run `hero start`, it is always equal to `'development'`, when you run `hero build` to make a production bundle, it is always equal to `'production'`. **You cannot override `NODE_ENV` manually**. This prevents developers from accidentally deploying a slow development build to production.<br>

Having access to the `NODE_ENV` is also useful for performing actions conditionally:

```javascript

if (process.env.NODE_ENV !== 'production') {
  analytics.disable();
}

```

You can read variable `process.env.HOME_PAGE`, which value is equal to attribute `homepage` in file `.hero-cli.json`. This is useful for [Building for Relative Paths](#building-for-relative-paths).

#### Referencing Environment Variables in the HTML
For example, let’s define a variable `HERO_APP_WEBSITE_NAME` with value `Welcome Hero`, and you can access it like this:

```html
<title>%HERO_APP_WEBSITE_NAME%</title>

```

When you load the app in the browser and inspect the `<title>`, you will see its value set to `Welcome Hero`:

```html
<title>Welcome Hero</title>

```
#### Adding Temporary Environment Variables In Your Shell
Defining environment variables can vary between OSes. It’s also important to know that this manner is temporary for the life of the shell session.

##### Windows (cmd.exe)
```
set HERO_APP_SECRET_CODE=abcdef&&npm start

```

##### Linux, macOS (Bash)
```
HERO_APP_SECRET_CODE=abcdef npm start

```

#### Adding Development Environment Variables via `.hero-cli.json`
Environment variables may varies from environments, such as `development`, `test` or `production`. <br>
You can specify the mapping info in the `.hero-cli.json` file, tell hero-cli loads the corresponding variables into environment variables.<br>

For example:

Here is the content of `.hero-cli.json`
```json
{
  "environments": {
    "dev": "src/environments/environment-dev.js",
    "prod": "src/environments/environment-prod.js"
  }
}

```
And here is the content of `src/environments/environment-prod.js`

```javascript
var environment = {
    backendURL: 'http://www.my-website.com/api'
};

module.exports = environment;

```

When you run command `hero start -e dev` or `hero build -e dev`, all variables from `src/environments/environment-dev.js` can be accessed via `process.env`.

### Proxying API Requests in Development
People often serve the front-end React app from the same host and port as their backend implementation.
For example, a production setup might look like this after the app is deployed:
```
/             - static server returns index.html with React app
/todos        - static server returns index.html with React app
/api/todos    - server handles any /api/* requests using the backend implementation

```

Such setup is not required. However, if you do have a setup like this, it is convenient to write requests like `fetch('/api/v2/todos')` without worrying about redirecting them to another host or port during development.

To tell the development server to proxy any unknown requests to your API server in development, add a proxy field to your `.hero-cli.json`, for example:

```json
{
  "proxy": {
    "/api/v2": "https://localhost:4000",
    "/feapi": "https://localhost:4001",
  },
  "environments": {
    "dev": "src/environments/environment-dev.js",
    "prod": "src/environments/environment-prod.js"
  }
}

```

This way, when you `fetch('/api/v2/todos')` in development, the development server will proxy your request to `http://localhost:4000/api/v2/todos`, and when you `fetch('/feapi/todos')`, the request will proxy to `https://localhost:4001`.


### Build Scripts

#### `hero start`

Runs the app in development mode. And you can run `hero start -h` for help.<br>

This command has one mandatory parameter `-e`.
Usage: `hero start -e <env>`

The available `<env>` values come from keys configured in attribute `environments` in file `.hero-cli.json`.

hero-cli will load the corresponding configurations according to the `<env>` value by rules mentioned [above](#adding-development-environment-variables-via-hero-clijson).<br>

You can using `-p` specify the listen port start the application.<br>

```sh
hero start -e dev -p 3000
```
When start successfully, the page will reload if you make edits in folder `src`.<br>
You will see the build errors and lint warnings in the console.

<img src='https://github.com/hero-mobile/hero-cli/blob/master/images/readme/syntax-error-terminal.png?raw=true' width='600' alt='syntax error terminal'>

##### More Vaild options

* `-e`<br>Environment name of the configuration when start the application
* `-s`<br>Build the boundle as standalone version, which should run in Native App environment. That's to say, build version without libarary like [webcomponent polyfills](http://webcomponents.org/polyfills/) or [hero-js](https://github.com/hero-mobile/hero-js)(These libarary is necessary for Hero App run in web browser, not Native App).
* `-i`<br>Inline JavaScript code into HTML. Default value is [false].
* `-b`<br>Build pakcage only contain dependecies like hero-js or webcomponents, withou code in <you-project-path>/src folder. Default value is [false]
* `-m`<br>Build without sourcemap. Default value is [false], will generate sourcemap.
* `-f`<br>Generate AppCache file, default file name is "app.appcache". Default value is [false], will not generate this file.
* `-n`<br>Rename file without hashcode. Default value is [false], cause filename with hashcode.


#### `hero build`

Builds the app for production to the `build` folder. Options as same as `hero start` mentioned [above](#more-vaild-options), or you can run `hero build -h` for help<br>
The build is minified and the filenames include the hashes.<br>
It correctly bundles Hero App in production mode and optimizes the build for the best performance.

This command has one mandatory parameter `-e`.
Usage: `hero build -e <env>`

The available `<env>` values and configurations loading rules as same as [`hero start`](#hero start) .

##### Building for Relative Paths
By default, hero-cli produces a build assuming your app is hosted at the server root.
To override this, specify the value of attribute **homepage** in configuration `.hero-cli.json` file. Accept values see [Webpack#publicpath](http://webpack.github.io/docs/configuration.html#output-publicpath).

For example:

Here is the content of `.hero-cli.json`
```json
{
  "environments": {
    "dev": "src/environments/environment-dev.js",
    "prod": "src/environments/environment-prod.js"
  },
  "homepage": "/mkt/"
}

```
Then you can access the `start.html` by URL `/mkt/pages/start.html`

This will let Hero App correctly infer the root path to use in the generated HTML file.

#### `hero init`
You can run `hero build -h` for help. It will generate the initial project structure of Hero App. See [Creating an App](#creating-an-app).


## Hero 不止是一个开发框架，而是一个开发方案

#### 开发过程管理
- 新的框架需求可以提交代码到hero-js/test/test/unit_test/目录,具体的提交内容是一个json文件类似
```
	{
		class:"MyLabel", 		//新功能的元素名
		p1:"xxxxx",	  		//新熟悉接受什么样的参数，结果如何
		text:"Hello hero !",
		size:22,
		frame:{"w":"1x",h:"80"},
		alignment:"center"
	},
```
测试系统会自动为这个元素生成测试用例，如果各个平台上打开此测试用例结果都正确，表明这个元素实现完成。单元测试如下图
![Hero　Core](https://raw.githubusercontent.com/dianrong/hero/master/heroapp/images/gif3.gif)

- 测试驱动开发，由于任何新的功能都是先有测试用例才能开始，这是先天性的测试驱动开发。
- 全平台自动化测试，如图
![Hero　Core](https://raw.githubusercontent.com/dianrong/hero/master/heroapp/images/gif1.gif)

#### 用户行为分析
   在Hero框架中有一个理念，页面上不应该有任何的逻辑，页面（view controller\activity\page）只负责显示元素，元素本身只接json数据，界面显示成什么样子完全由接收到的json数据来决定，而且页面本身只有 in 和 out 两个函数分别对应元素反馈数据，和给元素的数据。我们在js中重载这两个函数，并将数据发送到日志服务器。就可以知道一个用户的所有操作，并可以对操作进行完整的回放。

#### hero不只是一个前端框架
Hero的核心理念是任何一个功能元素有且只有一个接口与外界交换数据。我曾经写了一个工具去检测一般项目中类之间的关系，方法是先找出当前项目的类列表，如果一个类中出现其它列表中的类就加1，结果是50个类平均结果是200左右，100个类平均结果是800左右，而且这个数以大于正比例曲线增长。大家可以想象一下一个新人面对一个大项目时候的囧迫，这简直是一张大网。传统的面向对象编程也许本身没有问题，但是在实际的的实践中遭遇了巨大的挑战，函数式编程是一种，而Hero是另外一种。
在服务端，Hero也有一个初步但是完整的实践，目录在hero-js/server当中。这里不再展开叙述。



## 贡献
提交到 
https://github.com/dianrong/Hero
https://github.com/dianrong/Hero-ios
https://github.com/dianrong/Hero-android



