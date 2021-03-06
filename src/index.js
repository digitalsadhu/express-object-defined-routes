const express = require('express')
const assert = require('assert')

function validateInput (input) {
  assert.ok(Array.isArray(input), 'definition argument must be an array')
  input.forEach(defn => {
    assert.ok(typeof defn === 'object', 'definition array must only contain objects')
    assert.ok(defn.path, 'definition array objects must contain a path property')
    assert.ok(typeof defn.path === 'string', 'definition array objects path property must be a string')
    if (!defn.children) {
      assert.ok(defn.callback, 'When children are not specified, callback must be provided')
      assert.ok(defn.method, 'When children are not specified, method must be provided')
      if (defn.method) {
        assert.ok(typeof defn.method === 'string', 'If defined, method must be a string')
      }
      if (defn.middleware) {
        assert.ok(Array.isArray(defn.middleware), 'Middleware if specified must be an array of functions')
        defn.middleware.forEach(middleware => {
          assert.ok(typeof middleware === 'function', 'Middleware must be a function')
        })
      }
      assert.ok(typeof defn.callback === 'function', 'Callback must be a function')
    } else {
      assert.ok(Array.isArray(defn.children), 'Property children must be an array')
    }
  })
}

module.exports = function routerFromDefinition (definition) {
  validateInput(definition)

  const router = express.Router({mergeParams: true})
  definition.forEach(defn => {
    if (!defn.children || defn.children.length === 0) {
      let middleware = defn.middleware || []
      router[defn.method](defn.path, ...middleware, defn.callback)
    } else {
      router.use(defn.path, routerFromDefinition(defn.children))
    }
  })
  return router
}
