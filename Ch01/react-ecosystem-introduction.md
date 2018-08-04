# React Ecosystem Introduction

![React Ecosystem Introduction](./images/react-eco-wp.gif "React Ecosystem Introduction")

According to the explanation from [React's official page](https://facebook.github.io/react/), React is a Javascript Library that specializes in UI/Views. Ever since Facebook publicly launched React as an open-source library in 2013, its ecosystem has expanded rapidly. In fact, through the process of learning about the React ecosystem, we can also pick up important concepts in modern web development (examples: modularization, ES6+, Webpack, Babel, ESLint, functional programming design etc), thereby becoming even better developers. 


## ReactJS
ReactJS is a Facebook-developed JavaScript library, if viewed from a MVC framework perspective, React falls under the scope of View(s). In ReactJS v0.14 onwards, ReactJS even isolated the DOM processing feature (react-dom), allowing ReactJS' core to become more pure, fulfilling React's philosophy of `Learn once, write everywhere`. Actually, ReactJS' API is relatively simple, but due to an enormous ecosystem, learning React is a rather long path. Furthermore, when you want to incorporate React in an application, you usually have to learn the entire React Stack to fully unleash React's biggest advantage.


## JSX
In truth, JSX is not a completely new language, but rather it is ([Syntatic Sugar](https://en.wikipedia.org/wiki/Syntactic_sugar)), with similar syntax as [XML](https://zh.wikipedia.org/wiki/XML) supplementing ECMAScript syntax. JSX code is closely related to the HTML and constructing elements it refers to, this vastly differs from the concept enforced in the past of separating HTML from JavaScript. Of course, you can opt not to use JSX in React, but believe me, when you begin to write React Components, you will be grateful JSX exists.

## NPM
Node Package Manager (NPM) is the mainstream package manager for Node.js. There are numerous packages in NPM, so you will not have to reinvent the wheel, and it allows you to manage all packages with ease. Because NPM follows [CommonJS](https://en.wikipedia.org/wiki/CommonJS) specifications, usually a tool like Browserify must be used to use NPM modules in the front-end. But because NPM relies on a Nested Dependency Tree, packages could potentially require different versions of dependent packages, causing a bloat in file size. This is a notable difference between NPM and another package manager [Bower](https://bower.io/), which specializes in front-end packages and utilizes a Flat Dependency Tree (permits users to decide on the versions for dependent packages).

## ES6+
[ES6+](https://babeljs.io/blog/2015/06/07/react-on-es6-plus) collectively refers to ES6(ES2015) and ES7, in the new specification under ES6+, many new characteristics and features were introduced, filling in the lacking points of past versions of JavaScript. Because in the future React will mainly support ES6+, going straight to learning ES6+ is a relatively sound choice, this book will use ES6+ for all code examples.

## Babel
Because not all browsers support ES6+ syntax, we can use [Babel](https://babeljs.io/), a JavaScript pre-processor (you can think of it as a translator), allowing your ES6+ and JSX code to be converted to a syntax that the browser can understand. Usually in the root of project folders we will add a `.babelrc` for translation `preset`s and plugin configurations.

## modularized JavaScript development
As WebApps increased in complexity, modularized Javascript development became an inevitable trend, below I show a simple introduction to Javascript modularization and its related rules. In fact, in the early days when there was no official specification, there were an assortment of different standards developed and practised by various communities.


1. CDN-Based
	
	This is the most traditional `<script>` import approach, althrough this approach is very simple and convenient, this leads to antipatterns and poor practices in mid to large size application development:
	- global scope causes variable namespace pollution and collision
	- documents could only import in the sequence of `<script>` declarations, lacking flexibility
	- in a large project the varying resources and versions are hard to manage
	- relies on the developer to decide on the dependency relationship between libraries

2. AMD

	[Asynchronous Module Definition](https://en.wikipedia.org/wiki/Asynchronous_module_definition) abbreviated AMD, is not a synchronous import specification, instead inter-module dependencies must be specified at the time of module declaration. AMD is often used in the browser, the most famous implementation being [RequireJS](http://requirejs.org/).

	basic syntax:
	```js 
	define(id?, dependencies?, factory);
	```

3. CommonJS

	[CommonJS](http://wiki.commonjs.org/wiki/CommonJS) is an asynchronous module importation specification. Node.js follows the CommonJS standard，using `require` to enable simultaneous imports, and using `exports` and `module.exports` to export modules. The major implementations are [Node.js](https://nodejs.org/en/) for server-based asynchronous importation and the brower-based [Browserify](http://browserify.org/).

4. CMD

	CMD stands for [Common Module Definition](https://github.com/cmdjs/specification/blob/master/draft/module.md), its specification is very similar to that of AMD, but is relatively clean while maintaining compatibility with CommonJS. In fact what causes it to stand out most is: synchronous require, delayed loading. The major implmentation being: [Sea.js](http://seajs.org/docs/#intro).

5. UMD

	[Universal Module Definition](https://github.com/umdjs/umd) is a specification designed to allow compatibility with CommonJS and AMD, with the aim of allowing cross-platform module execution in the future.

6. ES6 Module

	ECMAScript6 specification defined an official approach to Javascript modularization, allowing ease of maintainence for large development projects, it also replaces AMD, CommonJS, becoming the standard strategy for both browser- and server-based modularization. Currently browsers and Node are not fully ES6 compatible, in most cases [Babel](https://babeljs.io/) is required for preprocessing.

## Webpack/Browserify + Gulp
As webapp development becomes more complex, many present-day webpages are often not a simple webpage, but rather a webapp. To manage the development of complex applications, the importance of modularized development becomes increasingly apparent, and the ideal modularized front-end development tool continues to be a major topic within front-end engineering. Webpack and Browserify + Gulp are very commonly used development tools for React application development, assisting in automated module bundling, transpiling and other repetitive work, increasing efficiency. This book mainly uses Webpack as its tool of choice.


1. Webpack

	[Webpack](https://webpack.github.io/) is a module bundler, here are Webpack's main features:
	- package CSS, images, and other resources
	- handle Less, CoffeeScript, JSX, ES6 and related files prior to bundling
	- separates .js files according to different Entry points
	- for rich files, Loaders may be used (Webpack by itself can only handle JavaScript modularization, the remaining files such as: CSS, Images require different Loaders to process)

2. Browserify

	As explained on the official page: `Browserify lets you require('modules') in the browser by bundling up all of your dependencies.` Browserify allows you to use the same [CommonJS](https://en.wikipedia.org/wiki/CommonJS) specification that Node uses, in the browser, using `export` and `require` for package management. Additionally, it allows the front-end use of many npm packages.

3. Gulp

	`Gulp` is a front-end Task Runner. As front-end engineering progresses, many tasks required in front-end development are repetitive. For example: package bundling, uglifying, transpiling LESS to a regular CSS file, preprocessing ES6 syntax, etc. If it was done manually, productivity would be greatly diminished, so using task running tools like [Grunt](http://gruntjs.com/) and Gulp can not only increase productivity, but also make managing repetitive tasks more convenient. Because Gulp processes files with a pipeline, it feels significantly more intuitive than Grunt, as such we will mainly discuss Gulp in this book.

## ESLint
[ESLint](http://eslint.org/) is a linting tool for JavaScript and JSX, it can uphold the code quality of a development team. It is pluggable, allowing configuration of rules via `.eslintrc`. The current mainstream style guide is [Airbnb React/JSX Style Guide](https://github.com/airbnb/javascript/tree/master/react), to use it one must first install [eslint-config-airbnb](https://github.com/airbnb/javascript/tree/master/packages/eslint-config-airbnb) packages.

## React Router
[React Router](https://github.com/reactjs/react-router) is React's mainstream Routing library, it detects changes in URL to manage state and components. It is frequently used when developing single page applications (SPA) with React.

## Flux/Redux
[Flux](https://facebook.github.io/flux/) is an unidirectional data flow application architecture, also released by Facebook. It complements React's specialty in Views. [Redux](https://github.com/reactjs/redux) was developed by Dan Abramov and is acknowledged by the React development community as being a more elegant implementation of Flux-like architecture, and is the mainstream state container for React. It allows for ease of state management when developing complex applications.

## ImmutableJS
[ImmutableJS](https://facebook.github.io/immutable-js/) is a library that allows the developer to create immutable data structures. Making data structures immutable not only promote predictable behaviour, it also improves program performance.

## Isomorphic JavaScript
Isomorphic JavaScript refers to code that is the same in both Client and Server environments, allowing JavaScript to be used in both the browser and server, in React server-side rendering of static HTML allows us to achieve the effect of Isomorphic JavaScript, improving SEO and performance while allowing front- and back-end sharing of code. Another commonly seen term "Universal JavaScript" has a wider definition, referring to JavaScript Code that can execute under any environment, not just in the browser and server. Note that many Github technology and skill articles will conflate the two terms.
 
## Testing for React
Facebook provides [Test Utilities](https://facebook.github.io/react/docs/test-utils.html), but because it is not easy to work with, the current mainstream solution preferred by the developer community is Airbnb's [enzyme](https://github.com/airbnb/enzyme), it can be used together with common testing utilities on the market such as ([Mocha](https://mochajs.org/), [Karma](https://karma-runner.github.io/), Jest, etc). In particular [Jest](https://facebook.github.io/jest/) is an unit testing tool developed by Facebook, it is based on the testing framework established by [Jasmine](http://jasmine.github.io/). Along with its JSDOM support, Jest also supports automatic generation of mocks through modules imported via `require()`, allowing the developer to focus on the module currently being tested.

## React Native
[React Native](https://facebook.github.io/react-native/) differs from the older [Apache Cordova](https://cordova.apache.org/) and similar solutions in its strategy with regard to WebViews, it enables the developer to use React and Javascript within a Native App, realizing the `Learn once, write anywhere` philosophy.

## GraphQL/Relay
[GraphQL](http://graphql.org/docs/getting-started/) is a Data Query Language developed by Facebook, its principle aim is to resolve problems encountered with traditional RESTful APIs, as well as provide a way to design a more flexible API for front-end use. Facebook's [Relay](https://facebook.github.io/relay/) is the accompanying declarative data-driven framework for GraphQL, it lowers the quantity of Ajax requests (similar frameworks include Netflix's [Falcor](https://netflix.github.io/falcor/)). However, because current mainstream backend APIs often have a traditional RESTful API design, larger structural changes are usually required when using GraphQL. This book will have a GraphQL/Relay introduction in its appendix to allow interested readers to experience this themselves.

## Summary
The above are the key checkpoints readers will encounter in navigating the React ecosystem, some beginners may feel intimidated by the massive ecosystem, giving up on the oppourtunity to learn about the revolutionary technology that is React. Do not fret, in the coming chapters I will guide readers in a well-defined fashion, introducing in sequence each technology in the ecosystem, helping everyone write React applications that can be used in daily life, through step by step practice.


## Extended Reading
1. [Navigating the React.JS Ecosystem](https://www.toptal.com/react/navigating-the-react-ecosystem)
2. [petehunt/react-howto](https://github.com/petehunt/react-howto#learning-relay-falcor-etc)
3. [React Ecosystem - A summary](https://staminaloops.github.io/undefinedisnotafunction/react-ecosystem/)
4. [React Official Site](https://facebook.github.io/react/)
5. [A collection of awesome things regarding React ecosystem](https://github.com/enaqx/awesome-react)
6. [Webpack Chinese Guide](http://zhaoda.net/webpack-handbook/index.html)
7. [What's the difference between AMD and CMD？](https://www.zhihu.com/question/20351507)
8. [jslint to eslint](https://www.qianduan.net/jslint-to-eslint/)
9. [Facebook's Web Development Trinity：React.js, Relay, and GraphQL](http://1ke.co/course/595)
10. [airbnb/javascript](https://github.com/airbnb/javascript)

(image via [jpsierens](http://jpsierens.com/wp-content/uploads/2016/06/react-eco-wp.gif))

## :door: Nexus
| [Home](https://github.com/sycherng/reactjs101/tree/en-US) | [Previous article: Web Front-End Development Introduction](https://github.com/sycherng/reactjs101/blob/en-US/Ch01/front-end-introduction.md) | [Next article: React Development Environment Settings and Introduction to Webpack](https://github.com/sycherng/reactjs101/blob/en-US/Ch02/webpack-dev-enviroment.md) |

| [Corrections, questions, or requests](https://github.com/kdchang/reactjs101/issues) |
