# Container and Presentational Components Introduction

## Foreword
After chatting about React and Redux integration we now will discuss the concept of separating Presentational dn Container components, if this is the first time you have heard of this term, I recommend you can first take a look at author Dan Abramov's article [Presentational and Container Components](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0#.vtcuxsurv).

## Container and Presentational Components Super Comparison
Below I referenced [Redux official documentation](http://redux.js.org/docs/basics/UsageWithReact.html) to list the difference between the two:

1. Presentational Components	
	- Purpose: how things look (Markup, aesthetics)
	- Should let Redux be aware of it: no
	- Method of data acquiry: via props
	- Method to alter data: using props to call callback functions
  - Entry method: manually

2. Container Components
 - Purpose: how to do things (get data, update State)
 - Should let Redux be aware of it: yes
 - Method of data acquiry: subscribing to Redux State (store)
 - Method to alter data: Dispatch Redux Action
 - Entry method: created with React Redux

 From the above analysis readers may discover, the biggest difference between the two is with presentational `Component`s are chiefly responsible for simple UI rendering, while `Container` components mainly handle communication between Redux and store, serving as the bridge between `Redux` and `Component`. This strategy allows code structure and division of labor to be more clear, so now we will use last article's Redux TodoApp for refactoring, to a Container and Presentational Components format.

## Container Components

Below is the `src/containers/TodoHeaderContainer/TodoHeaderContainer.js` portion:

```javascript
import { connect } from 'react-redux';
import TodoHeader from '../../components/TodoHeader';

// import desired actions
import {
  changeText,
  createTodo,
} from '../../actions';

const mapStateToProps = (state) => ({
  // get todo state from store
  todo: state.getIn(['todo', 'todo'])
});

const mapDispatchToProps = (dispatch) => ({
  // when user enters information to input, this function is triggered, sending out changeText action with user entered content as event.target.value
  onChangeText: (event) => (
    dispatch(changeText({ text: event.target.value }))
  ),
  // when the user presses submit, sends out createTodo action and clears input
  onCreateTodo: () => {
    dispatch(createTodo());
    dispatch(changeText({ text: '' }));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TodoHeader);
```

Below is the `src/containers/TodoListContainer/TodoListContainer.js` portion:

```javascript
import { connect } from 'react-redux';
import TodoList from '../../components/TodoList';

import {
  deleteTodo,
} from '../../actions';

const mapStateToProps = (state) => ({
  todos: state.getIn(['todo', 'todos'])
});

const mapDispatchToProps = (dispatch) => ({
  onDeleteTodo: (index) => () => (
    dispatch(deleteTodo({ index }))
  )
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TodoList);
```

## Presentational Components

Below is the `src/components/TodoHeader/TodoHeader.js` portion:

```javascript
import React from 'react';
import ReactDOM from 'react-dom';

// Begin to construct Component and use  props sent in from connect to bind events (onChange, onClick). Pay note that because our state uses `ImmutableJS`, `get()` is used to extract values

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

Below is the `src/components/TodoList/TodoList.js` portion:

```javascript
import React from 'react';
import ReactDOM from 'react-dom';

// The value we need to pay attention to under Component is todos state which uses map function to iterate over elements, because we want React JSX to render and maintain the immutability of the incoming event state, we use toJS() to convert our array.
// Using Component to send in the index of the element we want to delete

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

## Summary
That's it!Through the distinction of Container from Presentational Components our code architecture and division of tasks is even clearer! Next we will use what we have learned to develop two projects useful in day to day life, allowing readers to become even more familiar with the practical applications of the React ecosystem.

## Extended Reading
1. [Presentational and Container Components](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0#.vtcuxsurv)
2. [Redux Usage with React](http://redux.js.org/docs/basics/UsageWithReact.html)
3. [React Higher Order Components in depth](https://medium.com/@franleplant/react-higher-order-components-in-depth-cf9032ee6c3e#.r8srulpaj)
4. [React higher order components](http://www.darul.io/post/2016-01-05_react-higher-order-components)

## :door: Nexus
| [Home](https://github.com/sycherng/reactjs101/tree/en-US) | [Previous article: Redux Real World Example](https://github.com/sycherng/reactjs101/blob/en-US/Ch07/react-redux-real-world-example.md) | [Next article: using React + Router + Redux + ImmutableJS to write a Github search application](https://github.com/sycherng/reactjs101/blob/en-US/Ch09/react-router-redux-github-finder.md) |

| [Corrections, questions, or requests](https://github.com/kdchang/reactjs101/issues) |
