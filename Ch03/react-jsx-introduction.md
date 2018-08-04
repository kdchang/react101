# JSX Simple Starter Guide

![JSX Simple Starter Guide](./images/reactjs.png)

## Foreword
As defined in the official [React](https://facebook.github.io/react/) page, React is a Javascript Library for constructing UIs. From an MVC model standpoint, ReactJS chiefly manages the View portion. Sometime in the past, we had been instilled with many concepts about division of front-end, where the three brothers of front-end (or three sisters/ three musketeers): HTML for structuring, CSS for appearance, and Javascript for logical operations and interactivity, should not be muddled together. However, in the React World, everything is based in Components, all code and resources to do with a single Component should be put together, and while writing React Components we usually use [JSX](https://facebook.github.io/jsx/) to increase writing efficiency.

In truth, JSX is not a completely new language, but rather it is ([Syntatic Sugar](https://en.wikipedia.org/wiki/Syntactic_sugar)), with similar syntax as [XML](https://zh.wikipedia.org/wiki/XML) expanding the ECMAScript syntax. JSX code is closely related to the HTML and constructing elements it refers to. Therefore you may need to familiarize yourself with a line of thought grounded in using Components the basic unit (this book mainly uses ES6 syntax).

Additionally, the line of thought introduced with React and JSX exemplifies Javascript's formidable capabilities, abandoning its past as a shoddy templating language, this is different from the ideology taken on by [Angular](https://angularjs.org/) of enhancing HTML. Of course, JSX is not mandatory, you can opt not to use it, because in the end JSX content is converted to Javascript (browser-readable Javascript). But once you have read the below content, you may start to discover the boons of JSX, and seriously consider using JSX syntax.

## One, the benefits of using JSX

### 1. tags that improve semantics
Because JSX has similar syntax to XML, developers can easily understand it, and can also accurately and precisely define the property tree structure. Normally when we want to write a response form, we would usually write HTML like this:

```html
<form class="messageBox">
  <textarea></textarea>
  <button type="submit"></button>
</form>
```

JSX shares syntactical structures similar to XML, allowing us to freely define tags complete with clear opening and closing points, it is very easy to understand:

```js
<MessageBox />
```

React's design follows the belief that the use of Components allows better separation of concerns as compared to Template and Display Logic based design, pairing with JSX enables Declarative (focus on "what to") as opposed to Imperative ("how to") programming style:

![Facebook like function](./images/fb_like.jpg)

Using Facebook's like function as example, if written in an `Imperative` style it would look approximately like so:

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

If it were `Declarative` it would look like this:

```js
if(this.state.liked) {
  return (<BlueLike />);
} else {
  return (<GrayLike />);
}
```

After reading the above do you also find that the written style for `React` and `JSX` is easier to understand? In fact, once Component structures become increasingly complicated, the usage of JSX allows the entire structure to be intuitive, elevating readability.

### 2. Cleaner style
Although JSX inevitably gets converted to Javascript, using JSX allows the program to appear cleaner, below are examples demonstrating use of JSX versus without:

```html
<a href="https://facebook.github.io/react/">Hello!</a>
```

Without JSX (recall we have mentioned JSX was purpose-made):

```js
// React.createElement(element/HTML tag, component props, using object representation, child component)
React.createElement('a', {href: 'https://facebook.github.io/react/'}, 'Hello!')
```

### 3. Incoporates native JavaScript syntax
JSX is not a completely new language, but rather it is (Syntatic Sugar), with similar syntax as XML expanding the ECMAScript syntax, therefore it does not alter the semantic context of Javascript. Through incorporation of Javascript, it unleashes the innate ability of the Javascript language. The example below uses `map` method to iteratively replace `result`'s value with ease, generating content for an unordered list (ul), no longer requiring shoddy templating language (a minor point to note here is to remember to use unique keys for each `<li>` element, here the map function iteratively replaces the index, or else you will run into issues): 

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

## Two, JSX usage key points
### 1. Environment settings and method of usage
After gaining some initial understanding on the reasons to use JSX, let's chat about JSX usage. Usually JSX is used in two common ways:

1. Using [browserify](http://browserify.org/) or [webpack](https://webpack.github.io/) etc [CommonJS](https://en.wikipedia.org/wiki/CommonJS) bundlers and [babel](https://babeljs.io/) preprocessing
2. Parsing in the browser

Let's start with the easier option, we will use the second method first, allowing everyone to focus on JSX syntax usage, I will teach how to use bundlers in more depth in later chapters bundler (you can copy and paste the source code below to [JSbin](http://jsbin.com/) under the HTML panel to view the result):

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Hello React!</title>
    <!-- Please first import within index.html the packages react.js, react-dom.js and babel-core's browser.min.js -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/react/15.0.1/react.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/react/15.0.1/react-dom.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/babel-core/5.8.23/browser.min.js"></script>
  </head>
  <body>
    <div id="example"></div>
    <script type="text/babel">
      // Write code here!
      ReactDOM.render(
        <h1>Hello, world!</h1>,
        document.getElementById('example')
      );
    </script>
  </body>
</html>
```

Normally the import methods for JSX include:

- in-line

```html
<script type="text/babel">
  ReactDOM.render(
    <h1>Hello, world!</h1>,
    document.getElementById('example')
  );
</script>
```

- importing from outside:

`<script type="text/jsx" src="main.jsx"></script>` 


### 2. Tag usage
JSX tags are highly similar to XML, they can be written directly. Usually we capitalize the Component names, and write HTML Tags in lowercase. Below is a class that builds a Component:

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

### 3. Converting to Javascript

JSX gets converted to browser-readable Javascript in the end, below are its rules:

```js
React.createElement(
  string/ReactClass, // represents HTML element or React Component
  [object props], // property values, represented with object
  [children] // the following variables are child elements
)
```

Before parsing (pay note that Javascript expressions in JSX are wrapped in `{}`, in the below example `text` contains a corresponding variable. To place regular text, add `''`):

```js
var text = 'Hello React';
<h1>{text}</h1>
<h1>{'text'}</h1>
```

After parsing:

```js
var text = 'Hello React';
React.createElement("h1", null, "Hello React!");
```

Another point to note is due to JSX inevitably being converted to Javascript, every JSX node corresponds to a Javascript function, therefore the `render` method in Component can only return one root node. For example: if many `<div>`s exist under `render`, please wrap them in an additional parent `<div>` or `<span>` type element.

### 4. Comments
Because JSX eventually is converted to JavaScript, comments also use `//` and `/**/`:

```js
// single line comment

/*
  multiline comment
*/

var content = (
  <List>
      {/* comments within a child element must be wrapped in {}  */}
      <Item
        /* multi
           line
           comment */
        name={window.isLoggedIn ? window.name : ''} // single line comment
      />
  </List>
);
```

### 5. Properties
In HTML, we can adjust the appearance of elements based on their tags, this can also be done in JSX, but be careful that `class` and `for` are reserved namespaces in Javascript, therefore JSX instead uses `className` and `htmlFor` as substitute.

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

#### Boolean properties
In JSX properties have a default name but no boolean default `true`, for example the first input tag `disabled` lacks a predefined value for `disabled`, however although there is no default value, the result is the same as the input tag below:

```html
<input type="button" disabled />;
<input type="button" disabled={true} />;
```

Instead, if there is no property mentioned, its default is set to `false`：

```html
<input type="button" />;
<input type="button" disabled={false} />;
```

### 6. expanded properties
In ES6 `...` signifies the object to be iteratively replaced, it is possible to iteratively set property values, but take care that the later settings on each property will override previous ones if they share the same name.

```js
var props = {
  style: "width:20px",
  className: "main",
  value: "yo",  
}

<HelloMessage  {...props} value="yo" />

// is equivalent the following
React.createElement("h1", React._spread({}, props, {value: "yo"}), "Hello React!");

```

### 7. self-defined properties
To self-define properties, use `data-`:

```js
<HelloMessage data-attr="xd" />
```

### 8. Displaying HTML
Usually due to data security, we filter out HTML, but if you want to display it you can use:

```html
<div>{{_html: '<h1>Hello World!!</h1>'}}</div>
```

### 9. using Styles
In JSX styles may be applied as follows, the first `{}` is JSX syntax, the second is for Javascript objects. It is different from normal style property which uses `-` as delimiter, instead camelCase is used: 

```js
<HelloMessage style={{ color: '#FFFFFF', fontSize: '30px'}} />
```

### 10. event handling
Event handling is the "main event" of front-end development, in JSX through in-line event binding we can watch for and respond to events  (pay note this also uses camelCase) for more on event handling please [see official documentation](https://facebook.github.io/react/docs/events.html#supported-events).

```js
<HelloMessage onClick={this.onBtn} />
```

## Summary
Above is our JSX Simple Starter Guide, hopefully through the introduction above readers now understand the reasons to use JSX in React, as well as the foundational concepts and usages of JSX. Let us conclude with a review: In the React World, everything is built upon Components, usually we place a Component and its relevant code and resources together, and while writing React Components we usually use [JSX](https://facebook.github.io/jsx/) to increase writing efficiency. JSX is an extension for ECMAScript with similar syntax to XML, capable of exemplifying Javascript's formidable capabilities, discarding its past as a shoddy templating language. Of course JSX is not mandatory, and you can choose not to use it, because in the end JSX content is converted to JavaScript. After reading the above content, you will seriously consider using JSX syntax.

## Extended Reading
1. [Imperative programming or declarative programming](http://www.puritys.me/docs-blog/article-320-Imperative-programming-or-declarative-programming.html)
2. [JSX in Depth](https://facebook.github.io/react/docs/jsx-in-depth.html)
3. [ReactJS 101 (lit. "Learn ReactJS From Zero")](https://www.gitbook.com/book/kdchang/react101/details)

(image via [adweek](http://www.adweek.com/socialtimes/files/2014/05/LikeButtoniOSApps650.jpg), [codecondo](http://codecondo.com/wp-content/uploads/2015/12/Useful-Features-of-React_7851.png))

## :door: Nexus
| [Home](https://github.com/sycherng/reactjs101/tree/en-US) | [Previous article: ReactJS and Component Design Introduction](https://github.com/sycherng/reactjs101/blob/en-US/Ch03/reactjs-introduction.md) | [Next article: Props, State, Refs and form handling](https://github.com/sycherng/reactjs101/blob/en-US/Ch04/props-state-introduction.md) |

| [Corrections, questions, or requests](https://github.com/kdchang/reactjs101/issues) |
