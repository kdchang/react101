# Flux Basic Concept and Putting to Practice

![React Flux](./images/react-flux.jpeg "React Flux")

## Foreword
As the complexity of React App increases, we discover we frequently change the state tree through sending props from Parent Components to Child Components, but not only is this inconvenient it is also hard to manage, therefore we need a better data structure to build more complex applications. [Flux](https://facebook.github.io/flux/) is a client-side Architecture application released by Facebook, aimed to resolve some problems associated with `MVC` structuring. In truth, Flux is not a complete front-end Framework, its distinguishing feature is that it achieve Unidirectional Data Flow design, allowing easier state management when developing large intricate applications. Because React mainly handles the View portion, paired with a Flux-like data managment architecture, we can more easily manage our state, and process more complicated user interaction (For example: Facebook must simultaneously maintain the states of whether the user has hit "like", clicked the photo, or has a new message).

Because the original Flux architecture needs some streamlining and improvements, in practice we usually use a Flux-like architecture written by the developer community (Such as: [Redux](http://redux.js.org/index.html), [Alt](http://alt.js.org/), [Reflux](https://github.com/reflux/refluxjs) etc). Here we will mainly use the Facebook-provided `Dispatcher API` library (which can be thought of as a pub/sub handler,  utilizes broadcast to pass `payloads` to the registered callback function) paired with `NodeJS`' `EventEmitter` module to complete our Flux architecture.

## Flux Concept Introduction
![React Flux](./images/flux-simple-diagram.png "React Flux")

In the Unidirectional Data Flow World of Flux there are four major actors, each responsible for different tasks:

1. actions / Action Creator 

	action is responsible for defining the behaviour of all changed states, in order to allow the developer to quickly understand all the features of the App, if you want to change state you may only send out actions. Pay note that action may be synchronous or asynchronous. For example: adding a new task, we call the asynchronous API to acquire data.

	In practice we differentiate action from Action Creator. Action is the object that describes a behaviour, Action Creator hands the action over to the dispatcher. Normally an action that is a Flux Standard Action would be written like the below example code, using `type` to differentiate the triggering behaviour, `payload` is the data carried with it:

	```
	// action
	const addTodo = {
	  type: 'ADD_TODO',
	  payload: {
	    text: 'Do something.'  
	  }
	}

	AppDispatcher.dispatch(addTodo);
	```

	when a Promise is rejected:

	```
	{
	  type: 'ADD_TODO',
	  payload: new Error(),
	  error: true
	}
	```

2. Dispatcher

	`Dispatcher` is the core of Flux architecture, every App has only one Dispatcher, allowing the API to store registerable `callback function`s, as well as sending all action events to the store. In this demo we use the Facebook-provided Dispatcher API, which comes with the `dispatch` and `subscribe` methods.

3. Stores

	An App typically has multiple stores where logical operations are contained, differing operations use different stores, for example: TodoStore, RecipeStore. A store is responsible for operating and saving information and providing `listener`s for the `view` to use, if the data is changed it will trigger an update. It is worth noting that store only allows `getter API` to read its data, if a change in state is desired an action must be sent.

4. Views (Controller Views)

	This is the category `React` is responsible for, it handles event-listening `callback function`s, when events take place data retrieval takes place and the `View` is redrawn.

## Flux workflow review

![React Flux](./images/flux-react.png "React Flux")

Flux architecture for front-end processing:

1. Stores register callbacks with the Dispatcher, Stores are notified when there is a change in data
2. Controller Views access initial data from Stores
3. Controller Views hands data to Views for UI rendering
4. Controller Views registers listeners with stores, when information is altered Controller Views are notified

Flux user interaction workflow:

1. User interacts with App, triggering an event, the Action Creator sends actions to the Dispatcher
2. The Dispatcher sequentially transfers action to stores and discerns appropriate handling based on action type
3. If information is altered, the listeners registered within the stores by the Controller Views now retrieve the updated information from the store
4. View redraws the UI according to the new information in Controller Views

## Flux Putting to Practice First Experience
After introducing the basics of Flux architecture, we will now put our knowledge to practice with a simple Todo app using Flux architecture, allowing users to `input` and create todo items.

First, we will do some initial development setup, using the below command to create npm settings file `package.json` in the project root directory:

```
$ npm init
```

Install related plugins (including development environment plugins):

```
$ npm install --save react react-dom flux events
```

```
$ npm install --save-dev babel-core babel-eslint babel-loader babel-preset-es2015 babel-preset-react eslint eslint-config-airbnb eslint-loader eslint-plugin-import eslint-plugin-jsx-a11y eslint-plugin-react html-webpack-plugin webpack webpack-dev-server
```

After installation we can design our folder structure, first we create `src` in root project directory to place our `source` files for `script`. In `components` directory we place all `components` (individual component folders will use `index.js` to export components, allowing for cleaner component imports), additionally there are `actions`, `constants`, `dispatcher`, `stores`, the remaining configuration files are placed under the root directory.

![React Flux directory structure](./images/folder.png "React Flux directory structure")

Now we will reference the settings from last chapter to configurate our (`.babelrc`, `.eslintrc`, `webpack.config.js`). This concludes our development environment setup and allows us to start putting our knowledge to practice by building a `React Flux` application!

HTML Markup：

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>TodoFlux</title>
</head>
<body>
    <div id="app"></div>
</body>
</html>
```

Below is the full code for `src/index.js`, where we set up a parent `component` and the insertion point for our HTML Markup:

```javascript
import React from 'react';
import ReactDOM from 'react-dom';
import TodoHeader from './components/TodoHeader';
import TodoList from './components/TodoList';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div>
        <TodoHeader />
        <TodoList />
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('app'));
```

Usually in practice we will create a `constants` directory to place our `config` or `actionTypes` constants. Below is `src/constants/actionTypes.js`:

```javascript
export const ADD_TODO = 'ADD_TODO';
```

In this example we inherited the Facebook-provided Dispatcher API (mainly we inherited `dispatch`, `register` and `subscribe` methods), to create our own DispatcherClass, when the user triggers `handleAction()` our event will be `dispatch`ed. Below is `src/dispatch/AppDispatcher.js`:

```javascript
// Todo app dispatcher with actions responding to both
// view and server actions
import { Dispatcher } from 'flux';

class DispatcherClass extends Dispatcher {
  handleAction(action) {
    this.dispatch({
      type: action.type,
      payload: action.payload,
    });
  }
}

const AppDispatcher = new DispatcherClass();

export default AppDispatcher;
```

Below we use the `Action Creator` made by `AppDispatcher`, using `handleAction` to manage imported `action`s, the full code for `src/actions/todoActions.js`:

```javascript
import AppDispatcher from '../dispatcher/AppDispatcher';
import { ADD_TODO } from '../constants/actionTypes';

export const TodoActions = {
  addTodo(text) {
    AppDispatcher.handleAction({
      type: ADD_TODO,
      payload: {
        text,
      },
    });
  },
};
```

`Store` is mainly responsible for information and operation handling, we inherited `EventEmitter` from `events` module, when an `action` is fed into `AppDispatcher.register`'s scope, an appropriate `store` is chosen for processing based on `action type`, on completion the `emit` method emits our event to the listening `Views Controller`. Below is `src/stores/TodoStore.js`:

```javascript
import AppDispatcher from '../dispatcher/AppDispatcher';
import { ADD_TODO } from '../constants/actionTypes';
import { EventEmitter } from 'events';

const store = {
  todos: [],
  editing: false,
};

class TodoStoreClass extends EventEmitter {
  addChangeListener(callback) {
    this.on(ADD_TODO, callback);
  }
  removeChangeListener(callback) {
    this.removeListener(ADD_TODO, callback);
  }
  getTodos() {
    return store.todos;
  }
}

const TodoStore = new TodoStoreClass();

AppDispatcher.register((action) => {
  switch (action.type) {
    case ADD_TODO:
      store.todos.push(action.payload.text);
      TodoStore.emit(ADD_TODO);
      break;
    default:
      return true;
  }
  return true;
});

export default TodoStore;
```

In thie React Flux demo we integrated `View` with `Views Controller`. In `TodoHeader`, our main mission is to allow users to add new todo tasks via `input`. When the user enters words within `input`, `onChange` event is triggered, updating internal `state`, when the user clicks the submit button `onAdd` event is triggered, and the `addTodo event` is `dispatch`ed. Below is the full demo for `src/components/TodoHeader.js`:

```javascript
import React, { Component } from 'react';
import { TodoActions } from '../../actions/todoActions';

class TodoHeader extends Component {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
    this.onAdd = this.onAdd.bind(this);
    this.state = {
      text: '',
      editing: false,
    };
  }
  onChange(event) {
    this.setState({
      text: event.target.value,
    });
  }
  onAdd() {
    TodoActions.addTodo(this.state.text);
    this.setState({
      text: '',
    });
  }
  render() {
    return (
      <div>
        <h1>TodoFlux</h1>
        <div>
          <input
            value={this.state.text}
            type="text"
            placeholder="Enter todo task here"
            onChange={this.onChange}
          />
          <button
            onClick={this.onAdd}
          >
            Submit
          </button>
        </div>
      </div>
    );
  }
}

export default TodoHeader;
```

Above our Component allows users to add new todo tasks, now we will allow the newly added todo task to be displayed. We added a listener `TodoStore` in `componentDidMount` which will update the data when it is changed, this allows the user-submitted todo task to be in sync with `TodoList`. Below is the full code for `src/components/TodoList.js`:

```javascript
import React, { Component } from 'react';
import TodoStore from '../../stores/TodoStore';

function getAppState() {
  return {
    todos: TodoStore.getTodos(),
  };
}
class TodoList extends Component {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
    this.state = {
      todos: [],
    };
  }
  componentDidMount() {
    TodoStore.addChangeListener(this.onChange);
  }
  onChange() {
    this.setState(getAppState());
  }
  render() {
    return (
      <div>
        <ul>
          {
            this.state.todos.map((todo, key) => (
              <li key={key}>{todo}</li>
            ))
          }
        </ul>
      </div>
    );
  }
}

export default TodoList;
```

If the reader was able to follow the steps above, in the end we can run `npm start` within the terminal from the root directory, and see the entire result, YA！
![React Flux ](./images/flux-demo.png "React Flux ")

## Summary
Flux advantages:

1. Allows the developer to quickly understand the behaviours of the entire App
2. Data and operational logic are placed together permitting ease of management
3. Simplifies View's role to only be responsible for setting the UI and no state management
4. A clear structure and division of work promotes maintainence of code in intricate mid to large sized applications

Flux disadvantages:

1. The code is not sleek
2. The code is rather too complicated for a simple smaller application

Above is our Flux Putting to Practice Introduction, I know readers initially interacting with Flux may find it to be very abstract, and some readers may even doubt the usefulness of such an architecture (evidently it is not that much more brilliant than MVC and it is not remotely clean), but as listed under the advantages of Flux the design pattern excels at providing a clear structure and division of work which is easier to manage for mid to large sized codebases. Those readers who still feel unfamiliar can follow the demonstration by going through the motions, I believe gradually the unique qualities of Flux will be felt. In truth, the development community has created many Flux-like architectures and libraries to allow for a cleaner Flux architecture, in the following part I will introduce readers to the currently hottest one: `Redux`.

## Extended Reading
1. [Getting To Know Flux, the React.js Architecture](https://scotch.io/tutorials/getting-to-know-flux-the-react-js-architecture)
2. [Flux Offical Website](https://facebook.github.io/flux/)
3. [Using the difference between Flux and MVC to introduce Flux](http://blog.techbridge.cc/2016/04/29/introduce-flux-from-flux-and-mvc/)
4. [Flux Stores and ES6](https://medium.com/@softwarecf/flux-stores-and-es6-9b453dbf9db#.uuf1ddj8u)
5. [React and Flux: Migrating to ES6 with Babel and ESLint](https://medium.com/front-end-developers/react-and-flux-migrating-to-es6-with-babel-and-eslint-6390cf4fd878#.vafamphwy)
6. [Building an ES6/JSX/React Flux App – Part 2 – The Flux](https://shellmonger.com/2015/08/17/building-an-es6jsxreact-flux-app-part-2-the-flux/)
7. [Question: How to choose between Redux's store and React's state? #1287](https://github.com/reactjs/redux/issues/1287)
8. [acdlite/flux-standard-action](https://github.com/acdlite/flux-standard-action)

(image via [devjournal](http://devjournal.ru/wp-content/uploads/2016/03/React.js-Flux-Redux.png), [facebook](https://facebook.github.io/flux/), [scotch.io](https://cask.scotch.io/2014/10/V70cSEC.png))

## :door: Nexus
| [Home](https://github.com/sycherng/reactjs101/tree/en-US) | [Previous article: ImmutableJS Introduction](https://github.com/sycherng/reactjs101/blob/en-US/Ch06/react-immutable-introduction.md) | [Next article: Redux Basic Concept](https://github.com/sycherng/reactjs101/blob/en-US/Ch07/react-redux-introduction.md) |

| [Corrections, questions, or requests](https://github.com/kdchang/reactjs101/issues) |
