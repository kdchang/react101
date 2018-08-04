# React Redux Server Rendering (Isomorphic JavaScript) Introduction

![React Redux Server Rendering (Isomorphic JavaScript) Introduction](./images/isomorphic-javascript.png "React Redux Server Rendering (Isomorphic JavaScript) Introduction")

## Foreword
Because some readers may not have heard of [Isomorphic JavaScript](http://isomorphic.net/). Therefore before we begin developing a React Redux Server-side Rendering application we will first chat about the topic of Isomorphic JavaScript.

According to [Isomorphic JavaScript](http://isomorphic.net/) website's explanation:

>Isomorphic JavaScript
Isomorphic JavaScript apps are JavaScript applications that can run both client-side and server-side.
The backend and frontend share the same code. 

Isomorphic JavaScript refers to the JavaScript code that is shared between browser-side and server-side.

Additionally, in addition to Isomorphic JavaScript, readers may have also heard of the term Universal JavaScript. What is Universal JavaScript? Is it the same as Isomorphic JavaScript? Regarding this topic the developers on the web raised their own viewpoint: [Universal JavaScript](https://medium.com/@mjackson/universal-javascript-4761051b7ae9#.67xsay73m), [Isomorphism vs Universal JavaScript](https://medium.com/@ghengeveld/isomorphism-vs-universal-javascript-4b47fb481beb#.qvggcp3v8). In particular Isomorphism vs Universal JavaScript author Gert Hengeveld points out `Isomorphic JavaScript` mainly points to the development strategy of sharing JavaScript between front- and back-end, while `Universal JavaScript` refers to JavaScript code that can be executed in different environments, of course this includes browser-end and server-side, even including other environments. In other words `Universal JavaScript`'s meaning covers slightly more than `Isomorphic JavaScript`, However on Github and many technology forum discussions the two are viewed as the same, please pay note to this.

## Isomorphic JavaScript benefits
Before we start writing Isomorphic JavaScript we should take a deeper look at what the benefits of using Isomorphic JavaScript are. Before discussing the benefits, we will first take a look at how page rendering and state management was accomplished during early web development, and what challenges were encountered.

In the earliest days our conversation about the Web was very simple, everything was handled with server side templates, you can think of templates as a function, we would send data to it, the template would generate an HTML file for the browser to display. For example: ([EJS](http://ejs.co/) and [Jade](http://jade-lang.com/)) for Node, [Template](https://docs.djangoproject.com/el/1.10/ref/templates/) or substitute [Jinja](https://github.com/pallets/jinja) for Python/Django, [Smarty](http://www.smarty.net/) for PHP, [Blade](https://laravel.com/docs/5.0/templates) for [Laravel](https://laravel.com/), even [ERB](http://guides.rubyonrails.org/layouts_and_rendering.html) for Ruby on Rails. It all used the server-side to render all data and the page, the front-end processing was relatively simple.

However as front-end development veered towards using more software engineering and demanding user experience, all kinds of front-end frameworks appeared like a hundreds of flowers blooming simultaneously, for example: [Backbone.js](http://backbonejs.org/), [Ember.js](http://emberjs.com/) and [Angular.js](https://angularjs.org/) etc front-end MVC (Model-View-Controller) or MVVM (Model-View-ViewModel) frameworks, Single Page Apps which use front-end rendering of the UI thus began to gain popularity.

Aside from providing initial HTML, the back-end also provided an API Server for the front-end framework to obtain data for use in the front-end template. Complex logic was handled by ViewModel/Presenter, front-end template only processes simple scenarios like whether to display items as well as element iteration, shown in the image below:

![React Redux Server Rendering (Isomorphic JavaScript) Introduction](./images/client-mvc.png "React Redux Server Rendering (Isomorphic JavaScript) Introduction")

However although front-end rendering templates had their benefits, it also met with several problems including performance, SEO etc topics. At this time we began musing on the potential of Isomorphic JavaScript: why can't we use JavaScript or even React on both the front- and back-end?

![React Redux Server Rendering (Isomorphic JavaScript) Introduction](./images/isomorphic-api.png "React Redux Server Rendering (Isomorphic JavaScript) Introduction")

Actually, React's advantage lies in how it can very elegantly realize Server Side Rendering to achieve the effect of Isomorphic JavaScript. In `react-dom/server` there are two methods `renderToString` and `renderToStaticMarkup` which allows server-side rendering of your components. In mainly is used for Server-side convertion of a React Component to a DOM String, it can also be used to propagate props, however event handling will fail, requiring the client-side React to receive it before adding on (but pay note that the server-side and client-side checksum had to match or else errors would appear), this allows increase of rendering speed and SEO effects. `renderToString` and `renderToStaticMarkup`'s biggest difference is in `renderToStaticMarkup` adding less DOM props used internally by React, for example: `data-react-id`, thereby saving some resources.

Using `renderToString` for Server-side rendering:

```javascript
import ReactDOMServer from 'react-dom/server';

ReactDOMServer.renderToString(<HelloButton name="Mark" />);
```

Effect after rendering:

```html
<button data-reactid=".7" data-react-checksum="762752829">
  Hello, Mark
</button>
```

All said using Isomorphic JavaScript provides the below benefits:

1. Assists in SEO
2. Rendering speed is faster, performance is better
3. Discarding shoddy Template syntax and embracing Component oriented thinking, for convenience in maintenance
4. Sharing code between front- and back-end as much as possible to reduce development time

However carefully note that if using Redux with Server Side Rendering, the workflow is relatively complex, in general the workflow is as follows:
Using back-end load the initialState, because Server rendering must all be converted to string, first we "dehydrate" our state, wait until it reaches the client-side before "rehydrating", rebuilding a store to pass on to front-end React Components.

To transfer information from server-side to client-side, we need to:

1. Use the acquired initial state as a parameter to establish an all-new Redux store for every request
2. Selectively dispatch some actions
3. Get state from store
4. Send the state together to client-side

Below we will put this to practice by writing a simple React Server Side Rendering Counter application.

## Project result screenshot

![React Redux Server Rendering (Isomorphic JavaScript) Introduction](./images/react-server-rendering-demo.png "React Redux Server Rendering (Isomorphic JavaScript) Introduction")

## Environment installation and configuration
1. Install Node and NPM

2. Install needed packages

  ```
  $ npm install --save react react-dom redux react-redux react-router immutable redux-immutable redux-actions redux-thunk babel-polyfill babel-register body-parser express morgan qs
  ```

  ```
  $ npm install --save-dev babel-core babel-eslint babel-loader babel-preset-es2015 babel-preset-react babel-preset-stage-1 eslint eslint-config-airbnb eslint-loader eslint-plugin-import eslint-plugin-jsx-a11y eslint-plugin-react html-webpack-plugin webpack webpack-dev-server redux-logger
  ```

Next we first configure a development file.

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
  // Allowing you to dynamically insert bundled .js files to .index.html
  const HtmlWebpackPlugin = require('html-webpack-plugin');

  const HTMLWebpackPluginConfig = new HtmlWebpackPlugin({
    template: `${__dirname}/src/index.html`,
    filename: 'index.html',
    inject: 'body',
  });
  
  // entry is the entrypoint, output is the file location after processing by eslint and babel loader
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
    // Settings for dev server launch (cannot be used in production)
    devServer: {
      inline: true,
      port: 8008,
    },
    plugins: [HTMLWebpackPluginConfig],
  };
  ```

Awsome! This concludes our development environment settings so we can get started on writing our `React Server Side Rendering Counter` app!

First we will look at the overall project data structure, we separate the project into three main folders (`client`, `server`, and mutually used code in `common`):

![React Redux Sever Rendering (Isomorphic) Introduction](./images/react-server-rendering-folder.png "React Redux Sever Rendering (Isomorphic) Introduction")

## Putting to Practice

First we define `client`'s `index.js`:

```javascript
// Import babel-polyfill to avoid the browser not supporting some ES6 methods
import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import CounterContainer from '../common/containers/CounterContainer';
import configureStore from '../common/store/configureStore'
import { fromJS } from 'immutable';

// From server get the incoming initialState. Converting a string back to object, also known as rehydration
const initialState = window.__PRELOADED_STATE__;

// Because we use ImmutableJS, we need to convert the initialState which has undergone server-side dehydration and front-end rehydration to a ImmutableJS object, and send it to configureStore to build a store
const store = configureStore(fromJS(initialState));

// The remaining is the same as a normal React App, send store to Component via Provider
ReactDOM.render(
  <Provider store={store}>
    <CounterContainer />
  </Provider>,
  document.getElementById('app')
);

```

Because Node better supports ES6 at latest versions, we first use `babel-register` in `src/server/index.js` to extemporaneously translate `server.js`, but currently I do not recommend using this in a `production` environment.

```javascript
// use babel-register to precompile ES6 syntax
require('babel-register');
require('./server');
```

Next is our `server`-side, which is also the most important part of this example. First we use `express` to set a port to 3000 and server, and use webpack to execute `client` code. In this example we used `handleRender` to call fetchCounter() when requests come in (when visiting our page or on refresh):

```javascript
import Express from 'express';
import qs from 'qs';

import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import webpackConfig from '../webpack.config';

import React from 'react';
import { renderToString } from 'react-dom/server';
import { Provider } from 'react-redux';
import { fromJS } from 'immutable';

import configureStore from '../common/store/configureStore';
import CounterContainer from '../common/containers/CounterContainer';

import { fetchCounter } from '../common/api/counter';

const app = new Express();
const port = 3000;

function handleRender(req, res) {
  // imitating an actual asynchronous api handling scenario
  fetchCounter(apiResult => {
  // read the information provided by the api (here our api uses setTimeout to imitate an asynchronous situation), if the web address parameter has a value get the value, if not use api to provide a random value, if neither then get 0
    const params = qs.parse(req.query);
    const counter = parseInt(params.counter, 10) || apiResult || 0;
    // convert initialState to a state format compatible with immutablejs
    const initialState = fromJS({
      counterReducers: {
        count: counter,
      }
    });
    // make a redux store
    const store = configureStore(initialState);
    // use renderToString to convert component to string
    const html = renderToString(
      <Provider store={store}>
        <CounterContainer />
      </Provider>
    );
    // get the initialState from the redux store that was made
    const finalState = store.getState();
    // send HTML and initialState to client-side
    res.send(renderFullPage(html, finalState));
  })
}

// HTML Markup, at the same time stringify preloadedState and send to client-side, aka dehydration
function renderFullPage(html, preloadedState) {
  return `
    <!doctype html>
    <html>
      <head>
        <title>Redux Universal Example</title>
      </head>
      <body>
        <div id="app">${html}</div>
        <script>
          window.__PRELOADED_STATE__ = ${JSON.stringify(preloadedState).replace(/</g, '\\x3c')}
        </script>
        <script src="/static/bundle.js"></script>
      </body>
    </html>
    `
}

// use middleware and webpack to commence hot module reloading 
const compiler = webpack(webpackConfig);
app.use(webpackDevMiddleware(compiler, { noInfo: true, publicPath: webpackConfig.output.publicPath }));
app.use(webpackHotMiddleware(compiler));
// every time the server receives request call handleRender
app.use(handleRender);

// listen to server situation
app.listen(port, (error) => {
  if (error) {
    console.error(error)
  } else {
    console.info(`==> 🌎  Listening on port ${port}. Open up http://localhost:${port}/ in your browser.`)
  }
});
```

After handling our Server we will now handle our actions, the actions in this example are relatively simple, mainly behaviours to increase or decrease, below is `src/actions/counterActions.js`:

```javascript
import { createAction } from 'redux-actions';
import {
  INCREMENT_COUNT,
  DECREMENT_COUNT,
} from '../constants/actionTypes';

export const incrementCount = createAction(INCREMENT_COUNT);
export const decrementCount = createAction(DECREMENT_COUNT);
```

Below is `src/constants/actionTypes.js` which exports constants:

```javascript
export const INCREMENT_COUNT = 'INCREMENT_COUNT';  
export const DECREMENT_COUNT = 'DECREMENT_COUNT';  
```

In this example we used `setTimeout()` to imitate an asynchrously generated information allowing server to read a randomly generated value every time a request is received. In practice, we would open our API to allow Server to get the initialSTate.

```javascript
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min
}

export function fetchCounter(callback) {
  setTimeout(() => {
    callback(getRandomInt(1, 100))
  }, 500)
}
```

After discussing actions we should look at our reducers, the reducers in this example is also relatively simple, mainly they target the increase and decrease behaviours to set a value, below is `src/reducers/counterReducers.js`:

```javascript
import { fromJS } from 'immutable';
import { handleActions } from 'redux-actions';
import { CounterState } from '../constants/models';

import {
  INCREMENT_COUNT,
  DECREMENT_COUNT,
} from '../constants/actionTypes';

const counterReducers = handleActions({
  INCREMENT_COUNT: (state) => (
    state.set(
      'count',
      state.get('count') + 1
    )
  ),
  DECREMENT_COUNT: (state) => (
    state.set(
      'count',
      state.get('count') - 1
    )
  ),
}, CounterState);

export default counterReducers;
```

Onec we have prepared `rootReducer` we can use `createStore` to create our store, worth noting that because `configureStore` needs to be used by both client-side and server-side, we export it as a function so it is convenient to import to initialState. Below is `src/store/configureStore.js`:

```javascript
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import createLogger from 'redux-logger';
import rootReducer from '../reducers';

export default function configureStore(preloadedState) {
  const store = createStore(
    rootReducer,
    preloadedState,
    applyMiddleware(createLogger({ stateTransformer: state => state.toJS() }), thunk)
  )
  return store
}
```

Finally it is time for `components` and `containers`, this time our Component chiefly has two buttons allowing users to increase or decrease numbers and display the current number. Below is `src/components/Counter/Counter.js`:

```javascript
import React, { Component, PropTypes } from 'react'

const Counter = ({
  count,
  onIncrement,
  onDecrement,
}) => (
  <p>
    Clicked: {count} times
    {' '}
    <button onClick={onIncrement}>
      +
    </button>
    {' '}
    <button onClick={onDecrement}>
      -
    </button>
    {' '}
  </p>
);

// Pay note to check propTypes and provide default values
Counter.propTypes = {
  count: PropTypes.number.isRequired,
  onIncrement: PropTypes.func.isRequired,
  onDecrement: PropTypes.func.isRequired
}

Counter.defaultProps = {
  count: 0,
  onIncrement: () => {},
  onDecrement: () => {}
}

export default Counter;
```

Finally use connect to send the extracted `count` and event handler to `Counter` and our work is done! Below is  `src/containers/CounterContainer/CounterContainer.js`:

```javascript
import 'babel-polyfill';
import { connect } from 'react-redux';
import Counter from '../../components/Counter';

import {
  incrementCount,
  decrementCount,
} from '../../actions';

export default connect(
  (state) => ({
    count: state.get('counterReducers').get('count'),
  }),
  (dispatch) => ({ 
    onIncrement: () => (
      dispatch(incrementCount())
    ),
    onDecrement: () => (
      dispatch(decrementCount())
    ),
  })
)(Counter);
```

If everything was successful, enter `$ npm start` in the terminal, and at `http://localhost:3000` you can see your results! 

![React Redux Sever Rendering (Isomorphic) Introduction](./images/react-server-rendering-demo.png "React Redux Sever Rendering (Isomorphic) Introduction")

## Summary
This article expounded on the advancements of Webpage browsing and the advantages of Isomorphic JavaScript, as well as introduced how to use React Redux to make an app that uses Server Side Rendering. In the next article we integrate a back-end database, using React + Redux + Node (Isomorphic) to develop a simple recipe-sharing website.

## Extended Reading
1. [DavidWells/isomorphic-react-example](https://github.com/DavidWells/isomorphic-react-example)
2. [RickWong/react-isomorphic-starterkit](https://github.com/RickWong/react-isomorphic-starterkit)
3. [Server-rendered React components in Rails](https://www.bensmithett.com/server-rendered-react-components-in-rails/)
4. [Our First Node.js App: Backbone on the Client and Server](http://nerds.airbnb.com/weve-launched-our-first-nodejs-app-to-product/)
5. [Going Isomorphic with React](https://bensmithett.github.io/going-isomorphic-with-react/#/)
6. [A service for server-side rendering your JavaScript views](https://github.com/airbnb/hypernova)
7. [Isomorphic JavaScript: The Future of Web Apps](http://nerds.airbnb.com/isomorphic-javascript-future-web-apps/)
8. [React Router Server Rendering](https://github.com/reactjs/react-router-tutorial/tree/master/lessons/13-server-rendering)

(image via [airbnb](http://nerds.airbnb.com/wp-content/uploads/2013/11/Screen-Shot-2013-11-06-at-5.21.00-PM.png))

## :door: Nexus
| [Home](https://github.com/sycherng/reactjs101/tree/en-US) | [Previous article: Using React + Router + Redux + ImmutableJS to write a Github search app](https://github.com/sycherng/reactjs101/blob/en-US/Ch09/react-router-redux-github-finder.md) | [Next article: Using React + Redux + Node (Isomorphic JavaScript) to develop a recipe-sharing website](https://github.com/sycherng/reactjs101/blob/en-US/Ch10/react-router-redux-node-isomorphic-javascript-open-cook.md) |

| [Corrections, questions or requests](https://github.com/kdchang/reactjs101/issues) |
