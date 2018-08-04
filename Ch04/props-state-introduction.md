# Props, State, Refs and form handling

## Foreword
In the previous chapter we already touched on the basics of React and JSX, we also understood that React Component can be seen as an UI state machine, and this state machine alters the way Components are displayed through different state (edited via `setState()`) and props (transferred from parent element). This chapter will follow [the demo from React's official web landing page](https://facebook.github.io/react/index.html) (using ES6+) to provide a deeper explanation on Props and State characteristics and how to handle forms and events in React.

## Props
First we'll use the "A Simple Component" example from React's official website to illustrate how to use props. Because the imported component has a name property set to Mark, the below code will show Hello, Mark in the browser. Aiming to benefit from the design characteristic of props having default values, we can write a component that is more robust.

HTML Markup：

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width">
  <title>A Component Using External Plugins</title>
</head>
<body>
<!-- here we can use CDN-based importation for react, react-dom to allow for ease of explanation, later in the "Learn by Writing" section we will use webpack -->
<script src="https://fb.me/react-15.1.0.js"></script>
<script src="https://fb.me/react-dom-15.1.0.js"></script>
  <div id="app"></div>
	<script src="./app.js"></script>
</body>
</html>
```

app.js, using ES6 Class Component syntax:

```javascript
class HelloMessage extends React.Component {
	// if you wish to bind this.method, want to use props, or define state within the constructor, you will need a constructor. If you are using this.props elsewhere (such as in render) you do not have to declare a constructor
	constructor(props) {
		// those readers familiar with object-oriented programming (OOP) will find the constructor structure familiar, in actuality it is ES6 syntax sugar, behind the scenes it is still a prototype based language. Through extends we can inherit from React.Component parent class. super method calls the constructor of the parent class
		super(props);
		this.state = {}
	}
	// render is the only mandatory method, but if you are simply rendering UI I recommend using Functional Components instead, it will enable improved performance and cleaner code
	render() {
		return (
			<div>Hello {this.props.name}</div>
		)
	}
}

// PropTypes validation, if the props type passed in is not string, an error will be displayed
HelloMessage.propTypes = {
  name: React.PropTypes.string,
}

// Prop default value, if the corresponding props lacks an incoming value, it will default to Zuck
HelloMessage.defaultProps = {
 name: 'Zuck',
}

ReactDOM.render(<HelloMessage name="Mark" />, document.getElementById('app'));
```

An explanation regarding React ES6 class constructor super() can be found at [React ES6 class constructor super()](http://cheng.logdown.com/posts/2016/03/26/683329).

Using Functional Components:

```javascript
// Functional Component can be seen as f(d) => UI, drawing onto the UI according to the incoming props. pay note here props is a variable passed into a function, so we use props without adding this
const HelloMessage = (props) => (
	<div>Hello {props.name}</div>
);

// PropTypes validation, if the props type passed in is not string, an error will be displayed
HelloMessage.propTypes = {
  name: React.PropTypes.string,
}

// Prop default value, if the corresponding props lacks an incoming value, it will default to Zuck. Usage is equivalent to getDefaultProps from ES5
HelloMessage.defaultProps = {
 name: 'Zuck',
}

ReactDOM.render(<HelloMessage name="Mark" />, document.getElementById('app'));
```

A demo hosted on jsbin:

<a class="jsbin-embed" href="http://jsbin.com/wadice/embed?html,js,console,output">A Component Using External Plugins on jsbin.com</a><script src="http://static.jsbin.com/js/embed.min.js?3.39.12"></script>

## State
Now we will use a Stateful Component to demonstrate the usage of State. In React, Components can self-manage their internal state, and use `this.state` to read from state. When `setState()` method updates state, it will then call `render()`, to redraw the component contents. Below is an example of an accumulator program that adds one every 1000 ms (equivalent to 1 second). Because this is a Stateful Component, we can only use an ES6 Class Component, we cannot use a Functional Component.

HTML Markup：

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width">
  <title>A Component Using External Plugins</title>
</head>
<body>
<script src="https://fb.me/react-15.1.0.js"></script>
<script src="https://fb.me/react-dom-15.1.0.js"></script>
  <div id="app"></div>
	<script src="./app.js"></script>
</body>
</html>
```

app.js：

```javascript
class Timer extends React.Component {
	constructor(props) {
		super(props);
		// a difference from ES5 React.createClass({}) is that the component's declaration must bind this context, or use an arrow function
        this.tick = this.tick.bind(this);
		// initialize state, equivalent to getInitialState in ES5
		this.state = {
			secondsElapsed: 0,
		}
	}
	// accumulator method, call setState() every second to update internal state, and cause re-rendering of the Component
	tick() {
	    this.setState({secondsElapsed: this.state.secondsElapsed + 1});
	}
	// componentDidMount is the mounting stage of a component's lifecycle, usually all synchronous operations are placed in this stage. Here we call tick every second
	componentDidMount() {
	    this.interval = setInterval(this.tick, 1000);
	}
	// componentWillUnmount is the stage of a component lifecycle when the component has been unmounted. Here we remove setInterval's effect
	componentWillUnmount() {
		clearInterval(this.interval);
	}
	// render is the only mandatory function in class Components, it is used to return the content the component wants to display
	render() {
	    return (
	      <div>Seconds Elapsed: {this.state.secondsElapsed}</div>
	    );
	}
}

ReactDOM.render(<Timer />, document.getElementById('app'));
```

Regarding this usage of Javascript this you can refer to [Javascript：this usage](https://software.intel.com/zh-cn/blogs/2013/10/09/javascript-this).

## Event handling
In earlier content we learned how to use props and state, now we will advance our knowledge by learning how to handle events within React. Below we use an example titled "An Application" from React's official website, and create a simple TodoApp.

HTML Markup：

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width">
  <title>A Component Using External Plugins</title>
</head>
<body>
<script src="https://fb.me/react-15.1.0.js"></script>
<script src="https://fb.me/react-dom-15.1.0.js"></script>
  <div id="app"></div>
	<script src="./app.js"></script>
</body>
</html>
```

app.js：

```javascript
// TodoApp component includes a TodoList component, Todo's content is fed into TodoList via props. Because TodoList simply Renders UI and does not involve operations on internal state, it is a stateless component, therefore we choose to write it as a Functional Component. Take care that here we used map function to iteratively provide our Todos, every element in our iterator must have a unique key or an error will occur (the unique key may be a self-defined id, or a second variable index provided through map function).
const TodoList = (props) => (
	<ul>
		{
			props.items.map((item) => (
				<li key={item.id}>{item.text}</li>
			))
		}
	</ul>
)

// The main App component, pay note to the event handling, it looks like this inside:
class TodoApp extends React.Component {
	constructor(props) {
		super(props);
		this.onChange = this.onChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.state = {
			items: [],
			text: '',
		}
	}
	onChange(e) {
    	this.setState({text: e.target.value});
	}
	handleSubmit(e) {
    	e.preventDefault();
    	const nextItems = this.state.items.concat([{text: this.state.text, id: Date.now()}]);
    	const nextText = '';
    	this.setState({items: nextItems, text: nextText});
	}
	render() {
	    return (
	      <div>
	        <h3>TODO</h3>
	        <TodoList items={this.state.items} />
	        <form onSubmit={this.handleSubmit}>
	          <input onChange={this.onChange} value={this.state.text} />
	          <button>{'Add #' + (this.state.items.length + 1)}</button>
	        </form>
	      </div>
	    );
	}
}

ReactDOM.render(<TodoApp />, document.getElementById('app'));
```

Above I have introduced React event handling, in addition to `onChange` and `onSubmit`, React comes with many common event handlers such as `onClick`. If you wish to obtain a deeper understanding on the types of supported event handling methods, please refer to [The official documentation on Event System](https://facebook.github.io/react/docs/events.html)。

## Refs and form handling
Above we introduced props (which cannot be edited after it is introduced), state (changes according to interaction with user) and event handling, next we will introduce how to handle forms in React. Once again we will use an official example from React's webpage, "A Component Using External Plugins" for our introduction. Because React easily integrates external libraries (ex: jQuery), this example will use `remarkable` combined with `ref` props to extract DOM Value (another common usage is using `onChange` handler to handle form content), allowing users to use the straightforward Markdown editor.

HTML Markup (In addition to importing `react` and `react-dom` we also use `CDN` import for `remarkable`, a `Markdown` syntax parser plugin, remember if you do not use Webpack or browserify + babelify related tools you need to import `babel-standalone` ES6 syntax parser for the browser and add type="text/babel" within the import <script>:

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width">
  <title>A Component Using External Plugins</title>
</head>
<body>
<script src="https://fb.me/react-15.1.0.js"></script>
<script src="https://fb.me/react-dom-15.1.0.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/babel-standalone/6.18.1/babel.min.js"></script>
<script src="https://cdn.jsdelivr.net/remarkable/1.6.2/remarkable.min.js"></script>
  <div id="app"></div>
	<script type="text/babel" src="./app.js"></script>
</body>
</html>
```

app.js：

```javascript
class MarkdownEditor extends React.Component {
	constructor(props) {
		super(props);
		this.handleChange = this.handleChange.bind(this);
		this.rawMarkup = this.rawMarkup.bind(this);
		this.state = {
			value: 'Type some *markdown* here!',
		}
	}
	handleChange() {
	    this.setState({value: this.refs.textarea.value});
	}
	// Parse the Markdown submitted by the user to HTML and place it within our DOM, React usually uses a virtual DOM to communicate with the DOM, it is not recommended to directly manipulate the DOM. The associated prop is dangerouslySetInnerHTML
	rawMarkup() {
	    const md = new Remarkable();
	    return { __html: md.render(this.state.value) };
	}
	render() {
	    return (
	      <div className="MarkdownEditor">
	        <h3>Input</h3>
	        <textarea
	          onChange={this.handleChange}
	          ref="textarea"
	          defaultValue={this.state.value} />
	        <h3>Output</h3>
	        <div
	          className="content"
	          dangerouslySetInnerHTML={this.rawMarkup()}
	        />
	      </div>
	    );
	}
}

ReactDOM.render(<MarkdownEditor />, document.getElementById('app'));
```

## Summary
Above, we used a few examples from React's official homepage to demonstrate some core React topics such as Props and State features as well as form handling within React, for readers who are still unfamiliar with this I recommend manually typing in the code from the demo above, or you can use a tool like [jsbin](http://jsbin.com/) which allows you to immediately preview your work for practice, this will help you become more familiar with the related syntax and API! In the next part we will investigate Component lifecycles.

## Extended Reading
1. [React Official Homepage](https://facebook.github.io/react/index.html)
2. [Top-Level API](https://facebook.github.io/react/docs/top-level-api.html)
3. [Javascript:this usage](https://software.intel.com/zh-cn/blogs/2013/10/09/javascript-this)

## :door: Nexus
| [Home](https://github.com/sycherng/reactjs101/tree/en-US) | [Previous article: JSX Simple Starter Guide](https://github.com/sycherng/reactjs101/blob/en-US/Ch03/react-jsx-introduction.md) | [Next article: React Component Specification and Life Cycle](https://github.com/sycherng/reactjs101/blob/en-US/Ch04/react-component-life-cycle.md) |

| [Corrections, questions, or requests](https://github.com/kdchang/reactjs101/issues) |
