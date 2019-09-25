# React 生態系（Ecosystem）入門簡介

![React 生態系（Ecosystem）入門簡介](./images/react-eco-wp.gif "React 生態系（Ecosystem）入門簡介")

根據 [React 官方網站](https://facebook.github.io/react/) 的說明：React 是一個專注於 UI（View）的 JavaScript 函式庫（Library）。自從 Facebook 於 2013 年開源 React 這個函式庫後，相關的生態系開始蓬勃發展。事實上，透過學習 React 生態系（ecosystem）的過程中，可以讓我們順便學習現代化 Web 開發的重要觀念（例如：模組化、ES6+、Webpack、Babel、ESLint、函數式程式設計等），成為更好的開發者。 

## ReactJS
ReactJS 是 Facebook 推出的 JavaScript 函式庫，若以 MVC 框架來看，React 定位是在 View 的範疇。在 ReactJS 0.14 版之後，ReactJS 更把原先處理 DOM 的部分獨立出去（react-dom），讓 ReactJS 核心更單純，也更符合 React 所倡導的 `Learn once, write everywhere` 的理念。事實上，ReactJS 本身的 API 相對單純，但由於整個生態系非常龐大，因此學習 React 卻是一條漫長的道路。此外，當你想把 React 應用在你的應用程式時，你通常必須學習整個 React Stack 才能充分發揮 React 的最大優勢。

## JSX 
事實上，JSX 並非一種全新的語言，而是一種語法糖（[Syntatic Sugar](https://en.wikipedia.org/wiki/Syntactic_sugar)），一種語法類似 [XML](https://zh.wikipedia.org/wiki/XML) 的 ECMAScript 語法擴充。在 JSX 中 HTML 和組建這些元素標籤的程式碼有緊密的關係，這和過去我們強調 HTML、JavaScript 分離的觀念有很大不同。當然，你可以選擇不要在 React 使用 JSX，不過相信我，當你真正開始撰寫 React 元件（Component）時，你會很慶幸有 JSX 真好。

## NPM
NPM（Node Package Manager）是 Node.js 下的主流套件管理工具。在 NPM 上有非常多的套件，可以讓你不用再重造輪子，更可以讓你可以輕鬆用指令管理不同的套件。由於 NPM 主要是基於 [CommonJS](https://en.wikipedia.org/wiki/CommonJS) 的規範，通常必須搭配 Browserify 這樣的工具才能在前端使用 NPM 的模組。然而因 NPM 是基於 Nested Dependency Tree，不同的套件有可能會在引入依賴時會引入相同但不同版本的套件，造成檔案大小過大的情形。這和另一個套件管理工具 [Bower](https://bower.io/) 專注在前端套件且使用 Flat Dependency Tree（讓使用者決定相依的套件版本）是比較不同的地方。

## ES6+
[ES6+](https://babeljs.io/blog/2015/06/07/react-on-es6-plus) 係指 ES6（ES2015）和 ES7 的聯集，在 ES6+ 新的標準當中引入許多新的特性和功能，彌補了過去 JavaScript 被詬病的一些特性。由於未來 React 將以支援 ES6+ 為主，因此直接學習 ES6+ 用法是相對好的選擇，本書的所有範例也將會以 ES6+ 撰寫。

## Babel
由於並非所有瀏覽器都支援 ES6+ 語法，所以透過 [Babel](https://babeljs.io/) 這個 JavaScript 編譯器（可以想成是翻譯機或是翻譯蒟篛）可以讓你的 ES6+ 、JSX 等程式碼轉換成瀏覽器可以看得懂的語法。通常會在資料夾的 root 位置加入 `.babelrc` 進行轉譯規則 `preset` 和引用外掛（plugin）的設定。

## JavaScript 模組化開發
隨著 Web 應用程式的複雜性提高，JavaScript 模組化開發已經成為必然的趨勢，以下簡單介紹 JavaScript 模組化的相關規範。事實上，在一開始沒有官方定義的標準時出現了各種社群自行定義的規範和實踐。

1. CDN-Based
	
	也就是最傳統的 `<script>` 引入方式，然而使用這種方式雖然簡單方便，但在開發實際中大型應用程式時會產生許多弊端：

	- 全域作用域容易造成變數污染和衝突
	- 文件只能依照 `<script>` 順序載入，不具彈性
	- 在大型專案中各種資源和版本難以維護
	- 必須由開發者自行判斷模組和函式庫之間的依賴關係

2. AMD

	[Asynchronous Module Definition](https://en.wikipedia.org/wiki/Asynchronous_module_definition) 簡稱 AMD，為非同步載入模組的規範，其在宣告模組時即需定義依賴的模組。AMD 常用於瀏覽器端，其最著名的實踐為 [RequireJS](http://requirejs.org/)

	基本格式：
	```js 
	define(id?, dependencies?, factory);
	```

3. CommonJS

	[CommonJS](http://wiki.commonjs.org/wiki/CommonJS) 規範是一種同步模組載入的規範。以 Node.js 其遵守 CommonJS 規範，使用 `require` 進行模組同步載入，並透過 `exports`、`module.exports` 來輸出模組。主要實現為 [Node.js](https://nodejs.org/en/) 伺服器端的同步載入和瀏覽器端的 [Browserify](http://browserify.org/)。

4. CMD

	CMD 全稱為 [Common Module Definition](https://github.com/cmdjs/specification/blob/master/draft/module.md)，其規範和 AMD 類似，但相對簡潔，卻又保持和 CommonJS 的兼容性。其最大特色為：依賴就近，延遲執行。主要實現為：[Sea.js](http://seajs.org/docs/#intro)。

5. UMD

	[Universal Module Definition](https://github.com/umdjs/umd) 是為了要兼容 CommonJS 和 AMD 所設計的規範，希望讓模組能跨平台執行。

6. ES6 Module

	ECMAScript6 的標準中定義了 JavaScript 的模組化方式，讓 JavaScript 在開發大型複雜應用程式時上更為方便且易於管理，亦可以取代過去 AMD、CommonJS 等規範，成為通用於瀏覽器端和伺服器端的模組化解決方案。但目前瀏覽器和 Node 在 ES6 模組支援度還不完整，大部分情況需要透過 [Babel](https://babeljs.io/) 轉譯器進行轉譯。

## Webpack/Browserify + Gulp
隨著網頁應用程式開發的複雜性提昇，現在的網頁往往不單只是單純的網頁，而是一個網頁應用程式（WebApp）。為了管理複雜的應用程式開發，此時模組化開發方法便顯得日益重要，而理想上的模組化開發工具一直是前端工程的很大的議題。Webpack 和 Browserify + Gulp 則是進行 React 應用程式開發常用的開發工具，可以協助進行自動化程式碼打包、轉譯等重複性工作，提昇開發效率。本書範例主要會搭配 Webpack 進行開發。

1. Webpack

	[Webpack](https://webpack.github.io/) 是一個模組打包工具（module bundler），以下列出 Webpack 的幾項主要功能：
	- 將 CSS、圖片與其他資源打包
	- 打包之前預處理（Less、CoffeeScript、JSX、ES6 等）的檔案
	- 依 entry 文件不同，把 .js 分拆為多個 .js 檔案
	- 整合豐富的 Loader 可以使用（Webpack 本身僅能處理 JavaScript 模組，其餘檔案如：CSS、Image 需要載入不同 Loader 進行處理）

2. Browserify

	如同官網上說明的：`Browserify lets you require('modules') in the browser by bundling up all of your dependencies.
	`，Browserify 是一個可以讓你在瀏覽器端也能使用像 Node 用的 [CommonJS](https://en.wikipedia.org/wiki/CommonJS) 規範一樣，用輸出（export）和引用（require）來管理模組。此外，也能讓前端使用許多在 NPM 中的模組。

3. Gulp

	`Gulp` 是一個前端任務工具自動化管理工具（Task Runner）。隨著前端工程的發展，我們在開發前端應用程式時有許多工作是必須重複進行，例如：打包文件、uglify、將 LESS 轉譯成一般的 CSS 的檔案，轉譯 ES6 語法等工作。若是使用一般手動的方式，往往會造成效率的低下，所以透過像是 [Grunt](http://gruntjs.com/)、Gulp 這類的 Task Runner 不但可以提昇效率，也可以更方便管理這些任務。由於 Gulp 是透過 pipeline 方式來處理檔案，在使用上比起 Grunt 的方式直觀許多，所以這邊我們主要討論的是 Gulp。

## ESLint
[ESLint](http://eslint.org/) 是一個提供 JavaScript 和 JSX 的程式碼檢查工具，可以確保團隊的程式碼品質。其支援可插拔的特性，可以根據需求在 `.eslintrc` 設定檢查規則。目前主流的檢查規則會使用 Airbnb 所釋出的 [Airbnb React/JSX Style Guide](https://github.com/airbnb/javascript/tree/master/react)，在使用上需先安裝 [eslint-config-airbnb](https://github.com/airbnb/javascript/tree/master/packages/eslint-config-airbnb) 等套件。

## React Router
[React Router](https://github.com/reactjs/react-router) 是 React 中主流使用的 Routing 函式庫，透過 URL 的變化來管理對應的狀態和元件。若開發不刷頁的單頁式（single page application）的 React 應用程式通常都會需要用到。

## Flux/Redux
[Flux](https://facebook.github.io/flux/) 是一個實現單向流的應用程式資料架構（architecture），同樣是由 Facebook 推出，並和 React 專注於 View 的部份形成互補。而由 Dan Abramov 所開發的 [Redux](https://github.com/reactjs/redux) 被 React 開發社群認為是 Flux-like 更優雅的作法，也是目前主流搭配 React 的狀態（State）管理工具。讓你在開發複雜的應用程式時可以更方便管理你的狀態（state）。

## ImmutableJS
[ImmutableJS](https://facebook.github.io/immutable-js/)，是一個能讓開發者建立不可變資料結構的函式庫。建立不可變（immutable）資料結構不僅可以讓狀態可預測性更高，也可以提昇程式的效能。

## Isomorphic JavaScript
Isomorphic JavaScript 是指前後端（Client/Server）共用相同部分的程式碼，讓 JavaScript 應用可以同時執行在瀏覽器端和伺服器端，在 React 中可以透過伺服器端渲染（server side rendering）靜態 HTML 的方式達到 Isomorphic JavaScript 效果，讓 SEO 和執行效能更加提昇並讓前後端共用程式碼。而另一個常一起出現的 Universal JavaScript 一般定義更為廣泛，係指可以運行在不同環境下的 JavaScript Code，並不局限於瀏覽器和伺服器端。但要留意的是在 Github 和許多技術文章的分享上會把兩者定義為同一件事情。
 
## React 測試
Facebook 本身有提供 [Test Utilities](https://facebook.github.io/react/docs/test-utils.html)，但由於不夠好用，所以目前主流開發社群比較傾向使用 Airbnb 團隊開發的 [enzyme](https://github.com/airbnb/enzyme)，其可以與市面上常見的測試工具（[Mocha](https://mochajs.org/)、[Karma](https://karma-runner.github.io/)、Jest 等）搭配使用。其中 [Jest](https://facebook.github.io/jest/) 是 Facebook 所開發的單元測試工具，其主要基於 [Jasmine](http://jasmine.github.io/) 所建立的測試框架。Jest 除了支援 JSDOM 外，也可以自動模擬 (mock) 透過 `require()` 進來的模組，讓開發者可以更專注在目前被測試的模組中。

## React Native
[React Native](https://facebook.github.io/react-native/)和過去的 [Apache Cordova](https://cordova.apache.org/) 等基於 WebView 的解決方案比較不同，它讓開發者可以使用 React 和 JavaScript 開發原生應用程式（Native App），讓 `Learn once, write anywhere` 理想變得可能。

## GraphQL/Relay
[GraphQL](http://graphql.org/docs/getting-started/) 是 Facebook 所開發的資料查詢語言（Data Query Language），主要是想解決傳統 RESTful API 所遇到的一些問題，並提供前端更有彈性的 API 設計方式。[Relay](https://facebook.github.io/relay/) 則是 Facebook 提出搭配 GraphQL 用於 React 的一個宣告式數據框架，可以降低 Ajax 的請求數量（類似的框架還有 Netflix 推出的 [Falcor](https://netflix.github.io/falcor/)）。但由於目前主流的後端 API 仍以傳統 RESTful API 設計為主，所以在使用 GraphQL 上通常會需要比較大架構設計的變動。因此本書則是把 GraphQL/Relay 介紹放到附錄的部份，讓有興趣的讀者可以自行參考體驗一下。

## 總結
以上就是讀者在 React 生態系遊走時會遇到的各種關卡，也許有些初學者會對於這樣龐大的體系所嚇到，放棄學習 React 這項革新性技術的機會。不過別擔心，接下來筆者將帶領讀者按圖索驥，依序介紹整個 React 生態系的各種技術，一步步帶領大家用 React 實作出生活中會用到的應用程式。

## 延伸閱讀
1. [Navigating the React.JS Ecosystem](https://www.toptal.com/react/navigating-the-react-ecosystem)
2. [petehunt/react-howto](https://github.com/petehunt/react-howto#learning-relay-falcor-etc)
3. [React Ecosystem - A summary](https://staminaloops.github.io/undefinedisnotafunction/react-ecosystem/)
4. [React Official Site](https://facebook.github.io/react/)
5. [A collection of awesome things regarding React ecosystem](https://github.com/enaqx/awesome-react)
6. [Webpack 中文指南](http://zhaoda.net/webpack-handbook/index.html)
7. [AMD 和 CMD 的区别有哪些？](https://www.zhihu.com/question/20351507)
8. [jslint to eslint](https://www.qianduan.net/jslint-to-eslint/)
9. [Facebook的Web开发三板斧：React.js、Relay和GraphQL](http://1ke.co/course/595)
10. [airbnb/javascript](https://github.com/airbnb/javascript)

（image via [jpsierens](http://jpsierens.com/wp-content/uploads/2016/06/react-eco-wp.gif)）

## :door: 任意門
| [回首頁](https://github.com/kdchang/reactjs101) | [上一章：Web 前端工程入門簡介](https://github.com/kdchang/reactjs101/blob/master/Ch01/front-end-introduction.md) | [下一章：React 開發環境設置與 Webpack 入門教學](https://github.com/kdchang/reactjs101/blob/master/Ch02/webpack-dev-enviroment.md) |

| [勘誤、提問或許願](https://github.com/kdchang/reactjs101/issues) |
