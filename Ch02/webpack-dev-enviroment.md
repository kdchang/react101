# React Development Environment Settings and Introduction to Webpack

![React Development Environment Settings and Introduction to Webpack](./images/react-webpack-browserify.png "React Development Environment Settings and Introduction to Webpack")

## Foreword
As the proverb goes: "to do great work, one must have sharp tools". Writing programs is much the same, by properly establishing the development environment, we pave our way for a smoother development process. Therefore this chapter will discuss the two main setups for React development environments: CDN-based and [webpack](https://webpack.github.io/) (here we will omit the discussion on [TypeScript](https://www.typescriptlang.org/) development workflow). As for the method of pairing [browserify](https://webpack.github.io/) with [Gulp](http://gulpjs.com/), this will be included in the supplemental section, allowing readers to begin their React development journey after reading this article!

## JavaScript modularization

As website development becomes increasingly complex, many modern websites are no longer simply websites, but rather Web Apps with great interactive potential. In order to meet the demand in modern web app development, as well as provide solutions that guard against global namespace pollution and low maintainability issues, Javascript modularization has made significant progress. A while ago readers may have heard of things like `Webpack`, `Broswerify`, `module bundlers`, `AMD`, `CommonJS`, `UMD`, `ES6 Module` etc tools and terms related to Javascript modularized development, in our previous chapter we also briefly touched on the basic concept and scope of Javascript modularization. If the reader is still lacking clarity with regard to this topic, I recommend reading [this article](http://huangxuan.me/2015/07/09/js-module-7day/) as well as [this article](https://medium.freecodecamp.com/javascript-modules-a-beginner-s-guide-783f7d7a5fcc#.oa2n5s5zt) as primer.

All said, using modularized Javascript applications mainly provides 3 benefits:

1. Maintainability
2. Namespacing
3. Reusability

Using `module bundlers` such as `Webpack` is highly recommended to assist in organizing our applications during React app development, but for many readers `Webpack`'s comprehensive features come with proportional complexity. In order to allow readers to grasp the core concepts for `React` (we assume readers already have experienced using `Javascript` or `jQuery` at a basic level), we will use `CDN` and `<script>` imports to start our introduction.


![React Development Environment Settings and Introduction to Webpack](./images/react.png "React Development Environment Settings and Introduction to Webpack")
The downside to using CDN-based development strategy is that it makes for lowered maintainability (on import the library will have a lot of `<script/>` tags), so it is not well suited for developing large-scale applications, but because it is easy to understand, it will serve us well for educational purposes.


Below is React's [official demo](https://facebook.github.io/react/index.html), using `React v15.2.1`:

1. Understand `React` relies on `Component`s to guide application design
2. Import `react.js`, `react-dom.js` (in versions from react 0.14 onwards, the react-dom has been separated from react core, in keeping with React's stance on cross-platform abstractification) and the `babel-standalone` version script (you can think of `babel` as a translating machine, translating `JSX` or `ES6+` syntax which the browser cannot understand to `JavaScript`, which the browser can understand). In order to increase performance, usually we will do the translation on the server-side, this point is especially important in production environments)
3. Within the `<body>` we will write the mounting point for our React Component(s): `<div id="example"></div>`
4. Through `babel` we achieve translation of `React JSX` syntax, `babel` converts it to browser-readable `JavaScript`. This means: `ReactDOM.render(the desired mounting point of the Component or HTML element)`. So that when we open our `hello.html` in the browser, we can see `Hello, world!`. That's it, we've completed our first `React` application!

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Hello React!</title>
    <!-- Below we import react.js, react-dom.js (react 0.14 onwards separated react-dom from react core, in keeping with React's stance on cross-platform abstractification), as well as the browser version for babel-core -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/react/15.2.1/react.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/react/15.2.1/react-dom.min.js"></script>
	<script src="https://cdnjs.cloudflare.com/ajax/libs/babel-standalone/6.18.1/babel.min.js"></script>
  </head>
  <body>
    <!-- here the id="example" <div> is where we will insert our React Component -->
    <div id="example"></div>
    <!-- below is React JSX syntax wrapped in babel (through which language translation occurs), babel will convert it to browser-readable JavaScript -->
    <script type="text/babel">
      ReactDOM.render(
        <h1>Hello, world!</h1>,
        document.getElementById('example')
      );
    </script>
  </body>
</html>
```

The end result within the browser：

![React Development Environment Settings and Introduction to Webpack](./images/hello-world.png "React Development Environment Settings and Introduction to Webpack")

## Webpack
![React Development Environment Settings and Introduction to Webpack](./images/webpack-module-bundler.png "React Development Environment Settings and Introduction to Webpack")

Above we provided a simple introduction to the CDN-based development strategy to allow everyone to have a basic impression of React, but the CDN-based development strategy has quite a few shortcomings. Below we use Webpack, which will be the main development tool used in coming demos.

[Webpack](https://webpack.github.io/) is a module bundler, below are the main features of Webpack:

- bundle CSS, images, and other resources
- prior to bundling, process (Less, CoffeeScript, JSX, ES6, etc) files
- based on different entry files, split the .js into more .js files
- a rich collection of varying Loaders for use (Webpack by itself can only process JavaScript modules, the other filetypes such as: CSS, Images requires different Loaders to process)

Now we will use a simple Hello World example to demonstrate how to configure Webpack settings and our React development environment:

1. Install [Node](https://nodejs.org/en/) and [NPM](https://www.npmjs.com/) according to your OS (Current versions of Node always come with NPM)

2. Using NPM, install Webpack (you can install with global flag or local to your project, here we will be using local), webpack loader, webpack-dev-server

	The loaders in Webpack are similar to the transforms in browserify, but in Webpack there are more diverse uses, beyond JavaScript loader there is also CSS Style and image loader. Additionally, `webpack-dev-server` allows us to start servers, allowing for convenient testing.

	```
	// this initializes NPM's project settings file package.json
	$ npm init 
	// --save-dev allows you to save the package name and version information in package.json, for convenient use at a later time
	$ npm install --save-dev babel-core babel-eslint babel-loader babel-preset-es2015 babel-preset-react html-webpack-plugin webpack webpack-dev-server
	```

3. In the root directory configurate `webpack.config.js`

	As a matter of fact, `webpack.config.js` is somewhat akin to `gulpfile.js` in `gulp` in functionality, it mainly configures settings for `webpack`

	```javascript
	// Here we use HtmlWebpackPlugin, injecting the bundled <script> to our body. ${__dirname} is ES6 syntax for __dirname  
	const HtmlWebpackPlugin = require('html-webpack-plugin');

	const HTMLWebpackPluginConfig = new HtmlWebpackPlugin({
	  template: `${__dirname}/app/index.html`,
	  filename: 'index.html',
	  inject: 'body',
	});
	
	module.exports = {
	  // the file starts from the entrypoint specified by entry, because it is an array there can be many files
	  entry: [
	    './app/index.js',
	  ],
	  // output is for specifying variables related to our result
	  output: {
	    path: `${__dirname}/dist`,
	    filename: 'index_bundle.js',
	  },
	  module: {
	  	// loaders is where we specify the loaders we will need, here we use babel-loader to convert all .js (here we used regex) files (excluding packages installed by npm in node_modules) to browser-readable JavaScript. preset is where we specify the babel translation rules to use, here we use react and es2015. If only using .babelrc for presets configuration, query can be omitted
	    loaders: [
	      {
	        test: /\.js$/,
	        exclude: /node_modules/,
	        loader: 'babel-loader',
	        query: {
	          presets: ['es2015', 'react'],
	        },
	      },
	    ],
	  },
	  // devServer is the settings of webpack-dev-server
	  devServer: {
	    inline: true,
	    port: 8008,
	  },
	  // plugins is where we place all plugins
	  plugins: [HTMLWebpackPluginConfig],
	};
	```

4. in the root directory, configure `.babelrc`

	```javascript 
	{
	  "presets": [
	    "es2015",
	    "react",
	  ],
	  "plugins": []
	}
	```

5. install react and react-dom

	```
	$ npm install --save react react-dom
	```

6. Write our Component (remember to put `index.html` and `index.js` in an `app` folder!）
	`index.html`

	```html 
	<!DOCTYPE html>
	<html lang="en">
	<head>
		<meta charset="UTF-8">
		<title>React Setup</title>
		<link rel="stylesheet" type="text/css" href="//maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css">
	</head>
	<body>
		<!-- Where we wish to insert our React Component -->
		<div id="app"></div>
	</body>
	</html>
	```

	`index.js`

	```js 
	import React from 'react';
	import ReactDOM from 'react-dom';

	class App extends React.Component {
	  constructor(props) {
	    super(props);
	    this.state = {
	    };
	  }
	  render() {
	    return (
	      <div>
	        <h1>Hello, World!</h1>
	      </div>
	    );
	  }
	}

	ReactDOM.render(<App />, document.getElementById('app'));
	```

7. In the terminal use `webpack` to display results, webpack-related commands:

	- webpack: starts a once-only build in development mode
	- webpack -p: builds production code
	- webpack --watch: watches changes in code, when changes are saved it will update the file
	- webpack -d: adds source maps file
	- webpack --progress --colors: adds progress bar and colors

	to avoid entering a long string of commands every time, you can edit `package.json`'s `scripts` setting

	```javascript 
	"scripts": {
	  "dev": "webpack-dev-server --devtool eval --progress --colors --content-base build"
	}
	```

	and in the terminal run:

	```
	$ npm run dev
	```

Now we can open our browser at address `http://localhost:8008`, where we can see `Hello, world!`!

## Summary
Above is our React Development Environment Settings and Introduction to Webpack, readers who have reached this point may as well get hands-on and configure their own development environment, in doing so experiencing the feeling of the React development environment, because after all if you only read the guide it is very easy to forget! If you don't want to spend too much time configuring your environment, check out the solution developed by Facebook's developer community, [create-react-app](https://github.com/facebookincubator/create-react-app), it is a quickstart tool for React apps that uses Webpack, [Babel](https://babeljs.io/), and [ESLint](http://eslint.org/). In the next chapter we will expand on our introduction to React/JSX/Component.

## Extended Reading
1. [JavaScript Modularization 7-day Discussion](http://huangxuan.me/2015/07/09/js-module-7day/)
2. [The history of front-end modularized development](https://github.com/seajs/seajs/issues/588)
3. [Webpack Chinese Handbook](http://zhaoda.net/webpack-handbook/index.html)
4. [WEBPACK DEV SERVER](http://webpack.github.io/docs/webpack-dev-server.html)

(image via [srinisoundar](https://cdn-images-1.medium.com/max/477/1*qhI4E_g3TDOK0uu1VAJlCQ.png), [sitepoint](https://d2sis3lil8ndrq.cloudfront.net/screencasts/46e215cd-2eb3-4cf0-b699-713977a2b644.png), [keyholesoftware](https://keyholesoftware.com/wp-content/uploads/Browserify-5.png), [survivejs](http://survivejs.com/webpack/images/webpack.png))

## :door: Nexus
| [Home](https://github.com/sycherng/reactjs101/tree/en-US) | [Previous article: React Ecosystem Introduction](https://github.com/sycherng/reactjs101/blob/en-US/Ch01/react-ecosystem-introduction.md) | [Next article: ReactJS and Component Design Introduction](https://github.com/sycherng/reactjs101/blob/en-US/Ch03/reactjs-introduction.md) |

| [Corrections, questions, or requests](https://github.com/kdchang/reactjs101/issues) |
