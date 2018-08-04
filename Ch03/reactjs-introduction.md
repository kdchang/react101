# ReactJS and Component Design Introduction

## Foreword
In the previous chapter we quickly learned about React development environment configuration and basic Webpack concepts. Now we will deepen our understanding of several important characteristics to pay attention to during React and Component design.

## ReactJS characteristics introduction
React originally was a development tool used internally at Facebook, yet it was a project with a very lofty goal: `Learn once, write anywhere`. Ever since its open-source release in 2013 its ecosystem has expanded rapidly. The appearance of ReactJS allowed front-end development to see many revolutionary new lines of thinking to emerge, of which there are a few major characteristics worthy of our inspection:

1. Thinking in terms of Components
2. Using JSX to carry out Declarative UI design
3. Use of a Virtual DOM
4. Component PropType error-proofing mechanism
5. Components are like State Machines, in that they also have Life Cycles
6. "Always Redraw" and Unidirectional Data Flow
7. Writing Inline Style CSS within Javascript

## Thinking in terms of Components


![ReactJS and Component Design Introduction](./images/component.png "ReactJS and Component Design Introduction")

In the world of React, the most fundamental units are Components, every component may have child components, and may be combined into a Composable unit according to build needs, in doing so allowing characteristics such as encapsulation, Separation of Concerns, Reuse, and Compose.


`<TodoApp>` component may include `<TodoHeader />`, `<TodoList />` child components
```javascript
	<div>
		<TodoHeader />
		<TodoList />
	</div>
```

Inside the `<TodoList />` component：
```javascript
	<div>
		<ul>
			<li>write code</li>
			<li>flirt with girls</li>
			<li>purchase books</li>
		</ul>
	</div>
```

The change towards using Components is a holy grail within web fron-end development, many developers' biggest wish is to have maximal reuse of written code (aka DRY code), avoiding duplicate work. In React, components are the foundation to everything, allowing the app development process to seem like building with bricks. However for those front-end developers who in the past have become accustomed to using templates in their development, it is not easy to switch to component-based thinking within a short timeframe, especially when we have become used to separation of HTML, CSS and JavaScript, only to now have to put them all together.

A rather optimal way to train yourself is when viewing various webpages or applications, force yourself to see the entire website in terms of individual components. Have faith that after a period of time, your eyes will open, and become familiarized with thinking in terms of components.


Below are the two common ways to write React Components:

1. Using Class from ES6 (allows more complex operations and control over the lifecycle of the component, more resource intensive than stateless components)

	```javascript
	//  pay note to capitalize the first letter of Component
	class MyComponent extends React.Component {
		// render is the only method that is mandatory for Class based components
		render() {
			return (
				<div>Hello, World!</div>
			);
		}
	}

	// Insert the component named <MyComponent /> into the DOM element with id set to 'app'
	ReactDOM.render(<MyComponent/>, document.getElementById('app'));
	```

2. Writing a Functional Component (stateless components to be rendered simply in the UI, there is no actual object with ref, no lifecycle variable. If you do not need to control the lifecycle, stateless components are recommended to achieve better performance)

	```javascript
	// Use arrow function to designate Functional Components allowing UI design to be simpler（f(D) => UI）, reducing side effects
	const MyComponent = () => (
		<div>Hello, World!</div>
	);
	
	// Insert the component named <MyComponent /> into the DOM element with id set to 'app'
	ReactDOM.render(<MyComponent/>, document.getElementById('app'));
	```

## Using JSX to carry out Declarative UI design
React's design follows the belief that the use of Components allows better separation of concerns as compared to Template and Display Logic based design, pairing with JSX enables Declarative (focus on "what to") as opposed to Imperative ("how to") programming style.

For example the below Declarative style UI design is easier to understand than a design only using Templates:

```javascript
// Use of Declarative UI design makes it easy to see the purpose of this component
<MailForm />
```

```javascript
// How <MailForm /> looks on the inside:
<form>
	<input type="text" name="email" />
	<button type="submit"></button>
</form>
```

Because JSX plays a key role in writing React components, we will cover JSX usage in more detail in the next chapter.

## Use of a Virtual DOM
It is common in the traditional Web to use jQuery for direct handling of DOM operations. Changes in the DOM was frequently a bottleneck for Web performance, therefore the React world provides a Virtual DOM mechanism, allowing the App and DOM to communicate through the Virtual DOM. When the DOM is altered, React's internal diff calculates the smallest update needed, and executes those minimal updates on the real DOM.

## Component PropType error-proofing mechanism
The design in React not only provides props with Default Prop Values, it also provides Prop Validation mechanisms, allowing the design of the entire Component to be more robust:

```javascript
//  pay note to capitalize thf first letter in Component
class MyComponent extends React.Component {
	// render is the only mandatory method in Class based components
	render() {
		return (
			<div>Hello, World!</div>
		);
	}
}

// PropTypes validation, if prop type is invalid an error is displayed
MyComponent.propTypes = {
  todo: React.PropTypes.object,
  name: React.PropTypes.string,
}

// Prop default values, if no parameters are given to props it will take on the default values
MyComponent.defaultProps = {
 todo: {}, 
 name: '', 
}
```

For more ways to use Validation check out the instructions at [official webpage](https://facebook.github.io/react/docs/reusable-components.html).

## Components are like State Machines, in that they also have Life Cycles
Components act like a State Machine, depending on the varying state (edited via `setState()`) and props (provided by the parent component), Components will display a corresponding result. And as humans age and pass away, components also have life cycles. Through manipulation of the life cycle veriable, we can specify exact times for the Component to handle tasks, a more detailed introduction on Component lifecycles will be covered in the next chapter.

## "Always Redraw" and Unidirectional Data Flow
In the React world, props and state are important features that affect the appearance of React Components. In particular props are conveyed from the parent component and cannot be changed. On the other hand state is altered according to interactions with the user, it mainly changes through the setState() method. When React discovers a new change in props or state, it will completely redraw the UI. Of course you can always use forceUpdate() method to forcibly redraw a component. Paired with Flux or Flux-like architectures (for example: Redux), React can realize Unidirectional Data Flow in an even more concrete way, providing heightened clarity for data flow management.


## Writing Inline Style CSS within Javascript
Within a React Component, Inline Style CSS can be wrapped within Javascript:

```javascript
const divStyle = {
  color: 'red',
  backgroundImage: 'url(' + imgUrl + ')',
};

ReactDOM.render(<div style={divStyle}>Hello World!</div>, document.getElementById('app'));
```

## Summary
Above we covered several key characteristics of ReactJS:：

1. Thinking in terms of Components
2. Using JSX to carry out Declarative UI design
3. Use of a Virtual DOM
4. Component PropType error-proofing mechanism
5. Components are like State Machines, in that they also have Life Cycles
6. "Always Redraw" and Unidirectional Data Flow
7. Writing Inline Style CSS within Javascript

In the next part we will investigate the usage of JSX in React with more detail.

## Extended Reading
1. [React Example-Based Primer Course](http://www.ruanyifeng.com/blog/2015/03/react.html)
2. [React Demystified](http://blog.reverberate.org/2014/02/react-demystified.html)
3. [Top-Level API](https://facebook.github.io/react/docs/top-level-api.html)
4. [ES6 Classes Component](https://facebook.github.io/react/docs/reusable-components.html#es6-classes)

(image via [maketea](http://maketea.co.uk/images/2014-03-05-robust-web-apps-with-react-part-1/wireframe_deconstructed.png))

## :door: Nexus
| [Home](https://github.com/sycherng/reactjs101/tree/en-US) | [Previous article：React Development Environment Settings and Introduction to Webpack](https://github.com/sycherng/reactjs101/blob/en-US/Ch02/webpack-dev-enviroment.md) | [Next article: JSX Simple Starter Guide](https://github.com/sycherng/reactjs101/blob/en-US/Ch03/react-jsx-introduction.md) |

| [Corrections, questions, or requests](https://github.com/kdchang/reactjs101/issues) |
