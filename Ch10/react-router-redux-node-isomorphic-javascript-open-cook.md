# Using React + Redux + Node (Isomorphic JavaScript) to develop a recipe-sharing website

## Foreword
If you are a reader that has accompanied us on this React journey from ths start congratulations, and thank you for following our steps of learning, for a beginner this road is not easy. This article is the final formal article with example aside from the appendix, it is also the largest in scale, in this article we will integrate everything we have learned and add some knowledge to develop
 a recipe sharing community website with member login, let's GO!

## Requirement planning
A community website that allows members to log in and share recipes.

## Feature planning
1. React Router / Redux / Immutable / Server Render / Async API
2. User login/logout (JSON Web Token)
3. CRUD form handling
4. Connection to database (ORM/MongoDB)

## Technologies used
1. React
2. Redux(redux-actions/redux-promise/redux-immutable)
3. React Router
4. ImmutableJS
5. Node MongoDB ORM(Mongoose)
6. JSON Web Token
7. React Bootstrap
8. Axios(Promise)
9. Webpack
10. UUID

## Project result screenshots

![Using React + Redux + Node (Isomorphic JavaScript) to develop a recipe-sharing website](./images/open-cook-demo-1.png "Using React + Redux + Node (Isomorphic JavaScript) to develop a recipe-sharing website")

![Using React + Redux + Node (Isomorphic JavaScript) to develop a recipe-sharing website](./images/open-cook-demo-2.png "Using React + Redux + Node (Isomorphic JavaScript) to develop a recipe-sharing website")

![Using React + Redux + Node (Isomorphic JavaScript) to develop a recipe-sharing website](./images/open-cook-demo-3.png "Using React + Redux + Node (Isomorphic JavaScript) to develop a recipe-sharing website")

![Using React + Redux + Node (Isomorphic JavaScript) to develop a recipe-sharing website](./images/open-cook-demo-4.png "Using React + Redux + Node (Isomorphic JavaScript) to develop a recipe-sharing website")

## Environment installation and configuration
1. Install Node and NPM

2. Install needed packages

```
$ npm install --save react react-dom redux react-redux react-router immutable redux-immutable redux-actions redux-promise bcrypt body-parser cookie-parser debug express immutable jsonwebtoken mongoose morgan passport passport-local react-router-bootstrap axios serve-favicon validator uuid
```

```
$ npm install --save-dev babel-core babel-eslint babel-loader babel-preset-es2015 babel-preset-react babel-preset-stage-1 eslint eslint-config-airbnb eslint-loader eslint-plugin-import eslint-plugin-jsx-a11y eslint-plugin-react html-webpack-plugin webpack webpack-dev-server redux-logger
```

Next we will configure our development files.

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

3. Configure Webpack settings file: `webpack.config.js`:

	```javascript
	import webpack from 'webpack';

	module.exports = {
	  entry: [
	    './src/client/index.js',
	  ],
	  output: {
	    path: `${__dirname}/dist`,
	    filename: 'bundle.js',
	    publicPath: '/static/'
	  },
	  module: {
	    preLoaders: [
	      {
	        test: /\.jsx$|\.js$/,
	        loader: 'eslint-loader',
	        include: `${__dirname}/app`,
	        exclude: /bundle\.js$/,
	      },
	    ],
	    // Use Hot Module Replacement plugins
	    plugins: [
	      new webpack.optimize.OccurrenceOrderPlugin(),
	      new webpack.HotModuleReplacementPlugin()
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
	};
	```

4. Configure `src/server/config/index.js`:

```javascript
export default ({
  "secret": "ilovecooking",
	"database": "mongodb://localhost/open_cook"
});
```	

Awesome! This concludes our environment settings and allows us to get started on our community recipe sharing app!	

At the same time we will begin designing our folder structure, we will mainly divide the directories as `client`, `common`, `server`:

![Using React + Redux + Node (Isomorphic JavaScript) to develop a recipe-sharing website](./images/open-cook-demo-folder.png "Using React + Redux + Node (Isomorphic JavaScript) to develop a recipe-sharing website")

## Putting to practice

First we will design `src/client/index.js`:

```javascript
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { browserHistory, Router } from 'react-router';
import { fromJS } from 'immutable';
// We placed routing in routes under common directory
import routes from '../common/routes';
import configureStore from '../common/store/configureStore';
import { checkAuth } from '../common/actions';

// Rehydrate the initialState sent from server side
const initialState = window.__PRELOADED_STATE__;

// Send initialState to configureStore function to build a store and send to Provider
const store = configureStore(fromJS(initialState));
ReactDOM.render(
  <Provider store={store}>
    <Router history={browserHistory} routes={routes} />
  </Provider>,
  document.getElementById('app')
);
```

Because Node-side needs latest version for better ES6 support, use `babel-register` in `src/server/index.js` to translate `server.js`, however this is not recommended for `production` environments.

```javascript
// use babel-register to precompile ES6 
require('babel-register');
require('./server');
```

```javascript
// Import Express, mongoose (MongoDB ORM) and related serve packages
/* Server Packages */
import Express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import mongoose from 'mongoose';
import config from './config';
// import back-end model, communicate with database via model 
import User from './models/user';
import Recipe from './models/recipe';

// import webpackDevMiddleware as server middleware for front-end
/* Client Packages */
import webpack from 'webpack';
import React from 'react';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import { RouterContext, match } from 'react-router';
import { renderToString } from 'react-dom/server';
import { Provider } from 'react-redux';
import Immutable, { fromJS } from 'immutable';
/* Common Packages */
import webpackConfig from '../../webpack.config';
import routes from '../common/routes';
import configureStore from '../common/store/configureStore';
import fetchComponentData from '../common/utils/fetchComponentData';
import apiRoutes from './controllers/api.js';
/* config */
// Initialize Express server
const app = new Express();
const port = process.env.PORT || 3000;
// Connect to database, place related files in config.database
mongoose.connect(config.database); // connect to database
app.set('env', 'production');
// Configure static file location
app.use('/static', Express.static(__dirname + '/public'));
app.use(cookieParser());
// use body parser so we can get info from POST and/or URL parameters
app.use(bodyParser.urlencoded({ extended: false })); // only can deal with key/value
app.use(bodyParser.json());
// use morgan to log requests to the console
app.use(morgan('dev'));

// the function which handles every received request, discerns how to process and acquire initialState and sends integrated server UI rendering page to front-end
const handleRender = (req, res) => {
  // Query our mock API asynchronously
  match({ routes, location: req.url }, (error, redirectLocation, renderProps) => {
    if (error) {
      res.status(500).send(error.message);
    } else if (redirectLocation) {
      res.redirect(302, redirectLocation.pathname + redirectLocation.search);
    } else if (renderProps == null) {
      res.status(404).send('Not found');
    }
    fetchComponentData(req.cookies.token).then((response) => {
      let isAuthorized = false;
      if (response[1].data.success === true) {
         isAuthorized = true;
      } else {
        isAuthorized = false;        
      }
      const initialState = fromJS({
        recipe: {
          recipes: response[0].data,
          recipe: {
            id: '',
            name: '', 
            description: '', 
            imagePath: '',            
          }  
        },
        user: {
          isAuthorized: isAuthorized,
          isEdit: false,
        }
      });
      // server side render page
      // Create a new Redux store instance
      const store = configureStore(initialState);
      const initView = renderToString(
        <Provider store={store}>
          <RouterContext {...renderProps} />
        </Provider>
      );
      let state = store.getState();
      let page = renderFullPage(initView, state);
      return res.status(200).send(page);
    })
    .catch(err => res.end(err.message));
  })
}

// Basic page HTML design
const renderFullPage = (html, preloadedState) => (`
    <!doctype html>
    <html>
      <head>
        <title>OpenCook Share recipes and good times</title>
        <!-- Latest compiled and minified CSS -->
        <link rel="stylesheet" href="//maxcdn.bootstrapcdn.com/bootstrap/latest/css/bootstrap.min.css">
        <!-- Optional theme -->
        <link rel="stylesheet" href="//maxcdn.bootstrapcdn.com/bootstrap/latest/css/bootstrap-theme.min.css">
        <link rel="stylesheet" href="//maxcdn.bootstrapcdn.com/bootswatch/3.3.7/journal/bootstrap.min.css">
      <body>
        <div id="app">${html}</div>
        <script>
          window.__PRELOADED_STATE__ = ${JSON.stringify(preloadedState).replace(/</g, '\\x3c')}
        </script>
        <script src="/static/bundle.js"></script>
      </body>
    </html>`
);

// Configure hot reload middleware
const compiler = webpack(webpackConfig);
app.use(webpackDevMiddleware(compiler, { noInfo: true, publicPath: webpackConfig.output.publicPath }));
app.use(webpackHotMiddleware(compiler));

// Design API prefix, and use controller apiRoutes to process
app.use('/api', apiRoutes);  
// Using server-side handleRender 
app.use(handleRender);
app.listen(port, (error) => {
  if (error) {
    console.error(error)
  } else {
    console.info(`==> 🌎  Listening on port ${port}. Open up http://localhost:${port}/ in your browser.`)
  }
});
```

Because Node-side needs latest version for better ES6 support, use `babel-register` in `src/server/index.js` to translate `server.js`, however this is not recommended for `production` environments.

```javascript
// use babel-register to precompile ES6 syntax
require('babel-register');
require('./server');
```

Now we design our database Schema, here we use a MongoDB ORM Mongoose, it allows for convenient object-oriented database operations:

```javascript
// Import mongoose and Schema
import mongoose, { Schema } from 'mongoose';

// Use mongoose.model to create a new directory, and import Schema
// Here we designed the essential factors for recipe sharing, including name, description, photo path etc
export default mongoose.model('Recipe', new Schema({ 
    id: String,
    name: String, 
    description: String, 
    imagePath: String,
    steps: Array,
    updatedAt: Date,
}));
```

```javascript
// Import mongoose and Schema
import mongoose, { Schema } from 'mongoose';

// Use mongoose.model to create a new table, importing Schema
// Here we designed some basic elements for users, including name, description, photo path etc
export default mongoose.model('User', new Schema({ 
    id: Number,
    username: String, 
    email: String,
    password: String, 
    admin: Boolean 
}));
```

For convenient maintenance, we placed API in `src/server/controllers/api.js`，this part will use more Node and mongoose operations, if the user is not familar please refer to [mongoose official webpage](http://mongoosejs.com/)

```javascript
import Express from 'express';
// import jsonwebtoken package
import jwt from 'jsonwebtoken';
// import User, Recipe Model for convenient database operations
import User from '../models/user';
import Recipe from '../models/recipe';
import config from '../config';

// API Route
const app = new Express();
const apiRoutes = Express.Router();
// configure secret variable for JSON Web Token
app.set('superSecret', config.secret); // secret variable
// User login API, validated with email and password, if successful returns a validation token (good for 24 hours) we save it in cookie, so it is convenient for front- and back-end to save and access. Here we will not make too many considerations for information security related topics
apiRoutes.post('/login', function(req, res) {
  // find the user
  User.findOne({
    email: req.body.email
  }, (err, user) => {
    if (err) throw err;
    if (!user) {
      res.json({ success: false, message: 'Authentication failed. User not found.' });
    } else if (user) {
      // check if password matches
      if (user.password != req.body.password) {
        res.json({ success: false, message: 'Authentication failed. Wrong password.' });
      } else {
        // if user is found and password is right
        // create a token
        const token = jwt.sign({ email: user.email }, app.get('superSecret'), {
          expiresIn: 60 * 60 * 24 // expires in 24 hours
        });
        // return the information including token as JSON
        // If successfully logged in return a json message
        res.json({
          success: true,
          message: 'Enjoy your token!',
          token: token,
          userId: user._id
        });
      }   
    }
  });
});
// Initialize api, at the start the database has not created any users, we must input `http://localhost:3000/api/setup` in our browser, to initialize our database. This action creates a new user, a recipe, and if sucessful returns a success message
apiRoutes.get('/setup', (req, res) => {
  // create a sample user
  const sampleUser = new User({ 
    username: 'mark', 
    email: 'mark@demo.com', 
    password: '123456',
    admin: true 
  });
  const sampleRecipe = new Recipe({
    id: '110ec58a-a0f2-4ac4-8393-c866d813b8d1',
    name: 'tomato stir-fried with eggs', 
    description: 'tomato stir-fried with eggs, a classic household dish. Although it looks commonplace, every family gives an unique spin to the flavour', 
    imagePath: 'https://c1.staticflickr.com/6/5011/5510599760_6668df5a8a_z.jpg',
    steps: ['add tomatoes', 'beat an egg', 'add a touch of salt', 'diligently and swiftly stir-fry'],
    updatedAt: new Date()
  });
  // save the sample user
  sampleUser.save((err) => {
    if (err) throw err;
    sampleRecipe.save((err) => {
      if (err) throw err;
      console.log('User saved successfully');
      res.json({ success: true });      
    })
  });
});
// return all recipes
apiRoutes.get('/recipes', (req, res) => {
  Recipe.find({}, (err, recipes) => {
    res.status(200).json(recipes);
  })
});

// route middleware to verify a token
// next the api will handle access control, in other words the web request must include the validation token before the request is handled
apiRoutes.use((req, res, next) => {
  // check header or url parameters or post parameters for token
  // confirm headers, url or post parameters for token, this example uses query parameter for convenience 
  var token = req.body.token || req.query.token || req.headers['x-access-token'];
  // decode token
  if (token) {
    // verifies secret and checks exp
    jwt.verify(token, app.get('superSecret'), (err, decoded) => {      
      if (err) {
        return res.json({ success: false, message: 'Failed to authenticate token.' });    
      } else {
        // if everything is good, save to request for use in other routes
        req.decoded = decoded;    
        next();
      }
    });
  } else {
    // if there is no token
    // return an error
    return res.status(403).send({ 
        success: false, 
        message: 'No token provided.' 
    });
  }
});
// confirm whether authentication succeeded
apiRoutes.get('/authenticate', (req, res) => {
  res.json({
    success: true,
    message: 'Enjoy your token!',
  });
});
// create recipe
apiRoutes.post('/recipes', (req, res) => {
  const newRecipe = new Recipe({
    name: req.body.name, 
    description: req.body.description, 
    imagePath: req.body.imagePath,
    steps: ['add tomatoes', 'beat an egg', 'add a touch of salt', 'diligently and swiftly stir-fry'],
    updatedAt: new Date()
  });
  newRecipe.save((err) => {
    if (err) throw err;
    console.log('User saved successfully');
    res.json({ success: true });      
  });
}); 
// update recipe according to _id (mongodb id)
apiRoutes.put('/recipes/:id', (req, res) => {
  Recipe.update({ _id: req.params.id }, {
    name: req.body.name, 
    description: req.body.description, 
    imagePath: req.body.imagePath,
    steps: ['add tomatoes', 'beat an egg', 'add a touch of salt', 'diligently and swiftly stir-fry'],
    updatedAt: new Date()
  } ,(err) => {
    if (err) throw err;
    console.log('User updated successfully');
    res.json({ success: true });      
  });
});
// remove recipe according to _id, if success return success message
apiRoutes.delete('/recipes/:id', (req, res) => {
  Recipe.remove({ _id: req.params.id }, (err, recipe) => {
    if (err) throw err;
    console.log('remove saved successfully');
    res.json({ success: true }); 
  });
}); 
export default apiRoutes;
```

configure the routing for the entire App, our main page has `HomePageContainer`, `LoginPageContainer`, `SharePageContainer`, worth noting that here we use [Higher Order Components](http://www.darul.io/post/2016-01-05_react-higher-order-components) (Higher Order Components is a parameter where after receiving a Component, it is returned via the render method of the Class Component) method to confirm if a user has logged in, if not logged in they cannot go to the recipe sharing webpage, on the other hand if they have already logged in, they will no longer go to the login page:

```javascript
import React from 'react';
import { Route, IndexRoute } from 'react-router';
import Main from '../components/Main';
import CheckAuth from '../components/CheckAuth';
import HomePageContainer from '../containers/HomePageContainer';
import LoginPageContainer from '../containers/LoginPageContainer';
import SharePageContainer from '../containers/SharePageContainer';

export default (
  <Route path='/' component={Main}>
    <IndexRoute component={HomePageContainer} />
    <Route path="/login" component={CheckAuth(LoginPageContainer, 'guest')}/>
    <Route path="/share" component={CheckAuth(SharePageContainer, 'auth')}/>
  </Route>
);
```

configure action constants (`src/constants/actionTypes.js`):

```javascript
export const AUTH_START    = "AUTH_START";
export const AUTH_COMPLETE = "AUTH_COMPLETE";
export const AUTH_ERROR    = "AUTH_ERROR";
export const START_LOGOUT    = "START_LOGOUT";
export const CHECK_AUTH    = "CHECK_AUTH";
export const SET_USER    = "SET_USER";
export const SHOW_SPINNER    = "SHOW_SPINNER";
export const HIDE_SPINNER    = "HIDE_SPINNER";
export const SET_UI    = "SET_UI";
export const GET_RECIPES = 'GET_RECIPES';
export const SET_RECIPE = 'SET_RECIPE';
export const ADD_RECIPE = 'ADD_RECIPE';
export const UPDATE_RECIPE = 'UPDATE_RECIPE';
export const DELETE_RECIPE = 'DELETE_RECIPE';
```

Configure `src/actions/recipeActions.js`, here we use redux-promise, allowing us to easily use the asynchronously-behaving WebAPI:

```javascript
import { createAction } from 'redux-actions';
import WebAPI from '../utils/WebAPI';

import {
  GET_RECIPES,
  ADD_RECIPE,
  UPDATE_RECIPE,
  DELETE_RECIPE,
  SET_RECIPE,
} from '../constants/actionTypes';

export const getRecipes = createAction('GET_RECIPES', WebAPI.getRecipes);
export const addRecipe = createAction('ADD_RECIPE', WebAPI.addRecipe);
export const updateRecipe = createAction('UPDATE_RECIPE', WebAPI.updateRecipe);
export const deleteRecipe = createAction('DELETE_RECIPE', WebAPI.deleteRecipe);
export const setRecipe = createAction('SET_RECIPE');
```

Configure `src/actions/uiActions.js`：

```javascript
import { createAction } from 'redux-actions';
import WebAPI from '../utils/WebAPI';

import {
  SHOW_SPINNER,
  HIDE_SPINNER,
  SET_UI,
} from '../constants/actionTypes';

export const showSpinner = createAction('SHOW_SPINNER');
export const hideSpinner = createAction('HIDE_SPINNER');
export const setUi = createAction('SET_UI');
```

Configure `src/actions/userActions.js`, handle user login and log out behaviour:

```javascript
import { createAction } from 'redux-actions';
import WebAPI from '../utils/WebAPI';

import {
  AUTH_START,
  AUTH_COMPLETE,
  AUTH_ERROR,
  START_LOGOUT,
  CHECK_AUTH,
  SET_USER
} from '../constants/actionTypes';

export const authStart = createAction('AUTH_START', WebAPI.login);
export const authComplete = createAction('AUTH_COMPLETE');
export const authError = createAction('AUTH_ERROR');
export const startLogout = createAction('START_LOGOUT', WebAPI.logout);
export const checkAuth = createAction('CHECK_AUTH');
export const setUser = createAction('SET_USER');
```

From `scr/actions/index.js` export actions:

```javascript
export * from './userActions';
export * from './recipeActions';
export * from './uiActions';
```

From `scr/common/utils/fetchComponentData.js` configure server side initial fetchComponentData:

```javascript
// here we use axios for convenient promises base requests
import axios from 'axios';
// remember to add the token we saved in cookies
export default function fetchComponentData(token = 'token') {
  const promises = [axios.get('http://localhost:3000/api/recipes'), axios.get('http://localhost:3000/api/authenticate?token=' + token)];
  return Promise.all(promises);
}
```

from `scr/common/utils/WebAPI.js` all front-end API handling:

```javascript
import axios from 'axios';
import { browserHistory } from 'react-router';
// import uuid as recipe id
import uuid from 'uuid';

import { 
  authComplete,
  authError,
  hideSpinner,
  completeLogout,
} from '../actions';

// feed key parameter into getCookie and return value
function getCookie(keyName) {
  var name = keyName + '=';
  const cookies = document.cookie.split(';');
  for(let i = 0; i < cookies.length; i++) {
      let cookie = cookies[i];
      while (cookie.charAt(0)==' ') {
          cookie = cookie.substring(1);
      }
      if (cookie.indexOf(name) == 0) {
        return cookie.substring(name.length, cookie.length);
      }
  }
  return "";
}

export default {
  // call backend login api
  login: (dispatch, email, password) => {
    axios.post('/api/login', {
      email: email,
      password: password
    })
    .then((response) => {
      if(response.data.success === false) {
        dispatch(authError()); 
        dispatch(hideSpinner());  
        alert('Something went wrong, please try again!');
        window.location.reload();        
      } else {
        if (!document.cookie.token) {
          let d = new Date();
          d.setTime(d.getTime() + (24 * 60 * 60 * 1000));
          const expires = 'expires=' + d.toUTCString();
          document.cookie = 'token=' + response.data.token + '; ' + expires;
          dispatch(authComplete());
          dispatch(hideSpinner());  
          browserHistory.push('/'); 
        }
      }
    })
    .catch(function (error) {
      dispatch(authError());
    });
  },
  // call backend logout api  
  logout: (dispatch) => {
    document.cookie = 'token=; ' + 'expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    dispatch(hideSpinner());  
    browserHistory.push('/'); 
  },
  // confirm whether user is logged in
  checkAuth: (dispatch, token) => {
    axios.post('/api/authenticate', {
      token: token,
    })
    .then((response) => {
      if(response.data.success === false) {
        dispatch(authError()); 
      } else {
        dispatch(authComplete());
      }
    })
    .catch(function (error) {
      dispatch(authError());
    });
  },
  // get all current recipes   
  getRecipes: () => {
    axios.get('/api/recipes')
    .then((response) => {
    })
    .catch((error) => {
    });
  },
  // call the recipe creation api, remember to add the token saved in our cookies
  addRecipe: (dispatch, name, description, imagePath) => {
    const id = uuid.v4();
    axios.post('/api/recipes?token=' + getCookie('token'), {
      id: id,
      name: name,
      description: description,
      imagePath: imagePath,
    })
    .then((response) => {
      if(response.data.success === false) {
        dispatch(hideSpinner());  
        alert('Something went wrong, please try again!');
        browserHistory.push('/share');         
      } else {
        dispatch(hideSpinner());  
        window.location.reload();        
        browserHistory.push('/'); 
      }
    })
    .catch(function (error) {
    });
  },
  // call update recipe remember to add the token we saved in cookies  
  updateRecipe: (dispatch, recipeId, name, description, imagePath) => {
    axios.put('/api/recipes/' + recipeId + '?token=' + getCookie('token'), {
      id: recipeId,
      name: name,
      description: description,
      imagePath: imagePath,
    })
    .then((response) => {
      if(response.data.success === false) {
        dispatch(hideSpinner());  
        dispatch(setRecipe({ key: 'recipeId', value: '' }));
        dispatch(setUi({ key: 'isEdit', value: false }));
        alert('Something went wrong, please try again!');
        browserHistory.push('/share');         
      } else {
        dispatch(hideSpinner());  
        window.location.reload();        
        browserHistory.push('/'); 
      }
    })
    .catch(function (error) {
    });
  },
  // call recipe deletion api, remember to add the token we saved in cookies  
  deleteRecipe: (dispatch, recipeId) => {
    axios.delete('/api/recipes/' + recipeId + '?token=' + getCookie('token'))
    .then((response) => {
      if(response.data.success === false) {
        dispatch(hideSpinner());  
        alert('Something went wrong, please try again!');
        browserHistory.push('/');         
      } else {
        dispatch(hideSpinner());  
        window.location.reload();        
        browserHistory.push('/'); 
      }
    })
    .catch(function (error) {
    });    
  } 
};
```

Next configure our `reducers`, below is `src/common/reducers/data/recipeReducers.js`, `GET_RECIPES` is responsible for getting all recipes from the server and placing it in `recipes`:

```javascript
import { handleActions } from 'redux-actions';
import { RecipeState } from '../../constants/models';

import {
  GET_RECIPES,
  SET_RECIPE,
} from '../../constants/actionTypes';

const recipeReducers = handleActions({
  GET_RECIPES: (state, { payload }) => (
    state.set(
      'recipes',
      payload.recipes
    )
  ),
  SET_RECIPE: (state, { payload }) => (
    state.setIn(payload.keyPath, payload.value)
  ),  
}, RecipeState);

export default recipeReducers;
```

Below is `src/common/reducers/data/userReducers.js`, responsible for confirming login related handling tasks, pay note because login is asynchronously executed, there are several stages of behaviours to handle:

```javascript
import { handleActions } from 'redux-actions';
import { UserState } from '../../constants/models';

import {
  AUTH_START,
  AUTH_COMPLETE,
  AUTH_ERROR,
  LOGOUT_START,
  SET_USER,
} from '../../constants/actionTypes';

const userReducers = handleActions({
  AUTH_START: (state) => (
    state.merge({
      isAuthorized: false,      
    })
  ),  
  AUTH_COMPLETE: (state) => (
    state.merge({
      email: '',
      password: '',
      isAuthorized: true,
    })
  ),  
  AUTH_ERROR: (state) => (
    state.merge({
      username: '',
      email: '',
      password: '',
      isAuthorized: false,
    })
  ),  
  START_LOGOUT: (state) => (
    state.merge({
      isAuthorized: false,      
    })
  ), 
  CHECK_AUTH: (state) => (
    state.set('isAuthorized', true)
  ),
  SET_USER: (state, { payload }) => (
    state.set(payload.key, payload.value)
  ),
}, UserState);

export default userReducers;

```

Below is `src/common/reducers/ui/uiReducers.js`, responsible for confirming UI State related tasks:


```javascript
import { handleActions } from 'redux-actions';
import { UiState } from '../../constants/models';

import {
  SHOW_SPINNER,
  HIDE_SPINNER,
  SET_UI,
} from '../../constants/actionTypes';

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
  SET_UI: (state, { payload }) => (
    state.set(payload.key, payload.value)
  ),    
}, UiState);

export default uiReducers;
```

At last assemble all recipes with `combineReducers` in `src/common/reducers/index.js`, pay note our entire App data flow must remain  immutable:

```javascript
import { combineReducers } from 'redux-immutable';
import ui from './ui/uiReducers';
import recipe from './data/recipeReducers';
import user from './data/userReducers';
// import routes from './routes';

const rootReducer = combineReducers({
  ui,
  recipe,
  user,
});

export default rootReducer;
```

Below is `src/common/store/configureStore.js` responsible for store configuration, this time we used middleware from `promiseMiddleware`:

```javascript
import { createStore, applyMiddleware } from 'redux';
import promiseMiddleware from 'redux-promise';
import createLogger from 'redux-logger';
import Immutable from 'immutable';
import rootReducer from '../reducers';

const initialState = Immutable.Map();

export default function configureStore(preloadedState = initialState) {
  const store = createStore(
    rootReducer,
    preloadedState,
    applyMiddleware(createLogger({ stateTransformer: state => state.toJS() }, promiseMiddleware))
  );

  return store;
}
```

After a series of efforts, we come to the decorating of View. In this App we will mainly use one AppBar for page navigation, in other words every page will have an Appbar stationed at the top, however the content will differ according to isAuthorized in UI State. Lastly we should pay note that we used React Bootstrap to establish React Component.

```javascript
import React from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { Link } from 'react-router';
import { Navbar, Nav, NavItem, NavDropdown, MenuItem } from 'react-bootstrap';

const AppBar = ({
  isAuthorized,
  onToShare,
  onLogout,
}) => (
  <Navbar>
    <Navbar.Header>
      <Navbar.Brand>
        <Link to="/">OpenCook</Link>
      </Navbar.Brand>
      <Navbar.Toggle />
    </Navbar.Header>
    <Navbar.Collapse>
      {
        isAuthorized === false ?
        (
          <Nav pullRight>
            <LinkContainer to={{ pathname: '/login' }}><NavItem eventKey={2} href="#">Login</NavItem></LinkContainer>
          </Nav>
        ) :
        (
          <Nav pullRight>
            <NavItem eventKey={1} onClick={onToShare}>Share recipe</NavItem>
            <NavItem eventKey={2} onClick={onLogout} href="#">Logout</NavItem>
          </Nav>
        )        
      }
    </Navbar.Collapse>
  </Navbar>
);

export default AppBar;
```

Below is `src/common/containers/AppBarContainer/AppBarContainer.js`:

```javascript
import React from 'react';
import { connect } from 'react-redux';
import AppBar from '../../components/AppBar';
import { browserHistory } from 'react-router';

import {
  startLogout,
  setRecipe,
  setUi,
} from '../../actions';

export default connect(
  (state) => ({
    isAuthorized: state.getIn(['user', 'isAuthorized']),
  }),
  (dispatch) => ({
    onToShare: () => {
      dispatch(setRecipe({ key: 'recipeId', value: '' }));
      dispatch(setUi({ key: 'isEdit', value: false }));
      window.location.reload();        
      browserHistory.push('/share'); 
    },
    onLogout: () => (
      dispatch(startLogout(dispatch))
    ),
  })
)(AppBar);
```

Below is `src/components/Main/Main.js`, via route mechanism we allow AppBarContainer to become the parent template for the entire App:

```javascript
import React from 'react';
import AppBarContainer from '../../containers/AppBarContainer';

const Main = (props) => (
  <div>
    <AppBarContainer />
    <div>
      {props.children}
    </div>
  </div>
);

export default Main;
```

Within the `checkAuth` Component, we used the Higher Order Components concept. Higher Order Components is a parameter where after receiving a Component it is returned from render method of Class Component thereby confirming if the user has logged in, if they are not they may not enter the recipe sharing page, on the other hand if they have logged in they will no longer enter the login page:

```javascript
import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

// High Order Component
export default function requireAuthentication(Component, type) {
  class AuthenticatedComponent extends React.Component {
    componentWillMount() {
      this.checkAuth();
    }
    componentWillReceiveProps(nextProps) {
      this.checkAuth();
    }
    checkAuth() {
      if(type === 'auth') {
        if (!this.props.isAuthorized) {
          this.props.router.push('/');
        }        
      } else {
        if (this.props.isAuthorized) {
          this.props.router.push('/');
        }                
      }
    }
    render() {
      return ( 
        <div> 
        {
          (type === 'auth') ?
          this.props.isAuthorized === true ? <Component {...this.props } /> : null
          : this.props.isAuthorized === false ? <Component {...this.props } /> : null
        } 
        </div>
      )
    }
  };
  const mapStateToProps = (state) => ({
    isAuthorized: state.getIn(['user', 'isAuthorized']),
  });
  return connect(mapStateToProps)(withRouter(AuthenticatedComponent));
}
```

We designed the presentation of each recipe as a RecipeBox, below is `src/common/components/HomePage/HomePage.js` using map method to iterate over our recipes:

```javascript
import React from 'react';
import RecipeBoxContainer from '../../containers/RecipeBoxContainer';

const HomePage = ({
  recipes
}) => (
  <div>        
  {
    recipes.map((recipe, index) => (
      <RecipeBoxContainer recipe={recipe} key={index}  />
    )).toJS()
  }
  </div>
);

export default HomePage;
```

Below is `src/common/containers/HomePageContainer/HomePageContainer.js`:


```javascript
import React from 'react';
import { connect } from 'react-redux';
import HomePage from '../../components/HomePage';

export default connect(
  (state) => ({
    recipes: state.getIn(['recipe', 'recipes']),    
  }),
  (dispatch) => ({
  })
)(HomePage);
```

In `src/common/components/LoginBox/LoginBox.js` design our LoginBox:

```javascript
import React from 'react';
import { Form, FormGroup, Button, FormControl, ControlLabel } from 'react-bootstrap';

const LoginBox = ({
  email,
  password,
  onChangeEmailInput,
  onChangePasswordInput,
  onLoginSubmit
}) => (
  <div>
    <Form horizontal>
      <FormGroup
        controlId="formBasicText"
      >
        <ControlLabel>Please input your Email</ControlLabel>
        <FormControl
          type="text"
          onChange={onChangeEmailInput}
          placeholder="Enter Email"
        />
        <FormControl.Feedback />
      </FormGroup>
      <FormGroup
        controlId="formBasicText"
      >
        <ControlLabel>Please input your password</ControlLabel>
        <FormControl
          type="password"
          onChange={onChangePasswordInput}
          placeholder="Enter Password"
        />
        <FormControl.Feedback />
      </FormGroup>
      <Button 
        onClick={onLoginSubmit} 
        bsStyle="success" 
        bsSize="large" 
        block
      >
        submit
      </Button>
    </Form>
  </div>
);

export default LoginBox;
```

Below is `src/common/containers/LoginBoxContainer/LoginBoxContainer.js`:


```javascript
import React from 'react';
import { connect } from 'react-redux';
import LoginBox from '../../components/LoginBox';

import { 
  authStart,
  showSpinner,
  setUser,
} from '../../actions';

export default connect(
  (state) => ({
    email: state.getIn(['user', 'email']),
    password: state.getIn(['user', 'password']),
  }),
  (dispatch) => ({
    onChangeEmailInput: (event) => (
      dispatch(setUser({ key: 'email', value: event.target.value }))
    ),
    onChangePasswordInput: (event) => (
      dispatch(setUser({ key: 'password', value: event.target.value }))
    ),
    onLoginSubmit: (email, password) => () => {
      dispatch(authStart(dispatch, email, password));
      dispatch(showSpinner());
    },
  }),
  (stateProps, dispatchProps, ownProps) => {
    const { email, password } = stateProps;
    const { onLoginSubmit } = dispatchProps;
    return Object.assign({}, stateProps, dispatchProps, ownProps, {
      onLoginSubmit: onLoginSubmit(email, password),
    });
  }
)(LoginBox);

```

In `src/common/components/LoginPage/LoginPage.js`, when spinnerVisible is true the spinner is displayed:


```javascript
import React from 'react';
import { Grid, Row, Col, Image } from 'react-bootstrap';
import LoginBoxContainer from '../../containers/LoginBoxContainer';

const LoginPage = ({
  spinnerVisible,
}) => (
  <div>
    <Row className="show-grid">
      <Col xs={6} xsOffset={3}>
        <LoginBoxContainer />
        { spinnerVisible === true ?
          <Image src="/static/images/loading.gif" /> :
          null
        }
      </Col>
    </Row>
  </div>
);

export default LoginPage;
```

Below is `src/common/containers/LoginPageContainer/LoginPageContainer.js`:


```
import React from 'react';
import { connect } from 'react-redux';
import LoginPage from '../../components/LoginPage';

export default connect(
  (state) => ({
    spinnerVisible: state.getIn(['ui', 'spinnerVisible']),
  }),
  (dispatch) => ({
  })
)(LoginPage);


```

Actually designing our  recipes, `src/common/components/RecipeBox`, if the user is signed in they can edit and delete recipes:

```javascript
import React from 'react';
import { Grid, Row, Col, Image, Thumbnail, Button } from 'react-bootstrap';

const RecipeBox = (props) => {
  return(
      <Col xs={6} md={4}>
        <Thumbnail src={props.recipe.get('imagePath')} alt="242x200">
          <h3>{props.recipe.get('name')}</h3>
          <p>{props.recipe.get('description')}</p>
          {
            props.isAuthorized === true ? (
            <p>
              <Button bsStyle="primary" onClick={props.onDeleteRecipe(props.recipe.get('_id'))}>Delete</Button>&nbsp;
              <Button bsStyle="default" onClick={props.onUpdateRecipe(props.recipe.get('_id'))}>Update</Button>
            </p>)
            : null            
          }
        </Thumbnail>
      </Col>
    );
}

export default RecipeBox;
```

Below is `src/common/containers/RecipeBoxContainer/RecipeBoxContainer.js`:


```javascript
import React from 'react';
import { connect } from 'react-redux';
import RecipeBox from '../../components/RecipeBox';
import { browserHistory } from 'react-router';

import {
  deleteRecipe,
  setRecipe,
  setUi
} from '../../actions';

export default connect(
  (state) => ({
    isAuthorized: state.getIn(['user', 'isAuthorized']),
    recipes: state.getIn(['recipe', 'recipes']),
  }),
  (dispatch) => ({
    onDeleteRecipe: (recipeId) => () => (
      dispatch(deleteRecipe(dispatch, recipeId))
    ),
    onUpadateRecipe: (recipes) => (recipeId) => () => {
      const recipeIndex = recipes.findIndex((_recipe) => (_recipe.get('_id') === recipeId));
      const recipe = recipeIndex !== -1 ? recipes.get(recipeIndex) : undefined;
      dispatch(setRecipe({ keyPath: ['recipe'], value: recipe }));
      dispatch(setRecipe({ keyPath: ['recipe', 'id'], value: recipeId }));
      dispatch(setUi({ key: 'isEdit', value: true }));
      browserHistory.push('/share?recipeId=' + recipeId); 
    },
  }),
  (stateProps, dispatchProps, ownProps) => {
    const { recipes } = stateProps; 
    const { onUpadateRecipe } = dispatchProps; 
    return Object.assign({}, stateProps, dispatchProps, ownProps, {
      onUpadateRecipe: onUpadateRecipe(recipes),
    });
  }
)(RecipeBox);


```


Design our recipe sharing page, here we used the same component for editing and adding a new recipe, the difference is we decide based on `isEdit` in UI State which corresponding handling method to use. In `src/common/components/ShareBox/ShareBox.js`, we allow users to edit and delete recipes after signin:


```javascript
import React from 'react';
import { Form, FormGroup, Button, FormControl, ControlLabel } from 'react-bootstrap';

const ShareBox = (props) => {
  return (<div>
    <Form horizontal>
      <FormGroup
        controlId="formBasicText"
      >
        <ControlLabel>Please input recipe name</ControlLabel>
        <FormControl
          type="text"
          placeholder="Enter text"
          defaultValue={props.name}
          onChange={props.onChangeNameInput}
        />
        <FormControl.Feedback />
      </FormGroup>
      <FormGroup
        controlId="formBasicText"
      >
        <ControlLabel>Please input recipe description</ControlLabel>
        <FormControl 
          componentClass="textarea" 
          placeholder="textarea" 
          defaultValue={props.description}          
          onChange={props.onChangeDescriptionInput}
        />
        <FormControl.Feedback />
      </FormGroup>
      <FormGroup
        controlId="formBasicText"
      >
        <ControlLabel>Please input recipe image url</ControlLabel>
        <FormControl
          type="text"
          placeholder="Enter text"
          defaultValue={props.imagePath}
          onChange={props.onChangeImageUrl}
        />
        <FormControl.Feedback />
      </FormGroup>
      <Button 
        onClick={props.onRecipeSubmit} 
        bsStyle="success" 
        bsSize="large" 
        block
      >
        submit
      </Button>
    </Form>
  </div>);
};

export default ShareBox;
```

Below is `src/common/containers/ShareBoxContainer/ShareBoxContainer.js`:


```javascript
import React from 'react';
import { connect } from 'react-redux';
import ShareBox from '../../components/ShareBox';

import { 
  addRecipe,
  updateRecipe,
  showSpinner,
  setRecipe,
} from '../../actions';

export default connect(
  (state) => ({
    recipes: state.getIn(['recipe', 'recipes']),
    recipeId: state.getIn(['recipe', 'recipe', 'id']),
    name: state.getIn(['recipe', 'recipe', 'name']),
    description: state.getIn(['recipe', 'recipe', 'description']),
    imagePath: state.getIn(['recipe', 'recipe', 'imagePath']),
    isEdit: state.getIn(['ui', 'isEdit']),
  }),
  (dispatch) => ({
    onChangeNameInput: (event) => (
      dispatch(setRecipe({ keyPath: ['recipe', 'name'], value: event.target.value }))
    ),
    onChangeDescriptionInput: (event) => (
      dispatch(setRecipe({ keyPath: ['recipe', 'description'], value: event.target.value }))
    ),
    onChangeImageUrl: (event) => (
      dispatch(setRecipe({ keyPath: ['recipe', 'imagePath'], value: event.target.value }))
    ),    
    onRecipeSubmit: (recipes, recipeId, name, description, imagePath, isEdit) => () => {
      if (isEdit === true) {
        dispatch(updateRecipe(dispatch, recipeId, name, description, imagePath));
        dispatch(showSpinner());
      } else {
        dispatch(addRecipe(dispatch, name, description, imagePath));
        dispatch(showSpinner());
      }
    },    
  }),
  (stateProps, dispatchProps, ownProps) => {
    const { recipes, recipeId, name, description, imagePath, isEdit } = stateProps;
    const { onRecipeSubmit } = dispatchProps;
    return Object.assign({}, stateProps, dispatchProps, ownProps, {
      onRecipeSubmit: onRecipeSubmit(recipes, recipeId, name, description, imagePath, isEdit),
    });
  }  
)(ShareBox);


```

Simple SharePage (`src/common/components/SharePage/SharePage.js`) Page:

```javascript
import React from 'react';
import { Grid, Row, Col } from 'react-bootstrap';
import ShareBoxContainer from '../../containers/ShareBoxContainer';

const SharePage = () => (
  <div>
    <Row className="show-grid">
      <Col xs={6} xsOffset={3}>
        <ShareBoxContainer />
      </Col>
    </Row>
  </div>
);

export default SharePage;
```

Below is `src/common/containers/SharePageContainer/SharePageContainer.js`:


```javascript
import React from 'react';
import { connect } from 'react-redux';
import SharePage from '../../components/SharePage';

export default connect(
  (state) => ({
  }),
  (dispatch) => ({
  })
)(SharePage);
```

Congrats for crossing the finish line sucessfully! If everything went well, in the terminal run `$ npm start`, and you can see the fruits of your effort in the browser at `http://localhost:3000`!

![Using React + Redux + Node (Isomorphic JavaScript) to develop a recipe-sharing website](./images/open-cook-demo-1.png "Using React + Redux + Node (Isomorphic JavaScript) to develop a recipe-sharing website")

## Summary
This article integrated all of our past learnings and added a bit of backend database knowledge to develop a community website that can sign members in and allow recipe-sharing! Hurry up and share your result with your friends! Yearning for more? Don't forget the Appendix is also very exciting! Lastly, once again many thanks to readers that have supported our path all the way to completing this React development journey! However front-end technologies change rapidly, only continuous self driven learning will sustain growth. This writer is of humble talent and shallow learning, if there are any insights while learning, missed points, suggestions or reminders I welcome everyone to tell me, let us work hard together :)

## Extended Reading
1. [joshgeller/react-redux-jwt-auth-example](https://github.com/joshgeller/react-redux-jwt-auth-example)
2. [Securing React Redux Apps With JWT Tokens](https://medium.com/@rajaraodv/securing-react-redux-apps-with-jwt-tokens-fcfe81356ea0#.5hfri5j5m)
3. [Adding Authentication to Your React Native App Using JSON Web Tokens](https://auth0.com/blog/adding-authentication-to-react-native-using-jwt/)
4. [Authentication in React Applications, Part 2: JSON Web Token (JWT)](http://vladimirponomarev.com/blog/authentication-in-react-apps-jwt)
5. [Node.js id validation: Passport primer](https://nodejust.com/nodejs-passport-auth-tutorial/)
6. [react-bootstrap compatibility #83](https://github.com/reactjs/react-router/issues/83)
7. [How to authenticate routes using Passport? #725](https://github.com/reactjs/react-router/issues/725)
8. [Isomorphic React Web App Demo with Material UI](https://github.com/tech-dojo/react-showcase)
9. [react-router/examples/auth-flow/](https://github.com/reactjs/react-router/tree/master/examples/auth-flow)
10. [redux-promise](https://github.com/acdlite/redux-promise)
11. [How to use redux-promise](http://qiita.com/takaki@github/items/42bddf01d36dc18bdc8e)
12. [Authenticate a Node.js API with JSON Web Tokens](https://scotch.io/tutorials/authenticate-a-node-js-api-with-json-web-tokens)
13. [3 JavaScript ORMs You Might Not Know](https://www.sitepoint.com/3-javascript-orms-you-might-not-know/)
14. [lynndylanhurley/redux-auth](https://github.com/lynndylanhurley/redux-auth)
15. [How to avoid getting error 'localStorage is not defined' on server in ReactJS isomorphic app?](http://stackoverflow.com/questions/33724396/how-to-avoid-getting-error-localstorage-is-not-defined-on-server-in-reactjs-is)
16. [Where to Store your JWTs – Cookies vs HTML5 Web Storage](https://stormpath.com/blog/where-to-store-your-jwts-cookies-vs-html5-web-storage)
17. [What is the difference between server side cookie and client side cookie? [closed]](http://stackoverflow.com/questions/6922145/what-is-the-difference-between-server-side-cookie-and-client-side-cookie)
18. [Cookies vs Tokens. Getting auth right with Angular.JS](https://auth0.com/blog/angularjs-authentication-with-cookies-vs-token/)
19. [Cookies vs Tokens: The Definitive Guide](https://auth0.com/blog/cookies-vs-tokens-definitive-guide/)
20. [joshgeller/react-redux-jwt-auth-example](https://github.com/joshgeller/react-redux-jwt-auth-example)
21. [Programmatically navigate using react router](http://stackoverflow.com/questions/31079081/programmatically-navigate-using-react-router)
22. [withRouter HoC (higher-order component) v2.4.0 Upgrade Guide](https://github.com/reactjs/react-router/blob/master/upgrade-guides/v2.4.0.md)

## License
MIT, Special thanks [Loading.io](http://loading.io/)

## :door: Nexus
| [Home](https://github.com/sycherng/reactjs101/tree/en-US) | [Previous article: React Redux Sever Rendering (Isomorphic JavaScript) Introduction](https://github.com/sycherng/reactjs101/blob/en-US/Ch10/react-redux-server-rendering-isomorphic-javascript.md) | [Next article: Appendix 1, React ES5, ES6+ Common Usage Reference Sheet](https://github.com/sycherng/reactjs101/tree/en-US/Appendix01) |

| [Corrections, questions or requests](https://github.com/kdchang/reactjs101/issues) |
