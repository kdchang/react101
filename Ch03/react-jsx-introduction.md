# JSX 簡明入門教學指南

![JSX 簡明入門教學指南](./images/reactjs.png)

## 前言
根據 [React](https://facebook.github.io/react/) 官方定義，React 是一個構建使用者介面的 JavaScript Library。以 MVC 模式來說，ReactJS 主要是負責 View 的部份。過去一段時間，我們被灌輸了許多前端分離的觀念，在前端三兄弟中（或三姊妹、三劍客）：HTML 掌管內容結構、CSS 負責外觀樣式，JavaScript 主管邏輯互動，千萬不要混在一塊。然而，在 React 世界裡，所有事物都是 以 Component 為基礎，將同一個 Component 相關的程式和資源都放在一起，而在撰寫 React Component 時我們通常會使用 [JSX](https://facebook.github.io/jsx/) 的方式來提升程式撰寫效率。事實上，JSX 並非一種全新的語言，而是一種語法糖（[Syntatic Sugar](https://en.wikipedia.org/wiki/Syntactic_sugar)），一種語法類似 [XML](https://zh.wikipedia.org/wiki/XML) 的 ECMAScript 語法擴充。在 JSX 中 HTML 和組建這些元素標籤的程式碼有緊密的關係。因此你可能要熟悉一下以 Component 為單位的思考方式（本文主要使用 ES6 語法）。

此外，React 和 JSX 的思維在於善用 JavaScript 的強大能力，放棄蹩腳的模版語言，這和 [Angular](https://angularjs.org/) 強化 HTML 的理念也有所不同。當然 JSX 並非強制使用，你也可以選擇不用，因為最終 JSX 的內容會轉化成 JavaScript（瀏覽器只看的懂 JavaScript）。不過等你閱讀完接下來的內容，你或許會開始發現 JSX 的好，認真考慮使用 JSX 的語法。

## 一、使用 JSX 的好處

### 1. 提供更加語意化且易懂的標籤
由於 JSX 類似 XML 的語法，讓一些非開發人員也更容易看懂，且能精確定義包含屬性的樹狀結構。一般來說我們想做一個回饋表單，使用 HTML 寫法通常會長這樣：

```html
<form class="messageBox">
  <textarea></textarea>
  <button type="submit"></button>
</form>
```

使用 JSX，就像 XML 語法結構一樣可以自行定義標籤且有開始和關閉，容易理解：

```js
<MessageBox />
```

React 思路認為使用 Component 比起模版（Template）和顯示邏輯（Display Logic）更能實現關注點分離的概念，而搭配 JSX 可以實現聲明式 `Declarative`（注重 what to），而非命令式  `Imperative`（注重 how to）的程式撰寫方式：

![Facebook 上面按讚功能](./images/fb_like.jpg)

以 Facebook 上面按讚功能來說，若是命令式 `Imperative` 寫法大約會是長這樣：

```js

if(userLikes()) {
  if(!hasBlueLike()) {
    removeGrayLike();
    addBlueLike();
  }
} else {
  if(hasBlueLike()) {
    removeBlueLike();
    addGrayLike();
  }
}

```

若是聲明式 `Declarative` 則是會長這樣：

```js
if(this.state.liked) {
  return (<BlueLike />);
} else {
  return (<GrayLike />);
}
```

看完上述說明是不是感覺 `React` 結合 `JSX` 的寫法更易讀易懂？事實上，當 Component 組成越來越複雜時，若使用 JSX 將可以讓整個結構更加直觀，可讀性較高。

### 2. 更加簡潔
雖然最終 JSX 會轉換成 JavaScript，但使用 JSX 可以讓程式看起來更加簡潔，以下為使用 JSX 和不使用 JSX 的範例：

```html
<a href="https://facebook.github.io/react/">Hello!</a>
```

不使用 JSX（記得我們說過 JSX 是選用的）：

```js
// React.createElement(元件/HTML標籤, 元件屬性，以物件表示, 子元件)
React.createElement('a', {href: 'https://facebook.github.io/react/'}, 'Hello!')
```

### 3. 結合原生 JavaScript 語法
JSX 並非一種全新的語言，而是一種語法糖（Syntatic Sugar），一種語法類似 XML 的 ECMAScript 語法擴充，所以並沒有改變 JavaScript 語意。透過結合 JavaScript ，可以釋放 JavaScript 語言本身能力。下面例子就是運用 `map` 方法，輕易把 `result` 值迭代出來，產生無序清單（ul）的內容，不用再使用蹩腳的模版語言（這邊有個小地方要留意的是每個 `<li>` 元素記得加上獨特的 key 這邊用 map function 迭代出的 index，不然會出現問題）：

```js
// const 為常數
const lists = ['JavaScript', 'Java', 'Node', 'Python'];

class HelloMessage extends React.Component {
  render() {
    return (
    <ul>
      {lists.map((result, index) => {
        return (<li key={index}>{result}</li>);
      })}
    </ul>);
  }
}
```

## 二、JSX 用法摘要
### 1. 環境設定與使用方式
初步了解為何要使用 JSX 後，我們來聊聊 JSX 的用法。一般而言 JSX 通常有兩種使用方式：

1. 使用 [browserify](http://browserify.org/) 或 [webpack](https://webpack.github.io/) 等 [CommonJS](https://en.wikipedia.org/wiki/CommonJS) bundler 並整合 [babel](https://babeljs.io/) 預處理
2. 於瀏覽器端做解析

在這邊簡單起見，我們先使用第二種方式，先讓大家專注熟悉 JSX 語法使用，等到後面章節再教大家使用 bundler 的方式去做解析（可以試著把下面的原始碼貼到 [JSbin](http://jsbin.com/) 的 HTML 看結果）：

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Hello React!</title>
    <!-- 請先於 index.html 中引入 react.js, react-dom.js 和 babel-core 的 browser.min.js -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/react/15.0.1/react.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/react/15.0.1/react-dom.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/babel-core/5.8.23/browser.min.js"></script>
  </head>
  <body>
    <div id="example"></div>
    <script type="text/babel">
      // 程式碼寫在這邊！
      ReactDOM.render(
        <h1>Hello, world!</h1>,
        document.getElementById('example')
      );
    </script>
  </body>
</html>
```

一般載入 JSX 方式有：

- 內嵌

```html
<script type="text/babel">
  ReactDOM.render(
    <h1>Hello, world!</h1>,
    document.getElementById('example')
  );
</script>
```

- 從外部引入

`<script type="text/jsx" src="main.jsx"></script>` 


### 2. 標籤用法
JSX 標籤非常類似 XML ，可以直接書寫。一般 Component 命名首字大寫，HTML Tags 小寫。以下是一個建立 Component 的 class：

```js
class HelloMessage extends React.Component {
  render() {
    return (
      <div>
        <p>Hello React!</p>
        <MessageList />
      </div>
    );
  }
}
```

### 3. 轉換成 JavaScript 

JSX 最終會轉換成瀏覽器可以讀取的 JavaScript，以下為其規則：

```js
React.createElement(
  string/ReactClass, // 表示 HTML 元素或是 React Component
  [object props], // 屬性值，用物件表示
  [children] // 接下來參數皆為元素子元素
)
```

解析前（特別注意在 JSX 中使用 JavaScript 表達式時使用 `{}` 括起，如下方範例的 `text`，裡面對應的是變數。若需放置一般文字，請加上 `''`）：

```js
var text = 'Hello React';
<h1>{text}</h1>
<h1>{'text'}</h1>
```

解析完後：

```js
var text = 'Hello React';
React.createElement("h1", null, "Hello React!");
```

另外要特別要注意的是由於 JSX 最終會轉成 JavaScript 且每一個 JSX 節點都對應到一個 JavaScript 函數，所以在 Component 的 `render` 方法中只能回傳一個根節點（Root Nodes）。例如：若有多個 `<div>` 要 `render` 請在外面包一個 Component 或 `<div>`、`<span>` 元素。

### 4. 註解
由於 JSX 最終會編譯成 JavaScript，註解也一樣使用 `//` 和 `/**/` 當做註解方式：

```js
// 單行註解

/*
  多行註解
*/

var content = (
  <List>
      {/* 若是在子元件註解要加 {}  */}
      <Item
        /* 多行
           註解
           喔 */
        name={window.isLoggedIn ? window.name : ''} // 單行註解
      />
  </List>
);
```

### 5. 屬性
在 HTML 中，我們可以透過標籤上的屬性來改變標籤外觀樣式，在 JSX 中也可以，但要注意 `class` 和 `for` 由於為 JavaScript 保留關鍵字用法，因此在 JSX 中使用 `className` 和 `htmlFor` 替代。

```js
class HelloMessage extends React.Component {
  render() {
    return (
      <div className="message">
        <p>Hello React!</p>
      </div>
    );
  }
}
```

#### Boolean 屬性
在 JSX 中預設只有屬性名稱但沒設值為 `true`，例如以下第一個 input 標籤 `disabled ` 雖然沒設值，但結果和下面的 input 為相同：

```html
<input type="button" disabled />;
<input type="button" disabled={true} />;
```

反之，若是沒有屬性，則預設預設為 `false`：

```html
<input type="button" />;
<input type="button" disabled={false} />;
```

### 6. 擴展屬性
在 ES6 中使用 `...` 是迭代物件的意思，可以把所有物件對應的值迭代出來設定屬性，但要注意後面設定的屬性會蓋掉前面相同屬性：

```js
var props = {
  style: "width:20px",
  className: "main",
  value: "yo",  
}

<HelloMessage  {...props} value="yo" />

// 等於以下
React.createElement("h1", React._spread({}, props, {value: "yo"}), "Hello React!");

```

### 7. 自定義屬性
若是希望使用自定義屬性，可以使用 `data-`：

```js
<HelloMessage data-attr="xd" />
```

### 8. 顯示 HTML
通常為了避免資訊安全問題，我們會過濾掉 HTML，若需要顯示的話可以使用：

```html
<div>{{_html: '<h1>Hello World!!</h1>'}}</div>
```

### 9. 樣式使用
在 JSX 中使用外觀樣式方法如下，第一個 `{}` 是 JSX 語法，第二個為 JavaScript 物件。與一般屬性值用 `-` 分隔不同，為駝峰式命名寫法：

```js
<HelloMessage style={{ color: '#FFFFFF', fontSize: '30px'}} />
```

### 10. 事件處理
事件處理為前端開發的重頭戲，在 JSX 中透過 inline 事件的綁定來監聽並處理事件（注意也是駝峰式寫法），更多事件處理方法請[參考官網](https://facebook.github.io/react/docs/events.html#supported-events)

```js
<HelloMessage onClick={this.onBtn} />
```

## 總結
以上就是 JSX 簡明入門教學，希望透過以上介紹，讓讀者了解在 React 中為何要使用 JSX，以及 JSX 基本概念和用法。最後為大家複習一下：在 React 世界裡，所有事物都是以 Component 為基礎，通常會將同一個 Component 相關的程式和資源都放在一起，而在撰寫 React Component 時我們常會使用 [JSX](https://facebook.github.io/jsx/) 的方式來提升程式撰寫效率。JSX 是一種語法類似 XML 的 ECMAScript 語法擴充，可以善用 JavaScript 的強大能力，放棄蹩腳的模版語言。當然 JSX 並非強制使用，你也可以選擇不用，因為最終 JSX 的內容會轉化成 JavaScript。當相信閱讀完上述的內容後，你會開始認真考慮使用 JSX 的語法。

## 延伸閱讀
1. [Imperative programming or declarative programming](http://www.puritys.me/docs-blog/article-320-Imperative-programming-or-declarative-programming.html)
2. [JSX in Depth](https://facebook.github.io/react/docs/jsx-in-depth.html)
3. [從零開始學 React（ReactJS 101）](https://www.gitbook.com/book/kdchang/react101/details)

（image via [adweek](http://www.adweek.com/socialtimes/files/2014/05/LikeButtoniOSApps650.jpg), [codecondo](http://codecondo.com/wp-content/uploads/2015/12/Useful-Features-of-React_7851.png)）

## :door: 任意門
| [回首頁](https://github.com/kdchang/reactjs101) | [上一章：ReactJS 與 Component 設計入門介紹](https://github.com/kdchang/reactjs101/blob/master/Ch03/reactjs-introduction.md) | [下一章：Props、State、Refs 與表單處理](https://github.com/kdchang/reactjs101/blob/master/Ch04/props-state-introduction.md) |

| [勘誤、提問或許願](https://github.com/kdchang/reactjs101/issues) |
