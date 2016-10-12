/* global describe, it */
const assert = require('assert')
const eodr = require('../src')
const express = require('express')
const request = require('supertest-as-promised')

describe('Express object defined routes', function () {
  it('basic router from definition', function () {
    const app = express()
    const definition = [
      { name: 'users', path: '/users', method: 'get', callback (req, res) { res.send('res from users') } }
    ]

    app.use(eodr(definition))

    return request(app).get('/users').expect(200).then(res => {
      assert.strictEqual(res.text, 'res from users')
    })
  })

  it('nested routers from definition with children', function () {
    const app = express()
    const definition = [
      { name: 'users',
        path: '/users',
        method: 'get',
        children: [
          { name: 'list',
            path: '/list',
            method: 'get',
            callback (req, res) { res.send('res from list') } }
        ] }
    ]

    app.use(eodr(definition))

    return request(app).get('/users/list').expect(200).then(res => {
      assert.strictEqual(res.text, 'res from list')
    })
  })

  it('nested routers from definition with multiple children', function () {
    const app = express()
    const definition = [
      { name: 'users',
        path: '/users',
        method: 'get',
        children: [
          { name: 'list',
            path: '/',
            method: 'get',
            callback (req, res) { res.send('res from list') } },
          { name: 'view',
            path: '/:user_id',
            method: 'get',
            callback (req, res) { res.send(req.params.user_id) } }
        ] }
    ]

    app.use(eodr(definition))

    return request(app).get('/users').expect(200).then(res => {
      assert.strictEqual(res.text, 'res from list')
    })
    .then(() => {
      return request(app).get('/users/213').expect(200).then(res => {
        assert.strictEqual(res.text, '213')
      })
    })
  })

  it('nested routers, complex parent path', function () {
    const app = express()
    const definition = [
      { name: 'users',
        path: '/users/:user_id',
        method: 'get',
        children: [
          { name: 'posts',
            path: '/posts',
            method: 'get',
            callback (req, res) { res.send(req.params.user_id) } }
        ] }
    ]

    app.use(eodr(definition))

    return request(app).get('/users/213/posts').expect(200).then(res => {
      assert.strictEqual(res.text, '213')
    })
  })

  it('nested routers, child attempts to specify same path as parent', function () {
    const app = express()
    const definition = [
      { name: 'users',
        path: '/users',
        method: 'get',
        callback (req, res) { res.send('parent is ignored') },
        children: [
          { name: 'posts',
            path: '/',
            method: 'get',
            callback (req, res) { res.send('child takes precedence') } }
        ] }
    ]

    app.use(eodr(definition))

    return request(app).get('/users').expect(200).then(res => {
      assert.strictEqual(res.text, 'child takes precedence')
    })
  })

  it('nested routers, with indexes', function () {
    const app = express()
    const definition = [
      { name: 'index',
        path: '/',
        method: 'get',
        callback (req, res) { res.send('parent index route') } },
      { name: 'users',
        path: '/users',
        method: 'get',
        children: [
          { name: 'index',
            path: '/',
            method: 'get',
            callback (req, res) { res.send('child index route') } },
          { name: 'posts',
            path: '/posts',
            method: 'get',
            callback (req, res) { res.send('child') } }
        ] }
    ]

    app.use(eodr(definition))

    return Promise.all([
      request(app).get('/').expect(200),
      request(app).get('/users').expect(200),
      request(app).get('/users/posts').expect(200)
    ])
    .then(res => {
      assert.strictEqual(res[0].text, 'parent index route')
      assert.strictEqual(res[1].text, 'child index route')
      assert.strictEqual(res[2].text, 'child')
    })
  })

  it('route specific middleware', function () {
    const app = express()
    let callcount = 0
    const definition = [
      { name: 'users',
        path: '/users',
        method: 'get',
        middleware: [
          function (req, res, next) { callcount++; next() },
          function (req, res, next) { callcount++; next() }
        ],
        callback (req, res) { res.send('users') } }
    ]

    app.use(eodr(definition))

    return request(app).get('/users').expect(200).then(res => {
      assert.strictEqual(callcount, 2)
      assert.strictEqual(res.text, 'users')
    })
  })

  it('definition must be an array', function () {
    const act = () => { eodr() }
    assert.throws(act, /definition argument must be an array/)
  })

  it('definition must be an array containing only objects', function () {
    const act = () => { eodr(['invalid']) }
    assert.throws(act, /definition array must only contain objects/)
  })

  it('definition array objects must contain name property', function () {
    const act = () => { eodr([{}]) }
    assert.throws(act, /definition array objects must contain a name property/)
  })

  it('definition array objects name property must be a string', function () {
    const act = () => { eodr([{name: 1}]) }
    assert.throws(act, /definition array objects name property must be a string/)
  })

  it('definition array objects must contain path property', function () {
    const act = () => { eodr([{name: 'test'}]) }
    assert.throws(act, /definition array objects must contain a path property/)
  })

  it('definition array objects path property must be a string', function () {
    const act = () => { eodr([{name: 'name', path: 1}]) }
    assert.throws(act, /definition array objects path property must be a string/)
  })

  it('definition array objects path property must be a string', function () {
    const act = () => { eodr([{name: 'name', path: 1}]) }
    assert.throws(act, /definition array objects path property must be a string/)
  })

  it('definition array objects without children property must provide a callback function', function () {
    const act = () => { eodr([{name: 'name', path: '/name'}]) }
    assert.throws(act, /When children are not specified, callback must be provided/)
  })

  it('definition array objects callback property must be a function', function () {
    const act = () => { eodr([{name: 'name', path: '/name', method: 'get', callback: 1}]) }
    assert.throws(act, /Callback must be a function/)
  })

  it('definition array objects method property must be a string', function () {
    const act = () => { eodr([{name: 'name', path: '/name', callback () {}, method: 1}]) }
    assert.throws(act, /If defined, method must be a string/)
  })
})
