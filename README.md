# Movie Browser

A simple UI for searching [The Movie Database](https://www.themoviedb.org).

## Overview

This project provides a means of searching for and browsing movies using the TMDB API. A simple user interface is implemented consisting of a "home" view, a "search results" view, and a "movie" view.

The project is split into various business-logic specific UI components and services, and a collection of "generic" components, services and extensible base classes, which can be thought of as a mini framework upon which the application is built.

No frameworks or UI libraries have been used, although several commonly used patterns are implemented:
- Immutable state
- Uni-direction data flow
- Reactive components
- Composable views

Rather than trying to recreate any specific framework, the above ideas and concepts have been taken as inspiration, and implemented in the most lightweight way possible to provide all functionality needed for the project while providing an extensible foundation to add more complex functionality if needed.

For example, in lieu of a rich templating language like JSX, views are composed using a "layout tree" (`./src/layout.js`), which also provides a high-level visualisation of the application view structure.

Similarly, local component state was not critical for this application, so components mostly interact directly with the top-level application state, with the option to receive a parent components "props" if needed.

## Development

This project is written in ES2015+ JavaScript, and bundled for production using Babel and Webpack. The project's `package.json` file provides various NPM scripts for the building and watching of project JavaScript and CSS.

To install all development dependencies, run `npm install` from the project root.

As a pure single page app, no server is required, although a simple [Express](https://expressjs.com/) development server is included to provide a catch-all wildcard route on `localhost:3000`. As the application implements real URLs, this is a requirement if you wish to navigate directly to particular application views and states. In production on AWS S3 however, this is achieved via a wildcard-friendly static file server.

To start the development server, run `npm start` from the project root.

All project source code is contained in the `./src` directory. Upon application build, a `./dist` directory is created housing the production assets, although this is gitignored.

To build the project, run `npm run build` from the project root.

### TMDB API Key

In order to build a working application, you will need to provide a TMDB API key. This is provided via a gitignored `config.js` file in the project root, which should export an object containing at least the following:

```js
module.exports = {
    tmdbApiKey: '<your-tmdb-api-key-here>'
}
```

## Tests

Several unit tests were written early on during development for critical generic components such as `Router.js` and `StateManager.js`. The [Mocha](https://mochajs.org/) testing framework is used with the [Chai](http://chaijs.com/) assertion library.

To run the unit tests, run `npm test` from the project root.

## Notes

- One console log has been left in (at `./src/generic/StateManager.js#L94`) to show which actions are being applied to the application state and when.

- The entire application including all generic components is 55KB minified (9KB GZipped).

- At present, the application has been built for and tested on the latest version of Chrome only. Wider browser support could be easily enabled via the addition of various polyfills and CSS autoprefixing.