<!-- TITLE/ -->

<h1>express-object-defined-routes</h1>

<!-- /TITLE -->


<!-- BADGES/ -->

<span class="badge-badge"><a href="https://mediasuite.co.nz" title="The Media Suite"><img src="https://mediasuite.co.nz/ms-badge.png" alt="The Media Suite" /></a></span>
<br class="badge-separator" />
<span class="badge-badge"><a href="https://nodei.co/npm/express-object-defined-routes"><img src="https://nodei.co/npm/express-object-defined-routes.png?downloads=true&stars=true" /></a></span>
<br class="badge-separator" />
<span class="badge-travisci"><a href="http://travis-ci.org/digitalsadhu/express-object-defined-routes" title="Check this project's build status on TravisCI"><img src="https://img.shields.io/travis/digitalsadhu/express-object-defined-routes/master.svg" alt="Travis CI Build Status" /></a></span>
<span class="badge-npmversion"><a href="https://npmjs.org/package/express-object-defined-routes" title="View this project on NPM"><img src="https://img.shields.io/npm/v/express-object-defined-routes.svg" alt="NPM version" /></a></span>
<span class="badge-npmdownloads"><a href="https://npmjs.org/package/express-object-defined-routes" title="View this project on NPM"><img src="https://img.shields.io/npm/dm/express-object-defined-routes.svg" alt="NPM downloads" /></a></span>
<span class="badge-daviddm"><a href="https://david-dm.org/digitalsadhu/express-object-defined-routes" title="View the status of this project's dependencies on DavidDM"><img src="https://img.shields.io/david/digitalsadhu/express-object-defined-routes.svg" alt="Dependency Status" /></a></span>
<span class="badge-daviddmdev"><a href="https://david-dm.org/digitalsadhu/express-object-defined-routes#info=devDependencies" title="View the status of this project's development dependencies on DavidDM"><img src="https://img.shields.io/david/dev/digitalsadhu/express-object-defined-routes.svg" alt="Dev Dependency Status" /></a></span>

<!-- /BADGES -->


<!-- DESCRIPTION/ -->

Creates express routes from a definition object

<!-- /DESCRIPTION -->


<!-- INSTALL/ -->

<h2>Install</h2>

<a href="https://npmjs.com" title="npm is a package manager for javascript"><h3>NPM</h3></a><ul>
<li>Install: <code>npm install --save express-object-defined-routes</code></li>
<li>Module: <code>require('express-object-defined-routes')</code></li></ul>

<!-- /INSTALL -->


## Usage

Takes a route definition array and creates express routes before returning a router you can mount in your express app.
For example:

Require express-object-defined-routes:
```js
const eodr = require('express-object-defined-routes')
```

Create a route definition array:
```js
const definition = [
  { path: '/',
    method: 'get',
    callback (req, res) { res.send('parent index route') } },
  { path: '/users',
    children: [
      { path: '/',
        method: 'get',
        callback (req, res) { res.send('child index route') } },
      { path: '/posts',
        method: 'get',
        middleware: [function (req, res, next) { next() }]
        callback (req, res) { res.send('child posts route') } }
    ] }
]
```

Create an express router from the definition array:
```js
const router = eodr(definition)
```

Mount the router in your express app:
```js
const app = express()
app.use(router)
app.listen(3010)
```

The definition above will produce the following routes:
- `GET /`
- `GET /users`
- `GET /users/post`

### Documentation

Understanding a route definition:
```js
[{
  // the path for the route (required)
  // this is the first parameter to an express router method
  // eg. router.get('/posts', handler)
  // see: http://expressjs.com/en/api.html#router.METHOD
  // or the mount point for child routes (when the children property is defined)
  // eg. router.use('/posts', express.Router(...))
  // see: http://expressjs.com/en/api.html#router.use
  path: '/posts',

  // http method to use for the route. get, put, post, delete etc
  // eg. router.get(...), router.put(...), router.post(...), etc.
  // see: http://expressjs.com/en/api.html#router.METHOD
  // nb. if children property (see below) is not defined, method is required.
  method: 'get',

  // Middleware to be used in route definition (optional)
  // Specified as an array of middleware functions
  // see. http://expressjs.com/en/api.html#router.METHOD
  middleware: [
    function (req, res, next) { next() },
    function (req, res, next) { next() }
  ],

  // defines the handler function that will be called if a user
  // visits the route
  // see http://expressjs.com/en/api.html#router.METHOD
  // nb. if children property (see below) is defined, callback
  // will be ignored.
  // nb. if children is not defined, callback is required.
  callback (req, res) { res.send('child') },

  // Used to specify additional child definitions. (optional)
  // nb. if defined, method, middleware and callback for the current
  // route definition will be ignored.
  children: []
}]
```

<!-- HISTORY/ -->

<h2>History</h2>

<a href="https://github.com/digitalsadhu/express-object-defined-routes/releases">Discover the release history by heading on over to the releases page.</a>

<!-- /HISTORY -->


<!-- BACKERS/ -->

<h2>Backers</h2>

<h3>Maintainers</h3>

These amazing people are maintaining this project:

<ul><li>Richard Walker digitalsadhu@gmail.com</li></ul>

<h3>Sponsors</h3>

These amazing people have contributed finances to this project:

<ul><li><a href="http://mediasuite.co.nz">The Media Suite</a></li></ul>

Become a sponsor!



<h3>Contributors</h3>

These amazing people have contributed code to this project:

<ul><li><a href="http://lovebeer.nz/">Richard Walker</a> — <a href="https://github.com/digitalsadhu/express-object-defined-routes/commits?author=digitalsadhu" title="View the GitHub contributions of Richard Walker on repository digitalsadhu/express-object-defined-routes">view contributions</a></li></ul>



<!-- /BACKERS -->


<!-- LICENSE/ -->

<h2>License</h2>

Unless stated otherwise all works are:

<ul><li>Copyright &copy; <a href="http://lovebeer.nz/">Richard Walker</a></li></ul>

and licensed under:

<ul><li><a href="http://spdx.org/licenses/MIT.html">MIT License</a></li></ul>

<!-- /LICENSE -->
