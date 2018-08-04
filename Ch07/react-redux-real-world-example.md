# Redux Real World Example

## Foreword

After gaining understanding of the basic concepts of Redux through the previous article, we will now put our Redux knowledge to practice with React and Redux combined with ImmutableJS to create a simple Todo app. Let's cut to the chase and begin!

Below is an image representing an entire React Redux App's data flow (users interact with View => dispatch Actions => Reducers match actions to appropriate methods based on action type => returns a new state => React-Redux sends the new state to React, which re-renders the View):

![React Redux](./images/redux-flow.png "React Redux")

## Hands-on creating React Redux ImmutableJS TodoApp
Before we begin we will complete some development housekeeping tasks, using the below command to create an npm settings file `package.json`:

```
$ npm init
```

Install related packages (including dev environment packages):

```
$ npm install --save react react-dom redux react-redux immutable redux-actions redux-immutable
```

```
$ npm install --save-dev babel-core babel-eslint babel-loader babel-preset-es2015 babel-preset-react eslint eslint-config-airbnb eslint-loader eslint-plugin-import eslint-plugin-jsx-a11y eslint-plugin-react html-webpack-plugin webpack webpack-dev-server
```

After installation we can first design our folder structure, first we will make a `src` folder in our project root directory, where we will place our `source` files for `script`s. In `components` directory we will place all of our `components` (individual component directories will use `index.js` to export components, allowing cleaner component importation), `containers` (responsible for interacting with store to get state), and also `actions`, `constants`, `reducers`, `store`, the other configuration files should be placed under project root directory.

Approximate folder structure will look like this:

![React Redux](./images/redux-folder.png "React Redux")

Next we will refer to the previous article's settings to configure our (`.babelrc`, `.eslintrc`, `webpack.config.js`). This concludes our development environment setup and allows us to start working on our `React Redux` application!

First we picture our application with our eye for Components, dividing our application to individual `Component`s. In our design we have a main `Main` component that contains two child Components: `TodoHeader`, `TodoList`.

![React Redux](./images/react-redux-demo.png "React Redux")

First we design our HTML Markup:

```html
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>Redux Todo</title>
</head>
<body>
	<div id="app"></div>
</body>
</html>
```

Before we write `src/index.js`, we should first explain how to integrate `react-redux`. In the below image we can see that `react-redux` is the bridge between React and Redux, using `Provider` and `connect` to link `store` and React View.

![React Redux](./images/using-redux.jpg "React Redux")

Actually, after we integrate `react-redux`, our React App can overcome the traditional problems and difficulties encountered in sending state before switching Components. Through `Provider` we can allow every `Component` in our React App to fetch state from store, this is very convenient (next we will detail how to use the `connect` method for Containers/Components).。

![React Redux](./images/redux-store.png "React Redux")

Below is the completed code for `src/index.js`:

```javascript
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import Main from './components/Main';
import store from './store';

ReactDOM.render(
  <Provider store={store}>
    <Main />
  </Provider>,
  document.getElementById('app')
);
```

In particular `src/components/Main/Main.js` is a Stateless Component, responsible for the entrypoint of the entire View.

```javascript
import React from 'react';
import ReactDOM from 'react-dom';
import TodoHeaderContiner from '../../containers/TodoHeaderContainer';
import TodoListContainer from '../../containers/TodoListContainer';

const Main = () => (
  <div>
    <TodoHeaderContainer />
    <TodoListContainer />
  </div>
);

export default Main;
```

Next we will define our `Actions`, because the example App is relatively simple, here we only define a todoActions. Here we used [redux-actions](https://github.com/acdlite/redux-actions), which enables us to conveniently use Flux Standard Action formatting for action. Below is the completed code for `src/actions/todoActions.js`:

```javascript
import { createAction } from 'redux-actions';
import {
  CREATE_TODO,
  DELETE_TODO,
  CHANGE_TEXT,
} from '../constants/actionTypes';

export const createTodo = createAction('CREATE_TODO');
export const deleteTodo = createAction('DELETE_TODO');
export const changeText = createAction('CHANGE_TEXT');
```

We export all actions in `src/actions/index.js`

```javascript
export * from './todoActions';
```

We also place constants in `components` directory for ease of management, below is the completed code for `src/constants/actionTypes.js`:

```javascript
export const CREATE_TODO = 'CREATE_TODO';
export const DELETE_TODO = 'DELETE_TODO';
export const CHANGE_TEXT = 'CHANGE_TEXT';

/* 
alternatively consider using keyMirror, allows convenient creation of variables that have the same key
import keyMirror from 'fbjs/lib/keyMirror';

export default keyMirror({
    ADD_ITEM: null,
    DELETE_ITEM: null,
    DELETE_ALL: null,
    FILTER_ITEM: null
});
*/
```

After setting our Actions we should discuss our Reducers. Before we discuss our Reducers we should first configure our front-end data structure, here we put all data initialState within `src/constants/model.js`. Pay special attention that because Redux has a special characteristic where `State is read-only`, this means upon update when reducers enter action only new states will be returned and the original state will not be altered. Therefore in our entire Redux App we use `ImmutableJS` to allow the data flow to remain `Immutable`, which also increases our performance in app development as well as prevent unexpected side effects.

Below is the complete code for `src/constants/models.js`, in particular we defined the TodoState data structure and used `fromJS()` to convert to `Immutable`:

```javascript
import Immutable from 'immutable';

export const TodoState = Immutable.fromJS({
  'todos': [],
  'todo': {
    id: '',
    text: '',
    updatedAt: '',
    completed: false,
  }
});
```

Now we discuss our Reducers, `todoReducers` takes care of mapping actions to appropriate handling methods and bringing `payload` data (here we use [redux-actions](https://github.com/acdlite/redux-actions) for mapping, the usage is cleaner than traditional switch). Reducers' action handling method is `(initialState, action) => newState`,  finally returning a new state, instead of changing the original state, so here we use `ImmutableJS`.

```javascript
import { handleActions } from 'redux-actions';
import { TodoState } from '../../constants/models';

import {
  CREATE_TODO,
  DELETE_TODO,
  CHANGE_TEXT,
} from '../../constants/actionTypes';

 const todoReducers = handleActions({
  CREATE_TODO: (state) => {
    let todos = state.get('todos').push(state.get('todo'));
    return state.set('todos', todos)
  },
  DELETE_TODO: (state, { payload }) => (
    state.set('todos', state.get('todos').splice(payload.index, 1))
  ),
  CHANGE_TEXT: (state, { payload }) => (
    state.merge({ 'todo': payload })
  )
}, TodoState);

export default todoReducers;
```

```javascript
import { handleActions } from 'redux-actions';
import UiState from '../../constants/models';

export default handleActions({
  SHOW: (state, { payload }) => (
    state.set('todos', payload.todo)
  ),
}, UiState); 
```

Although Redux can only allows one store, it offers `combineReducers` to allow us to dissect our state for convenient maintenance. In truth, state formatting is its own body of knowledge, usually one must continuously experiment and discuss with one's development team to figure out better ways to do it. Here we should pay note that we switched to using `redux-immutable`'s `combineReducers` to guarantee our state remains `Immutable`.

Redux official documentation does not specify strict formats. Usually I would separate reducers to `data` versus purely UI related `ui` states. But because this is a more simple example, we end up only using `src/reducers/data/todoReducers.js`.

```javascript
import { combineReducers } from 'redux-immutable';
import ui from './ui/uiReducers';// import routes from './routes';
import todo from './data/todoReducers';// import routes from './routes';

const rootReducer = combineReducers({
  todo,
});

export default rootReducer;
```

Remember above when we explained the bridge between React and Redux we mentioned the store? Now we will design our `store` in more detail, here we used two other APIs from redux: applyMiddleware and createStore. Respectively they can create store and mount our chosen middleware (here we only used redux-logger for convenience in debugging). Pay attention that our initialState is also `Immutable`.	

```javascript
import { createStore, applyMiddleware } from 'redux';
import createLogger from 'redux-logger';
import Immutable from 'immutable';
import rootReducer from '../reducers';

const initialState = Immutable.Map();

export default createStore(
  rootReducer,
  initialState,
  applyMiddleware(createLogger({ stateTransformer: state => state.toJS() }))
);
```

Through `src/store/index.js` we export configureStore:

```javascript
export { default } from './configureStore';
```

After discussing our architecture, we finally come to the View part. You can do it, the end is in sight!
Before we discuss `Component`s let us study 

The API `connect` provided by [react-redux](https://github.com/reactjs/react-redux) for sending props to Component, its usage is as below:

`connect([mapStateToProps], [mapDispatchToProps], [mergeProps], [options])` 

In our example App we will only use the first two parameters at first, the third parameter will be used in our later example. The first parameter mapStateToProps allows developers to extract states from store and map to props, the second parameter encapsulates dispatch behaviour as a function and sends to props allowing convenient mapping and calling.

Below is our `src/components/TodoHeader/TodoHeader.js`:

```javascript
import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import TodoHeader from '../../components/TodoHeader';

// import our desired actions
import {
  changeText,
  createTodo,
} from '../../actions';

const mapStateToProps = (state) => ({
	// get todo state from store
	todo: state.getIn(['todo', 'todo'])
});

const mapDispatchToProps = (dispatch) => ({
	// when the user input information at the input element this function is triggered, sending out changeText action and provides the content entered by the user as event.target.value
	onChangeText: (event) => (
	  dispatch(changeText({ text: event.target.value }))
	),
	// when the user presses send, the createTodo action is sent and clears input element
	onCreateTodo: () => {
	  dispatch(createTodo());
	  dispatch(changeText({ text: '' }));
	}
});

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(TodoHeader);

// Constructing Component and using props from connect to bind events (onChange, onClick). Pay attention that because we used `ImmutableJS` our state uses `get()` to get value
const TodoHeader = ({
  onChangeText,
  onCreateTodo,
  todo,
}) => (
  <div>
    <h1>TodoHeader</h1>
    <input type="text" value={todo.get('text')} onChange={onChangeText} />
    <button onClick={onCreateTodo}>Submit</button>
  </div>
);

export default TodoHeader;
```

Below is `src/components/TodoList/TodoList.js` portion:

```javascript
import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import TodoList from '../../components/TodoList';

import {
  deleteTodo,
} from '../../actions';

const mapStateToProps = (state) => ({
  todos: state.getIn(['todo', 'todos'])
});

// Using Component to send in the index of the element we want to delete
const mapDispatchToProps = (dispatch) => ({
  onDeleteTodo: (index) => () => (
    dispatch(deleteTodo({ index }))
  )
});

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(TodoList);

// The value we need to pay attention to under Component is todos state which uses map function to iterate over elements, because we want React JSX to render and maintain the immutability of the incoming event state, we use toJS() to convert our array.
const TodoList = ({
  todos,
  onDeleteTodo,
}) => (
  <div>
    <ul>
    {
      todos.map((todo, index) => (
        <li key={index}>
          {todo.get('text')}
          <button onClick={onDeleteTodo(index)}>X</button>
        </li>
      )).toJS()
    }
    </ul>
  </div>
);

export default TodoList;
```

If everything was successful we can see the results of our effort in the browser! (because we used `redux-logger` when we open the console we can see action and state changes, but remember to remove it for `production` environments)

![React Redux](./images/react-redux-dev-demo.png "React Redux")

## Summary
Above is my Redux Real World Example, those readers who are writing Redux for the first time may need to practice a few more times, to realize through experience the entire architecture. In the next chapter we will optimize our React Redux TodoApp, allowing it to have a more clean and easily maintainable structure.

## Extended Reading
1. [Redux Official Homepage](http://redux.js.org/index.html)

(image via [JonasOhlsson](http://www.slideshare.net/JonasOhlsson/using-redux), [licdn](https://media.licdn.com/mpr/mpr/shrinknp_800_800/AAEAAQAAAAAAAAUQAAAAJDAyMWU1MmZhLTYzMTQtNDJkNy1hYzM4LTE5MWQzNWM1ODcyNA.png))

## :door: Nexus
| [Home](https://github.com/sycherng/reactjs101/tree/en-US) | [Previous article: Redux Basic Concept](https://github.com/sycherng/reactjs101/blob/en-US/Ch07/react-redux-introduction.md) | [Next article: Container and Presentational Components Introduction](https://github.com/sycherng/reactjs101/blob/en-US/Ch08/container-presentational-component-.md) |

| [Corrections, questions, or requests](https://github.com/kdchang/reactjs101/issues) |
