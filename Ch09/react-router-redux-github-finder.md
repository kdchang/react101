# Learn by Writing: Using React + Router + Redux + ImmutableJS to write a Github search app

## Foreword
After learning many skills, this article will guide everyone in completing a Single Page Application, integrating React + Redux + ImmutableJS + React Router paired with Github API to create a simple Github user search app, to experience the feeling of developing a React App.

## Feature planning
Visitors can use Github ID to search for Github users, display Github username, followers, following, avatar_url and return to home page.

## Tech stack

1. React
2. Redux
3. Redux Thunk
4. React Router
5. ImmutableJS
6. Fetch
7. [Material UI](http://www.material-ui.com/#/)
8. Roboto Font from Google Font
9. Github API（https://api.github.com/users/torvalds）

Although pay note that if an App Key is not used with the Github API, API calls are limited

## Project end-result screenshot

![React Redux](./images/demo-1.png "React Redux")

![React Redux](./images/demo-2.png "React Redux")


## Environment installation and configuration
1. Install Node and NPM

2. Install required packages

```
$ npm install --save react react-dom redux react-redux react-router immutable redux-immutable redux-actions whatwg-fetch redux-thunk material-ui react-tap-event-plugin
```

```
$ npm install --save-dev babel-core babel-eslint babel-loader babel-preset-es2015 babel-preset-react babel-preset-stage-1 eslint eslint-config-airbnb eslint-loader eslint-plugin-import eslint-plugin-jsx-a11y eslint-plugin-react html-webpack-plugin webpack webpack-dev-server redux-logger
```

Configure our development file.

1. Configure Babel settings file: `.babelrc`

	```javascript
	{
		"presets": [
	  	"es2015",
	  	"react",
	 	],
		"plugins": []
	}

	```

2. Configure ESLint settings file and rules: `.eslintrc`

	```javascript
	{
	  "extends": "airbnb",
	  "rules": {
	    "react/jsx-filename-extension": [1, { "extensions": [".js", ".jsx"] }],
	  },
	  "env" :{
	    "browser": true,
	  }
	}
	```

3. Configure Webpack settings file: `webpack.config.js`

	```javascript
	// Allows you to dynamically insert bundled .js files to .index.html
	const HtmlWebpackPlugin = require('html-webpack-plugin');

	const HTMLWebpackPluginConfig = new HtmlWebpackPlugin({
	  template: `${__dirname}/src/index.html`,
	  filename: 'index.html',
	  inject: 'body',
	});
	
	// entry is our entrypoint, output is the file location after processing is completed by eslint, babel loader
	module.exports = {
	  entry: [
	    './src/index.js',
	  ],
	  output: {
	    path: `${__dirname}/dist`,
	    filename: 'index_bundle.js',
	  },
	  module: {
	    preLoaders: [
	      {
	        test: /\.jsx$|\.js$/,
	        loader: 'eslint-loader',
	        include: `${__dirname}/src`,
	        exclude: /bundle\.js$/
	      }
	    ],
	    loaders: [{
	      test: /\.js$/,
	      exclude: /node_modules/,
	      loader: 'babel-loader',
	      query: {
	        presets: ['es2015', 'react'],
	      },
	    }],
	  },
	  // Settings for launching test (cannot be used in production)
	  devServer: {
	    inline: true,
	    port: 8008,
	  },
	  plugins: [HTMLWebpackPluginConfig],
	};
	```

Awesome! This concludes our development environment settings and allows us to set about writing our `Github Finder` appication!

## Putting to Practice

1. Setup Mockup

	HTML Markup（`src/index.html`）：

	```html
	<!DOCTYPE html>
	<html lang="en">
	<head>
	  <meta charset="UTF-8">
		<title>GithubFinder</title>
		<link href="https://fonts.googleapis.com/css?family=Roboto:300,400,500" rel="stylesheet">
	</head>
	<body>
		<div id="app"></div>
	</body>
	</html>
	```

	Configuring `webpack.config.js` entrypoint `src/index.js`:

	```javascript
	import React from 'react';
	import ReactDOM from 'react-dom';
	import { Provider } from 'react-redux';
	import { browserHistory, Router, Route, IndexRoute } from 'react-router';
	import injectTapEventPlugin from 'react-tap-event-plugin';
	import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
	import Main from './components/Main';
	import HomePageContainer from './containers/HomePageContainer';
	import ResultPageContainer from './containers/ResultPageContainer';
	import store from './store';

	// Import react-tap-event-plugin to prevent issues during onTouchTap event with material-ui
	// Needed for onTouchTap
	// http://stackoverflow.com/a/34015469/988941
	injectTapEventPlugin();
	
	// Use react-redux Provider to wrap store and it pass along, allowing every component to get state
	// Here we use browserHistory for history, and use material-ui MuiThemeProvider to wrap all of our components
	// Because this is a simple App we designed Main as a parent template, additionally there are two child components HomePageContainer and ResultPageContainer, of which HomePageContainer is the root position child component
	ReactDOM.render(
	  <Provider store={store}>
	    <MuiThemeProvider>
	      <Router history={browserHistory}>
	        <Route path="/" component={Main}>
	          <IndexRoute component={HomePageContainer} />
	          <Route path="/result" component={ResultPageContainer} />
	        </Route>
	      </Router>
	    </MuiThemeProvider>
	  </Provider>,
	  document.getElementById('app')
	);
	```

2. Actions

	First we define actions constants:

	```javascript
	export const SHOW_SPINNER = 'SHOW_SPINNER';
	export const HIDE_SPINNER = 'HIDE_SPINNER';
	export const GET_GITHUB_INITIATE = 'GET_GITHUB_INITIATE';
	export const GET_GITHUB_SUCCESS = 'GET_GITHUB_SUCCESS';
	export const GET_GITHUB_FAIL = 'GET_GITHUB_FAIL';
	export const CHAGE_USER_ID = 'CHAGE_USER_ID';
	```	

	Now we will plan out our actions, in this example we used `redux-thunk` to handle asynchronous actions (if you are unfamiliar with new Ajax handling method fetch() you can first [refer to this document](https://developer.mozilla.org/zh-TW/docs/Web/API/GlobalFetch/fetch). Below is the complete code for `src/actions/githubActions.js`:

	```javascript
	// Here fetch polyfill is imported, considerate of allowing old browsers to use fetch
	import 'whatwg-fetch';
	// import actionTypes constants
	import {
	  GET_GITHUB_INITIATE,
	  GET_GITHUB_SUCCESS,
	  GET_GITHUB_FAIL,
	  CHAGE_USER_ID,
	} from '../constants/actionTypes';

	// import uiActions actions
	import {
	  showSpinner,
	  hideSpinner,
	} from './uiActions';

	// This part is the focus of this example, to learn about what we have not covered before - asynchronous action handling: unlike synchronous actions directly dispatching actions, asynchronous actions will return a function which has a dispatch parameter, within this we use Ajax (here we use fetch()) to process
	// Usual API interaction process: INIT (begin request/ show spinner) -> COMPLETE (completed request/ hide spinner) -> Error (request failed)
	// This time although we did not use redux-actions we maintained Flux Standard Action format: { type: '', payload: {} }

	export const getGithub = (userId = 'torvalds') => {
	  return (dispatch) => {
	    dispatch({ type: GET_GITHUB_INITIATE });
	    dispatch(showSpinner());
	    fetch('https://api.github.com/users/' + userId)
	      .then(function(response) { return response.json() })
	      .then(function(json) { 
	        dispatch({ type: GET_GITHUB_SUCCESS, payload: { data: json } });
	        dispatch(hideSpinner());
	      })
	      .catch(function(response) { dispatch({ type: GET_GITHUB_FAIL }) });
	  } 
	}

	// Synchronous actions handling, returning action object
	export const changeUserId = (text) => ({ type: CHAGE_USER_ID, payload: { userId: text } });
	```
	
	Below is `src/actions/uiActions.js` which handles UI behaviours:

	```javascript
	import { createAction } from 'redux-actions';
	import {
	  SHOW_SPINNER,
	  HIDE_SPINNER,
	} from '../constants/actionTypes';
	
	// Synchronous actions handling, returning action object
	export const showSpinner = () => ({ type: SHOW_SPINNER});
	export const hideSpinner = () => ({ type: HIDE_SPINNER});
	```

	Through `src/actions/index.js` we export our actions

	```javascript
	export * from './uiActions';
	export * from './githubActions';
	```

3. Reducers

	Now we will configure Reducers and models (initialState format) and design, pay attention that this example entirely uses `ImmutableJS`. Below is `src/constants/models.js`:

	```javascript
	import Immutable from 'immutable';

	export const UiState = Immutable.fromJS({
	  spinnerVisible: false,
	});

	// We use userId to temporarily save user's ID, the data is saved in the information return by Ajax
	export const GithubState = Immutable.fromJS({
	  userId: '',
	  data: {},
	});
	```

	Below is `src/reducers/data/githubReducers.js`:

	```javascript
	import { handleActions } from 'redux-actions';
	import { GithubState } from '../../constants/models';

	import {
	  GET_GITHUB_INITIATE,
	  GET_GITHUB_SUCCESS,
	  GET_GITHUB_FAIL,
	  CHAGE_USER_ID,
	} from '../../constants/actionTypes';

	const githubReducers = handleActions({ 
	  // When user presses submit button, upon dispatching GET_GITHUB_SUCCESS action merge the received data 
	  GET_GITHUB_SUCCESS: (state, { payload }) => (
	    state.merge({
	      data: payload.data,
	    })
	  ),  
	  // When user enters an User ID, upon dispatching CHAGE_USER_ID action merge the received data
	  CHAGE_USER_ID: (state, { payload }) => (
	    state.merge({
	      'userId':
	      payload.userId
	    })
	  ),
	}, GithubState);

	export default githubReducers;

	```

	Below is `src/reducers/ui/uiReducers.js`:

	```javascript
	import { handleActions } from 'redux-actions';
	import { UiState } from '../../constants/models';

	import {
	  SHOW_SPINNER,
	  HIDE_SPINNER,
	} from '../../constants/actionTypes';

	// Show spinner along with fetch
	const uiReducers = handleActions({
	  SHOW_SPINNER: (state) => (
	    state.set(
	      'spinnerVisible',
	      true
	    )
	  ),
	  HIDE_SPINNER: (state) => (
	    state.set(
	      'spinnerVisible',
	      false
	    )
	  ),
	}, UiState);

	export default uiReducers;
	```

	Combine `redux-immutable` used by reduces with `combineReducers`. Below is `src/reducers/index.js`:

	```javascript
	import { combineReducers } from 'redux-immutable';
	import ui from './ui/uiReducers';// import routes from './routes';
	import github from './data/githubReducers';// import routes from './routes';

	const rootReducer = combineReducers({
	  ui,
	  github,
	});

	export default rootReducer;
	```
	
	Using redux's createStore API to make a store from integration of `rootReducer`, `initialState` and `middlewares`. Below is `src/store/configureSotore.js`

	```javascript
	import { createStore, applyMiddleware } from 'redux';
	import reduxThunk from 'redux-thunk';
	import createLogger from 'redux-logger';
	import Immutable from 'immutable';
	import rootReducer from '../reducers';

	const initialState = Immutable.Map();

	export default createStore(
	  rootReducer,
	  initialState,
	  applyMiddleware(reduxThunk, createLogger({ stateTransformer: state => state.toJS() }))
	);
	```

4. Build Component
	
	Finally we have come to the design for View details, first we should target the design of our parent template, which is the `AppBar` which appears on every page. Below is `src/components/Main/Main.js`:

	```javascript
	import React from 'react';
	// import AppBar
	import AppBar from 'material-ui/AppBar';

	const Main = (props) => (
	  <div>
	    <AppBar
	      title="Github Finder"
	      showMenuIconButton={false}
	    />
	    <div>
	      {props.children}
	    </div>
	  </div>
	);

	// Commence propTypes validation
	Main.propTypes = {
	  children: React.PropTypes.object,
	};

	export default Main;
	```

	Below is `src/components/ResultPage/HomePage.js`:

	```javascript
	import React from 'react';
	// Using react-router Link for hyperlinking, send userId as query
	import { Link } from 'react-router';
	import RaisedButton from 'material-ui/RaisedButton';
	import TextField from 'material-ui/TextField';
	import IconButton from 'material-ui/IconButton';
	import FontIcon from 'material-ui/FontIcon';

	const HomePage = ({
	  userId,
	  onSubmitUserId,
	  onChangeUserId,
	}) => (
	  <div>
	    <TextField
	      hintText="Please Key in your Github User Id."
	      onChange={onChangeUserId}
	    />
	    <Link to={{ 
	      pathname: '/result',
	      query: { userId: userId }
	    }}>
	      <RaisedButton label="Submit" onClick={onSubmitUserId(userId)} primary />
	    </Link>
	  </div>
	);

	export default HomePage;
	```

	Below is `src/components/ResultPage/ResultPage.js`, using `userId` as `props` to send to `<GithubBox />`:


	```javascript
	import React from 'react';
	import GithubBox from '../../components/GithubBox';

	const ResultPage = (props) => (
	  <div> 
	    <GithubBox data={props.data} userId={props.location.query.userId} />  
	  </div>
	);

	export default ResultPage;
	```

	Below is `src/components/GithubBox/GithubBox.js`, handles the appearance of acquired Github information:

	```javascript
	import React from 'react';
	import { Link } from 'react-router';
	// Import material-ui cardlike component
	import { Card, CardActions, CardHeader, CardMedia, CardTitle, CardText } from 'material-ui/Card';
	// Import material-ui RaisedButton
	import RaisedButton from 'material-ui/RaisedButton';
	// Import ActionHome icon
	import ActionHome from 'material-ui/svg-icons/action/home';

	const GithubBox = (props) => (
	  <div>
	    <Card>
	      <CardHeader
	        title={props.data.get('name')}
	        subtitle={props.userId}
	        avatar={props.data.get('avatar_url')}
	      />
	      <CardText>
	        Followers : {props.data.get('followers')}
	      </CardText>      
	      <CardText>
	        Following : {props.data.get('following')}
	      </CardText>
	      <CardActions>
	        <Link to="/">
	          <RaisedButton 
	            label="Back" 
	            icon={<ActionHome />}
	            secondary={true} 
	          />
	        </Link>
	      </CardActions>
	    </Card> 
	  </div>
	);

	export default GithubBox;
	```

5. Connect State to Component

	Lastly, we want to link Container with Component (if you have forgotten this, first go back to practice Container and Presentational Components INtroduction!). Below is `src/containers/HomePage/HomePage.js`, which is responsible for using props to send userId and the used event handling methods to component:

	```javascript
	import { connect } from 'react-redux';
	import HomePage from '../../components/HomePage';

	import {
	  getGithub,
	  changeUserId,
	} from '../../actions';

	export default connect(
	  (state) => ({
	    userId: state.getIn(['github', 'userId']),
	  }),
	  (dispatch) => ({
	    onChangeUserId: (event) => (
	      dispatch(changeUserId(event.target.value))
	    ),
	    onSubmitUserId: (userId) => () => (
	      dispatch(getGithub(userId))
	    ),
	  }),
	  (stateProps, dispatchProps, ownProps) => {
	    const { userId } = stateProps;
	    const { onSubmitUserId } = dispatchProps;
	    return Object.assign({}, stateProps, dispatchProps, ownProps, {
	      onSubmitUserId: onSubmitUserId(userId),
	    });
	  }
	)(HomePage);
	```

	Below is `src/containers/ResultPage/ResultPage.js`:

	```javascript
	import { connect } from 'react-redux';
	import ResultPage from '../../components/ResultPage';

	export default connect(
	  (state) => ({
	    data: state.getIn(['github', 'data'])    
	  }),
	  (dispatch) => ({})
	)(ResultPage);
	```

6. That's it

	If everything was successful, at this time within the terminal you can use `$ npm start` command, and at `http://localhost:8008` you can see the fruits of your effort!

	![React Redux](./images/demo-1.png "React Redux")

## Summary
This chapter guided readers to integrate from scratch React + Redux + ImmutableJS + React Router paired with Github API to create a simple Github user search appication. In the next article we will tackle advanced apps, learn Server Side Rendering related knowledge, and use React + Redux + Node(Isomorphic) to develop a receipe sharing website.

## Extended Reading

1. [Tutorial: build a weather app with React](http://joanmira.com/tutorial-build-a-weather-app-with-react/)
2. [OpenWeatherMap](http://openweathermap.org/)
3. [Weather Icons](https://erikflowers.github.io/weather-icons/)
4. [Weather API Icons](https://erikflowers.github.io/weather-icons/api-list.html)
5. [Material UI](http://www.material-ui.com/#/)
6. [This API is so Fetching!](https://hacks.mozilla.org/2015/03/this-api-is-so-fetching/)
7. [Redux: trigger async data fetch on React view event](http://stackoverflow.com/questions/33304225/redux-trigger-async-data-fetch-on-react-view-event)
8. [Github API](https://api.github.com/)
9. [Traditional Ajax is dead, long live Fetch](https://github.com/camsong/blog/issues/2)

## :door: Nexus
| [Home](https://github.com/sycherng/reactjs101/tree/en-US) | [Previous article: Container and Presentational Components introduction](https://github.com/sycherng/reactjs101/blob/en-US/Ch08/container-presentational-component-.md) | [Next article: React Redux Server Rendering (Isomorphic JavaScript) Introduction](https://github.com/sycherng/reactjs101/blob/en-US/Ch10/react-redux-server-rendering-isomorphic-javascript.md) |

| [Corrections, questions or requests](https://github.com/kdchang/reactjs101/issues) |
