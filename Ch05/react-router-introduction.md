# Learn by Writing: React Router Introduction

![React Router directory structure](./images/react-router.jpg "Learn by Writing: React Router Introduction")

## Foreword
If you have read up to here from the start please give yourself a round of applause! After covering all the React basic training, I'm sure everyone cannot wait to use their new skills! In the following portion we will develop a more complex application and introduce to the reader how to design single page applications which are so commonly seen on the market.


## single page application
Traditional web development mainly uses the server to manage URL Routing and HTML rendering of the page, in the past every time the URL changed or the user clicked a link, the entire page had to be re-rendered from the server. But as users began to increase their demands on their user experience, many web applications began to design single page applications which do not reload pages, handles URL routing from the front-end, and if requiring communication with a backend API, usually utilizes Ajax technology. In the React development world the mainstream [react-router](https://github.com/reactjs/react-router) is the common library used for routing management.

## React Router Environment Setup

First use the below command to generate within the root directory a npm configurations file `package.json`:

```
$ npm init
```

Install related packages (including packages used in the dev environment):

```shell
$ npm install --save react react-dom react-router
```

```
$ npm install --save-dev babel-core babel-eslint babel-loader babel-preset-es2015 babel-preset-react eslint eslint-config-airbnb eslint-loader eslint-plugin-import eslint-plugin-jsx-a11y eslint-plugin-react webpack webpack-dev-server html-webpack-plugin
```

After installation we can do some design of our folder structure, first within the project root folder create `src` and `res` directories, to hold `script` and `source` static resources respectively (example: global `.css` and image files). In the `components` directory we will place all of our `components` (each component folder will use `index.js` to export components, making component imports cleaner), the remaining configuration files will be placed under our project root folder.

![React Router directory structure](./images/folder.png "React Router directory structure")

Now we will modify our development-related files.

1. Configure the Babel settings file: `.babelrc`

	```javascript
	{
		"presets": [
	  	"es2015",
	  	"react",
	 	],
		"plugins": []
	}

	```

2. Configure the ESLint settings file and rules: `.eslintrc`

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

3. Configure the Webpack settings file: `webpack.config.js`

	```javascript
	// allowing you to dynamically insert bundled .js files to .index.html
	const HtmlWebpackPlugin = require('html-webpack-plugin');

	const HTMLWebpackPluginConfig = new HtmlWebpackPlugin({
	  template: `${__dirname}/src/index.html`,
	  filename: 'index.html',
	  inject: 'body',
	});
	
	// entry is our entrypoint, output is where files go after eslint and babel loader translations
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
	  // settings for development server (cannot be used in production)
	  devServer: {
	    inline: true,
	    port: 8008,
	  },
	  plugins: [HTMLWebpackPluginConfig],
	};
	```

Awesome! This concludes our development environment setup so we can start working on our `React Router` application!

## Embarking on the journey of React Routing

HTML Markup：

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>ReactRouter</title>
  <link rel="stylesheet" type="text/css" href="../res/styles/main.css">
</head>
<body>
	<div id="app"></div>
</body>
</html>
```

Below is `webpack.config.js` entrypoint `src/index.js`, which handles `Router` and `render` components. Here we should first discuss in detail, the many `react-router` components we imported in order to use the React Router.

1. Router
`Router` is a container for Route, it does not define routing, the real routing rules are defined by `Route`.

2. Route
`Route` manages the relationship between URL and corresponding components, there can be many `Route` rules or there can be nested `Routing`. Such as in the below example every page first loads `App` component then loads the components corresponding to each URL.

3. history
`Router` has an attribute `history`, here we use `hashHistory`, using `hash`(#) changes to adjust our routing. For example: when the user visits `http://www.github.com/`, they will actually see `http://www.github.com/#/`. In the below example if instead `/about` is visited `http://localhost:8008/#/about` is shown and `App` component loads which then loads `About` component.

	- hashHistory
	used for our demo, responding based on `hash`. The benefit is ease of use, no extra configuration is required.

	- browserHistory
	suited for server side rendering, but requires configuration to prevent server handling error, we will provide more detail on this in later chapters. Pay note if using the dev server in Webpack you must add `--history-api-fallback`

	```
	$ webpack-dev-server --inline --content-base . --history-api-fallback
	```

	- createMemoryHistory
	maiinly used in server rendering, its use creates a `history` object in memory, the browser url is not altered.

	```
	const history = createMemoryHistory(location)
	```

4. path
`path` is the rule corresponding to the URL. For example: `/repos/torvalds` corresponds to the position `/repos/:name`, additionally it sends variables into the `Repos` component. Use `this.props.params.name` to access the variable. While we're on this subject, if you need to look up variable `/user?q=torvalds`, use `this.props.location.query.q` to access that variable.

5. IndexRoute
Because in the context of `/`, the App component's corresponding `this.props.children` is `undefined`, we use `IndexRoute` to address this issue. This way when URL is `/` it will correspond to the Home element. But pay note that `IndexRoute` does not have a path property.


```javascript
import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, hashHistory, IndexRoute } from 'react-router';
import App from './components/App';
import Home from './components/Home';
import Repos from './components/Repos';
import About from './components/About';
import User from './components/User';
import Contacts from './components/Contacts';

ReactDOM.render(
  <Router history={hashHistory}>
    <Route path="/" component={App}>
      <IndexRoute component={Home} />
      <Route path="/repos/:name" component={Repos} />
      <Route path="/about" component={About} />
      <Route path="/user" component={User} />
      <Route path="/contacts" component={Contacts} />
    </Route>
  </Router>,
  document.getElementById('app'));

  /* Another way to write this:
	const routes = (
	    <Route path="/" component={App}>
	      <IndexRoute component={Home} />
	      <Route path="/repos/:name" component={Repos} />
	      <Route path="/about" component={About} />
	      <Route path="/user" component={User} />
	      <Route path="/contacts" component={Contacts} />
	    </Route>
	);

	ReactDOM.render(
	  <Router routes={routes} history={hashHistory} />,
	  document.getElementById('app'));
  */
```

Because we used nested routing in `index.js`, the App component was used as a parent template for every child component, meaning before each corresponding page is loaded, App component will always be loaded first. This allows every page to have shared clickable navigation links, and at the same time the child components corresponding to the URL can be loaded via `props.children`.

1. Link
`Link` component is mainly used for linking upon clicks, it can be thought of like React's version of `<a>` anchor hyperlinks. If a corresponding css style upon clicks is desired, `activeStyle` and `activeClassName` can be used to make these configurations. Our example uses original `CSS` imports within `index.html`, Inline Styles, and externally imported `Inline Style` syntax respectively.

2. IndexLink
IndexLink is mainly used to manage `index`, pay special note when a child route is `actived`, the parent route is also `actived`. Therefore our link to return to the homepage uses `onlyActiveOnIndex` props within `<IndexLink />`to resolve this problem.

3. Redirect, IndexRedirect
Although it was not used here, if the reader needs to use links that redirect these two components may be worth investigating, the usage is similar to `Route` and `IndexRedirect`.

Below is the complete code for `src/components/App/App.js`:

```javascript
import React from 'react';
import { Link, IndexLink } from 'react-router';
import styles from './appStyles';
import NavLink from '../NavLink';

const App = (props) => (
  <div>
    <h1>React Router Tutorial</h1>
    <ul>
      <li><IndexLink to="/" activeClassName="active">Home</IndexLink></li>
      <li><Link to="/about" activeStyle={{ color: 'green' }}>About</Link></li>
      <li><Link to="/repos/react-router" activeStyle={styles.active}>Repos</Link></li>
      <li><Link to="/user" activeClassName="active">User</Link></li>
      <li><NavLink to="/contacts">Contacts</NavLink></li>
    </ul>
    <!-- We used App component as a parent template for all child components to load, therefore child elements corresponding with the URL can be loaded via children -->
    {props.children}
  </div>
);

App.propTypes = {
  children: React.PropTypes.object,
};

export default App;
```

We use Functional Components within the corresponding components to render the UI

Below is the full code for `src/components/Repos/Repos.js`:

```javascript
import React from 'react';

const Repos = (props) => (
  <div>
    <h3>Repos</h3>
    <h5>{props.params.name}</h5>
  </div>
);

Repos.propTypes = {
  params: React.PropTypes.object,
};

export default Repos;
```

For detailed code the reader can take a look at the demo folders, if any readers followed the demo to completion, `npm start` may be used in the terminal, and the result can be seen at `http://localhost:8008` in the browser, when you click on navigation links the components will switch according to their `actived` state!

![Example result](./images/example.png "Example result")

## Summary
Now we have overcome an important milestone together, learning `routing` is a very important step in using `React` to develop complex applications, in the next part together we will learn about a relatively independent unit `ImmutableJS`, but learning `ImmutableJS` can allow us to have better performance and avoid several side effects when we use `React` with `Flux/Redux`.

## Extended Reading
1. [Leveling Up With React: React Router](https://css-tricks.com/learning-react-router/)
2. [Programmatically navigate using react router](http://stackoverflow.com/questions/31079081/programmatically-navigate-using-react-router)
3. [React Router Usage Course](http://www.ruanyifeng.com/blog/2016/05/react_router.html)
4. [React Router Chinese Documentation](https://react-guide.github.io/react-router-cn/index.html)
5. [React Router Tutorial](https://github.com/reactjs/react-router-tutorial)

(iamge via [seanamarasinghe](http://seanamarasinghe.com/wp-content/uploads/2016/01/react-router-1050x360.jpg))

## Nexus
| [Home](https://github.com/sycherng/reactjs101/tree/en-US) | [Previous article: React Component Specification and Life Cycle](https://github.com/sycherng/reactjs101/blob/en-US/Ch04/react-component-life-cycle.md) | [Next article: ImmutableJS Introduction](https://github.com/sycherng/reactjs101/blob/en-US/Ch06/react-immutable-introduction.md) |

| [Corrections, questions, or requests](https://github.com/kdchang/reactjs101/issues) |
