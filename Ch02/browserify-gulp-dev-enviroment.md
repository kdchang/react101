# Browserify + Gulp + Babelify

![Grasp On First Glance React Development Environment Settings and Introduction to Webpack](./images/react-browserify-gulp.png "Grasp On First Glance React Development Environment Settings and Introduction to Webpack")

Before we commence the second method, we will first introduce: [Browserify](http://browserify.org/), [Gulp](http://gulpjs.com/), [Babelify](https://github.com/babel/babelify) three common front-end development tools.

[Browserify](http://browserify.org/)
- As explained on the official page: `Browserify lets you require('modules') in the browser by bundling up all of your dependencies.`，Browserify allows you to use the same [CommonJS](https://en.wikipedia.org/wiki/CommonJS) specification that Node uses, in the browser, using `export` and `require` for package management. Additionally, it allows the front-end use of many npm packages.

[Gulp](http://gulpjs.com/)
- `Gulp` is a front-end Task Runner. As front-end engineering progresses, many tasks required in front-end development is repetitive. For example: package bundling, uglifying, transpiling LESS to a regular CSS file, preprocessing ES6 syntax, etc. If it was done manually, productivity would be greatly diminished, so using tools like [Grunt](http://gruntjs.com/), task runners like Gulp can not only increase productivity, but also make managing repetitive tasks more convenient. Because Gulp processes files with a pipeline, it feels significantly more intuitive than Grunt, therefore we will mainly discuss Gulp in this book.

[Babelify](https://github.com/babel/babelify)
- `Babelify` is a Babel plugin for Browserify, You can think of it as a translating machine, converting JSX or ES6+ syntax used in React which the browser cannot understand, to browser-compatible ES5 syntax.

With our preliminary understanding of the concept behind these 3 tools, we will now begin our environment set-up: 
1. If you have not already installed [Node](https://zh.wikipedia.org/zh-tw/Node.js)(Node.js is an open-source, cross-platform environment that allows server-side use of the Google V8 browser engine) and NPM (Node Package Manager). This is a package manager written in Javascript written for Node, with default environment set to Node.js, starting from Node.js v0.6.3, npm is automatically included in the package), please first go to [Node's official website for installation](https://nodejs.org/en/).

2. Use `npm` to install `browserify`

3. Use `npm` to install `gulp`, `gulp-concat`, `gulp-html-replace`, `gulp-streamify`, `gulp-uglify`, `watchify`, `vinyl-source-stream` development dependencies

	```
	// Using npm install --save-dev will save package names and versions in package.json's devDependencies section
	$ npm install --save-dev gulp gulp-concat gulp-html-replace gulp-streamify gulp-uglify watchify vinyl-source-stream  
	```

3. Install `babelify`, `babel-preset-es2015`, `babel-preset-react`, which are development environment plugins to convert `ES6` and `JSX` , and within root directory configurate `.babelrc`, set translation rules to (presets：es2015、react) and allow other plugins

	```
	// Using npm install --save-dev will save package names and versions in package.json's devDependencies section
	$ npm install --save-dev babelify babel-preset-es2015 babel-preset-react
	```

	```js
    // filename: .babelrc
	{
		"presets": [
		  "es2015",
		  "react",
		],
		"plugins": []
	}
	```

4. Install react and react-dom

	```
	$ npm install --save react react-dom
	```

6. Write our Component

	```js
    // filename: ./app/index.js
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

	```html
    <!-- filename: ./index.html -->
	<!DOCTYPE html>
	<html lang="en">
	<head>
		<meta charset="UTF-8">
		<title>Hello React!</title>
	</head>
	<body>
		<div id="app"></div>
		<!-- build:js -->
		<script src="./dist/src/bundle.js"></script>
		<!-- endbuild -->
	</body>
	</html>
	```

7. Configure `gulpfile.js`

	```js
    // filename: gulpfile.js
	// import desired files
	const gulp = require('gulp');
	const uglify = require('gulp-uglify');
	const htmlreplace = require('gulp-html-replace');
	const source = require('vinyl-source-stream');
	const browserify = require('browserify');
	const watchify = require('watchify');
	const babel = require('babelify');
	const streamify = require('gulp-streamify');
	// file path variables
	const path = {
	  HTML: 'index.html',
	  MINIFIED_OUT: 'bundle.min.js',
	  OUT: 'bundle.js',
	  DEST: 'dist',
	  DEST_BUILD: 'dist/build',
	  DEST_SRC: 'dist/src',
	  ENTRY_POINT: './app/index.js'
	};
	// copy html to dist directory
	gulp.task('copy', function(){
	  gulp.src(path.HTML)
	    .pipe(gulp.dest(path.DEST));
	});
	// watch for file changes, if any, redo translation
	gulp.task('watch', function() {
	  gulp.watch(path.HTML, ['copy']);
	var watcher  = watchify(browserify({
	    entries: [path.ENTRY_POINT],
	    transform: [babel],
	    debug: true,
	  }));
	return watcher.on('update', function () {
	    watcher.bundle()
	      .pipe(source(path.OUT))
	      .pipe(gulp.dest(path.DEST_SRC))
	      console.log('Updated');
	  })
	    .bundle()
	    .pipe(source(path.OUT))
	    .pipe(gulp.dest(path.DEST_SRC));
	});
	// execute production building process (including uglify, transpile tasks etc)
	gulp.task('copy', function(){
	  browserify({
	    entries: [path.ENTRY_POINT],
	    transform: [babel],
	  })
	    .bundle()
	    .pipe(source(path.MINIFIED_OUT))
	    .pipe(streamify(uglify(path.MINIFIED_OUT)))
	    .pipe(gulp.dest(path.DEST_BUILD));
	});
	// have script import files for production
	gulp.task('replaceHTML', function(){
	  gulp.src(path.HTML)
	    .pipe(htmlreplace({
	      'js': 'build/' + path.MINIFIED_OUT
	    }))
	    .pipe(gulp.dest(path.DEST));
	});
	// set NODE_ENV to production
	gulp.task('apply-prod-environment', function() {
	    process.env.NODE_ENV = 'production';
	});

	// if gulp is executed, execute gulp default tasks: watch and copy. If gulp production is executed, instead execute build, replaceHTML, and apply-prod-environment
	gulp.task('production', ['build', 'replaceHTML', 'apply-prod-environment']);
	gulp.task('default', ['watch', 'copy']);
	```

8. Results
	At this point our project structure should look like:

	![Grasp On First Glance React Development Environment Settings and Introduction to Webpack](./images/browserify-folder-pregulp.png "Grasp On First Glance React Development Environment Settings and Introduction to Webpack")

	Now in the terminal run the `gulp` command to execute our predefined tasks:

	```
	// When gulp is entered without a task name, gulp automatically executes its default tasks, here we will achieve our `watch` and `copy` tasks, the former will watch `./app/index.js` for any changes, if any it will update. The latter will copy `index.html` to `./dist/index.html`
	$ gulp
	```

	On completion of `gulp` execution, we will discover a new `dist` folder

	![Grasp On First Glance React Development Environment Settings and Introduction to Webpack](./images/browserify-folder-possgulp.png "Grasp On First Glance React Development Environment Settings and Introduction to Webpack")

	If we wanted to develop an app for `production`, we can execute: 

	```
	// When gulp production is used, gulp begins tasks assigned to production, here we achieve execution of `replaceHTML`, `build` and `apply-prod-environment` tasks, `build` task will transpile and `uglify`. `replaceHTML` replaces the annotated `<script>` import files within `index.html` with the compressed and `uglify`-processed `./dist/build/bundle.min.js`. `apply-prod-environment` modifies `NODE_ENV` variable, setting environment to `production`, interested readers can reference [React Offical Reference](https://facebook.github.io/react/downloads.html).
	$ gulp production
	```

	when we open our `./dist/hello.html` in the browser, we can see `Hello, world!`!

(image via [srinisoundar](https://cdn-images-1.medium.com/max/477/1*qhI4E_g3TDOK0uu1VAJlCQ.png), [sitepoint](https://d2sis3lil8ndrq.cloudfront.net/screencasts/46e215cd-2eb3-4cf0-b699-713977a2b644.png), [keyholesoftware](https://keyholesoftware.com/wp-content/uploads/Browserify-5.png), [survivejs](http://survivejs.com/webpack/images/webpack.png))

## :door: Nexus
| [Home](https://github.com/sycherng/reactjs101/tree/en-US) | 

| [Corrections, questions, or requests](https://github.com/kdchang/reactjs101/issues) |
