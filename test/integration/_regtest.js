const assert = require('assert')
const fabcoin = require('../../')
const dhttp = require('dhttp/200')

const APIPASS = process.env.APIPASS || 'satoshi'
const APIURL = 'https://api.dcousens.cloud/1'
const NETWORK = fabcoin.networks.testnet

function broadcast (txHex, callback) {
  dhttp({
    method: 'PUT',
    url: APIURL + '/t/push',
    body: txHex
  }, callback)
}

function mine (count, callback) {
  dhttp({
    method: 'POST',
    url: APIURL + '/r/generate?count=' + count + '&key=' + APIPASS
  }, callback)
}

function height (callback) {
  dhttp({
    method: 'GET',
    url: APIURL + '/b/best/height'
  }, callback)
}

function faucet (address, value, callback) {
  dhttp({
    method: 'POST',
    url: APIURL + '/r/faucet?address=' + address + '&value=' + value + '&key=' + APIPASS
  }, function (err, txId) {
    if (err) return callback(err)

    unspents(address, function (err, results) {
      if (err) return callback(err)

      const unspents = results.filter(x => x.txId === txId)
      if (unspents.length === 0) return callback(new Error('Missing unspent'))

      callback(null, unspents.pop())
    })
  })
}

function faucetComplex (output, value, callback) {
  const keyPair = fabcoin.ECPair.makeRandom({ network: NETWORK })
  const p2pkh = fabcoin.payments.p2pkh({ pubkey: keyPair.publicKey, network: NETWORK })

  faucet(p2pkh.address, value * 2, (err, unspent) => {
    if (err) return callback(err)

    const txvb = new fabcoin.TransactionBuilder(NETWORK)
    txvb.addInput(unspent.txId, unspent.vout, null, p2pkh.output)
    txvb.addOutput(output, value)
    txvb.sign(0, keyPair)
    const txv = txvb.build()

    broadcast(txv.toHex(), function (err) {
      if (err) return callback(err)

      return callback(null, {
        txId: txv.getId(),
        vout: 0,
        value
      })
    })
  })
}

function fetch (txId, callback) {
  dhttp({
    method: 'GET',
    url: APIURL + '/t/' + txId + '/json'
  }, callback)
}

function unspents (address, callback) {
  dhttp({
    method: 'GET',
    url: APIURL + '/a/' + address + '/unspents'
  }, callback)
}

function verify (txo, callback) {
  fetch(txo.txId, function (err, tx) {
    if (err) return callback(err)

    const txoActual = tx.outs[txo.vout]
    if (txo.address) assert.strictEqual(txoActual.address, txo.address)
    if (txo.value) assert.strictEqual(txoActual.value, txo.value)
    callback()
  })
}

function getAddress (node, network) {
  return fabcoin.payments.p2pkh({ pubkey: node.publicKey, network }).address
}

function randomAddress () {
  return getAddress(fabcoin.ECPair.makeRandom({
    network: fabcoin.networks.testnet
  }), fabcoin.networks.testnet)
}

module.exports = {
  broadcast,
  faucet,
  faucetComplex,
  fetch,
  height,
  mine,
  network: NETWORK,
  unspents,
  verify,
  randomAddress,
  RANDOM_ADDRESS: randomAddress()
}
