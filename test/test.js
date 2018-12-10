/* global describe, it */
const assert = require('chai').assert
const idx = require('../src/index')

describe('API Status', function () {
  it('should return false when the API endpoint is invalid', function (done) {
    idx.checkAPIStatus('').then(function (res) {
      assert.equal(res, false)
      done()
    })
  })
  it('should return true when the API endpoint is valid', function (done) {
    idx.checkAPIStatus('http://fabexplorer.com').then(function (res) {
      assert.equal(res, true)
      done()
    })
  })
})
