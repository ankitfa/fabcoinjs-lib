/* global describe, it */
const assert = require('chai').assert
const fabcoinjs = require('../src/index')

describe('API Status', function () {
  it('should return false when the API endpoint is invalid', function (done) {
    fabcoinjs.checkAPIStatus('').then(function (res) {
      assert.equal(res, false)
      done()
    })
  })
  it('should return true when the API endpoint is valid', function (done) {
    fabcoinjs.checkAPIStatus('http://fabexplorer.com').then(function (res) {
      assert.equal(res, true)
      done()
    })
  })
})

describe('KeyPair in WIF', function () {
  it('Should return the correct WIF for a given set of mnemonics and indexes', function () {
    let mn = 'zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo wrong'
    let wif = fabcoinjs.getKeyPairInWif(mn, 0, 0, 0)
    assert.equal(wif, 'KzwKTrqozQDyew9U9gh7J998YU24PXTXro2S79bWuTLym9zE7gTy')
  })
})
