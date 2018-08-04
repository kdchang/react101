# React Component Specification and Life Cycle

## Foreword
With the effort invested thus far, surely the reader now has grasped to a certain extent how to develop simple React Components, now we will investigate React component specifications and lifecycles in more detail.

## React Component Specification
If the reader recalls, formerly we introduced that React allows two ways to write components: one is using ES6 classes, the other is using Stateless Components, written as Functional Components, soley for the purpose of rendering UI. Now we will help everyone review the simple examples from the previous chapter:
若讀者還有印象的話，我們前面介紹 React 特性時有描述 React 的主要撰寫方式有兩種：一種是使用 ES6 Class，另外一種是 Stateless Components，使用 

1. Using ES6 Class (allows complex operations and control of the component lifecycle), more resource-intensive than stateless components)

	```javascript
	//  capitalize Components
	class MyComponent extends React.Component {
		// render is the only mandatory method for Class based components
		render() {
			return (
				<div>Hello, {this.props.name}</div>
			);
		}
	}

	// PropTypes validation, if provided with incorrect props type displays an error
	MyComponent.propTypes = {
		name: React.PropTypes.string,
	}

	// Prop default value, if the corresponding props has no incoming value it will default to this, this is a shared value between all instantiated Components
	MyComponent.defaultProps = {
	 	name: '',
	}

	// insert <MyComponent /> component into the DOM element with id set to app 
	ReactDOM.render(<MyComponent name="Mark"/>, document.getElementById('app'));
	```

2. Writing Functional Components (for simple UI rendering and stateless components, contains no internal state, there is no actual object and ref, no lifecycle function. If control of lifecycles is not needed I recommend using stateless components for better performance)

	```javascript
	// Using arrow function to design our Functional Component allows a cleaner UI (f(D) => UI), and minimizes side effect
	const MyComponent = (props) => (
		<div>Hello, {props.name}</div>
	);

	// PropTypes validation, if provided with incorrect props type displays an error
	MyComponent.propTypes = {
		name: React.PropTypes.string,
	}

	// Prop default value, if the corresponding props has no incoming value it will default to this
	MyComponent.defaultProps = {
		name: '',
	}

	// insert <MyComponent /> component into the DOM element with id set to app
	ReactDOM.render(<MyComponent name="Mark"/>, document.getElementById('app'));
	```

It is worth noting that in ES6 Class `render()` is the only mandatory method (but also note that `render()` must be kept simple, do not make changes to the state or asynchronous interactions with the browser here, if you need to achieve asynchronous interactions please do so within `componentDidMount()`), and for functional components `return null` is a currently permitted value. Oh and, in ES6 discontinued support for `mixins` which helped with code reuse.

## React Component Lifecycle
React Components have a lifecycle just like humans will live, grow old, become frail, and pass away. Normally speaking a Component will have the below three lifecycle phases:

1. Mounting: has been mounted onto the true DOM
2. Updating: re-rendering is underway
3. Unmounting: disconnected from the true DOM

Regarding Component lifecycles, React also provided relevant methods:

1. Mounting
	- componentWillMount()
	- componentDidMount()
2. Updating
	- componentWillReceiveProps(object nextProps): called by mounted components when they receive new variables
	- shouldComponentUpdate(object nextProps, object nextState): called by components when deciding whether to re-render, will not be called upon startup unless forceUpdate() is called.
	- componentWillUpdate(object nextProps, object nextState)
	- componentDidUpdate(object prevProps, object prevState)
3. Unmounting
	- componentWillUnmount()

Many readers will find Component lifecycles very abstract at first, so we will now provide a simple example to give everyone a feel for Component lifecycles. Readers may discover that as a component loads it will trigger `console.log('constructor');`, and then in sequence, `componentWillMount`, `componentDidMount`, and when text is clicked `handleClick()` is triggered and updates `state` which will then call `componentWillUpdate` and `componentDidUpdate` in sequence:

HTML Markup：
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width">
  <script src="https://fb.me/react-15.1.0.js"></script>
  <script src="https://fb.me/react-dom-15.1.0.js"></script>
  <title>Component LifeCycle</title>
</head>
<body>
  <div id="app"></div>
</body>
</html>
```

Component lifecycle demo:

```javascript
class MyComponent extends React.Component {
  constructor(props) {
    super(props);
    console.log('constructor');
    this.handleClick = this.handleClick.bind(this);
    this.state = {
      name: 'Mark',
    }
  }
  handleClick() {
    this.setState({'name': 'Zuck'});
  }
  componentWillMount() {
    console.log('componentWillMount');
  }
  componentDidMount() {
    console.log('componentDidMount');
  }
  componentWillReceiveProps() {
    console.log('componentWillReceiveProps');
  }
  componentWillUpdate() {
    console.log('componentWillUpdate');
  }
  componentDidUpdate() {
    console.log('componentDidUpdate');
  }
  componentWillUnmount() {
    console.log('componentWillUnmount');
  }
  render() {
    return (
      <div onClick={this.handleClick}>Hi, {this.state.name}</div>
    );
  }
}

ReactDOM.render(<MyComponent />, document.getElementById('app'));
```

<a class="jsbin-embed" href="http://jsbin.com/yokebo/embed?html,js,console,output">Click here to see a detailed demo</a><script src="http://static.jsbin.com/js/embed.min.js?3.39.12"></script>

![React Component Specification and Life Cycle](./images/react-lifecycle.png)

In particular the special method `shouldComponentUpdate` currently has the default `return true`. If you want to optimize performance you can code your own logic, if using `immutable` you can test with `nextProps === this.props` to compare whether changes took place:

```javascript
shouldComponentUpdate(nextProps, nextState) {
  return nextProps.id !== this.props.id;
}
```

## Ajax asynchronous processing
If you require Ajax asynchronous processing, please handle these within `componentDidMount`. Below we use `jQuery` to handle `Ajax` to receive `Github API` data as an example:

HTML Markup：

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width">
  <script src="https://fb.me/react-15.1.0.js"></script>
  <script src="https://fb.me/react-dom-15.1.0.js"></script>
  <script src="https://code.jquery.com/jquery-3.1.0.js"></script>
  <title>GitHub User</title>
</head>
<body>
  <div id="app"></div>
</body>
</html>
```

app.js

```javascript
class UserGithub extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          username: '',
          githubtUrl: '',
          avatarUrl: '',
        }
    }
    componentDidMount() {
        $.get(this.props.source, (result) => {
            console.log(result);
            const data = result;
            if (data) {
              this.setState({
                    username: data.name,
                    githubtUrl: data.html_url,
                    avatarUrl: data.avatar_url
              });
            }
        });
    }
    render() {
        return (
          <div>
            <h3>{this.state.username}</h3>
            <img src={this.state.avatarUrl} />
            <a href={this.state.githubtUrl}>Github Link</a>.
          </div>
        );
    }
}

ReactDOM.render(
  <UserGithub source="https://api.github.com/users/torvalds" />,
  document.getElementById('app')
);
```

<a class="jsbin-embed" href="http://jsbin.com/kupusa/embed?html,js,output">Click here to see a detailed demo</a><script src="http://static.jsbin.com/js/embed.min.js?3.39.12"></script>

## Summary
Above we introduced React Component Specifications and the Lifecycle concept, among which the lifecycle concept may be rather abstract for beginners, I recommend readers to follow the demos by physically doing each step. In the next part we will be giving a more in-depth introduction on `React Router` so readers can experience single page application design.

## Extended Reading
1. [Component Specs and Lifecycle](https://facebook.github.io/react/docs/component-specs.html#lifecycle-methods)

(image via [react-lifecycle](http://imgh.us/react-lifecycle.svg))

## :door: Nexus
| [Home](https://github.com/sycherng/reactjs101/tree/en-US) | [Previous article: Props, State, Refs and form handling](https://github.com/sycherng/reactjs101/blob/en-US/Ch04/props-state-introduction.md) | [下一章：Learn by Writing: React Router Introduction](https://github.com/sycherng/reactjs101/blob/en-US/Ch05/react-router-introduction.md) |

| [Corrections, questions, or requests](https://github.com/kdchang/reactjs101/issues) |
