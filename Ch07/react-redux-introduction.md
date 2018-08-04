# Redux Basic Concept

![React Redux](./images/redux-logo.png "React Redux")

## Foreword
In the previous chapter we discussed the features and usage of Flux, but in practice many developers prefer a similarly Flux-like but cleaner, file-rich and clear [Redux](http://redux.js.org/index.html) for their data management architecture. Redux is an open-source library released by Dan Abramov, its main functionality is as per the official homepage: `Redux is a predictable state container for JavaScript apps.`, allowing developers to easily develop complex JavaScript applications (note that Redux and React have no dependency upon each other, but integrates with React well).

## Flux/Redux Super Comparison

From a simple Flux/Redux comparison image we can see the two differ silightly:

![React Redux](./images/using-redux-compare.jpg "React Redux")

Before we start to write our Redux App we should first understand some differences between Redux and Flux:

1. Uses a single store to manage the entire application's state and object tree methods:

	The original Flux uses many dispersed stores to save varying states, but in redux, only one store is used to save all data access objects.

	```javascript
	//original Flux store
	const userStore = {
	    name: ''
	}
	const todoStore = {
	    text: ''
	}

	// Redux single store
	const state = {
	    userState: {
	        name: ''
	    },
	    todoState: {
	        text: ''
	    }
	}
	```

2. The only way to alter state is to send an action, this part is similar to Flux, however Redux unlike Flux has not designed a Dispatcher. Redux actions and Flux actions both are objects which contain `type` and `payload`.

3. Redux unlike Flux, has a Reducer. Reducer is a function which changes state according to action and type. You can use switch or the a function mapping method to match up handling methods. 

4. Redux has many convenient and useful supplemental testing tools (such as: [redux-devtools](https://github.com/gaearon/redux-devtools), [react-transform-boilerplate](https://github.com/gaearon/react-transform-boilerplate), and the easy to test and use `Hot Module Reload`.

## Redux core concept introduction

![React Redux](./images/redux-flowchart.png "React Redux")

In the above image we can see that Redux's data flow model can be boiled down to: `View -> Action -> (Middleware) -> Reducer`. When users interact with the View, event triggers send out Action, if Middleware is used, it enters the Reducer for some handling, when Action enters the Reducer, the Reducer uses action type for mapping to the corresponding handling tasks, and then returns the new state. View then redraws the UI once it detects a change in state. In this chapter we discuss the synchronousscenario, we will discuss the asynchronous scenario in the next chapter. Below we follow a simple example from the official website to allow everyone to experience the entire workflow of Redux:

```javascript
import { createStore } from 'redux';

/** 
  Below is a simple example of reducers, its main purpose is to return an appropriate new state based on the incoming action type
	reducer signature: (state, action) => newState
  Usually the state may be primitive, array or object and possibly even ImmutableJS Data. But pay note we cannot edit the original state,
  we return a new state. Because there are many benefits of using ImmutableJS in Redux, our example App will also use ImmutableJS 
*/
function counter(state = 0, action) {
  switch (action.type) {
  case 'INCREMENT':
    return state + 1;
  case 'DECREMENT':
    return state - 1;
  default:
    return state;
  }
}

// Create a Redux store to save all of our App's state
// store's API allows { subscribe, dispatch, getState } 
let store = createStore(counter);

// we can use subscribe() to subscribe for updates in state. But in practice react-redux is often used to bridge React and Redux
store.subscribe(() =>
  console.log(store.getState());
);

// if changes in state, send out our action
store.dispatch({ type: 'INCREMENT' });
// 1
store.dispatch({ type: 'INCREMENT' });
// 2
store.dispatch({ type: 'DECREMENT' });
// 1
```

## Redux API Introduction

1. createStore: `createStore(reducer, [preloadedState], [enhancer])`

	We know within Redux there is only one store. We use `createStore` API to create that store. The first variable is our `reducer` or several `reducers` combined (using `combineReducers`) as `rootReducers`. The second variable is for the `state`s we wish to have preloaded for example: user session etc. The third variable is for any `middlewares` we want to use to enhance Redux, if there are multiple `middlewares`, it is usually integrated via `applyMiddleware`.

2. Store

	Four methods under Store:

	- getState()
	- dispatch(action)
	- subscribe(listener)
	- replaceReducer(nextReducer)

	The main point regarding Store is knowing that Redux has only one store for the entire App's State, the only way to change State is to dispatch actions.

3. combineReducers：`combineReducers(reducers)`

	combineReducers allows the incorporation of many reducers, returning a Function，allowing us to have appropriate division of reducer

4. applyMiddleware：`applyMiddleware(...middlewares)`	

	The offical explanation for Middleware
	> It provides a third-party extension point between dispatching an
	action, and the moment it reaches the reducer.
		
	If the reader has experienced NodeJS, the concept of middleware should not be foreign, allowing the developer to execute some operations between req and res. In Redux, Middleware plays the role of a third enhancer before action reaches reducer, and the use of applyMiddleware allows the incorporation of mutliple `middlewares` and returns a Function, for convenient use.

	If you are using asynchronous behaviour you need to use particular middleware: [redux-thunk](https://github.com/gaearon/redux-thunk), [redux-promise](https://github.com/acdlite/redux-promise) or [redux-promise-middleware](https://github.com/pburtchaell/redux-promise-middleware), this allows you to dispatch Promises instead of functions following actions. Asynchronous workflow is as the below image shows:

	![React Redux](./images/react-redux-diagram.png "React Redux")

5. bindActionCreators：`bindActionCreators(actionCreators, dispatch)`

	bindActionCreators can bind `actionCreators` and `dispatch`, returning a Function or Object, allowing cleaner code. However using react-redux `connect` will allow for easier management of dispatch behaviour

6. compose: `compose(...functions)`
	
	compose can combine functions from right to left and return a Function, as the official webpage demo shows:

	```
	import { createStore, combineReducers, applyMiddleware, compose } from 'redux'
	import thunk from 'redux-thunk'
	import DevTools from './containers/DevTools'
	import reducer from '../reducers/index'

	const store = createStore(
	  reducer,
	  compose(
	    applyMiddleware(thunk),
	    DevTools.instrument()
	  )
	)
	```

## Summary
Above we introduced Redux basic concepts, if the reader feels it is still abstract that is okay, in the next chapter we will guide everyone to integrate in a practical way `React`, `Redux` and `ImmutableJS` in a TodoApp.

## Extended Reading
1. [Redux Official Homepage](http://redux.js.org/index.html)
2. [Redux Architecture Putting to Practice——Single Source of Truth](http://react-china.org/t/redux-single-source-of-truth/5564)
3. [Presentational and Container Components](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0)
4. [Using Redux to manage your React app](https://github.com/matthew-sun/blog/issues/18)
5. [Using redux](http://www.slideshare.net/JonasOhlsson/using-redux)

(image via [githubusercontent](https://raw.githubusercontent.com/reactjs/redux/master/logo/logo-title-dark.png), [makeitopen](http://makeitopen.com/static/images/redux_flowchart.png), [css-tricks](https://css-tricks.com/wp-content/uploads/2016/03/redux-article-3-03.svg), [tighten](https://blog.tighten.co/assets/img/react-redux-diagram.png), [tryolabs](http://blog.tryolabs.com/wp-content/uploads/2016/04/redux-simple-f8-diagram.png), [facebook](https://facebook.github.io/flux/img/flux-simple-f8-diagram-with-client-action-1300w.png), [JonasOhlsson](http://www.slideshare.net/JonasOhlsson/using-redux))

## :door: Nexus
| [Home](https://github.com/sycherng/reactjs101/tree/en-US) | [Previous article: Flux Basic Concept and Putting to Practice](https://github.com/sycherng/reactjs101/blob/en-US/Ch07/react-flux-introduction.md) | [Next article: Redux Real World Example](https://github.com/sycherng/reactjs101/blob/en-US/Ch07/react-redux-real-world-example.md) |

| [Corrections, questions, or requests](https://github.com/kdchang/reactjs101/issues) |
