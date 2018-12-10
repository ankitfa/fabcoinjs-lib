/* global describe, it, before */

const assert = require('assert')
const fabcoin = require('../../')
const regtestUtils = require('./_regtest')
const regtest = regtestUtils.network
const bip65 = require('bip65')

const alice = fabcoin.ECPair.fromWIF('cScfkGjbzzoeewVWmU2hYPUHeVGJRDdFt7WhmrVVGkxpmPP8BHWe', regtest)
const bob = fabcoin.ECPair.fromWIF('cMkopUXKWsEzAjfa1zApksGRwjVpJRB3831qM9W4gKZsLwjHXA9x', regtest)

describe('fabcoinjs-lib (transactions w/ CLTV)', function () {
  // force update MTP
  before(function (done) {
    regtestUtils.mine(11, done)
  })

  const hashType = fabcoin.Transaction.SIGHASH_ALL

  function cltvCheckSigOutput (aQ, bQ, lockTime) {
    return fabcoin.script.compile([
      fabcoin.opcodes.OP_IF,
      fabcoin.script.number.encode(lockTime),
      fabcoin.opcodes.OP_CHECKLOCKTIMEVERIFY,
      fabcoin.opcodes.OP_DROP,

      fabcoin.opcodes.OP_ELSE,
      bQ.publicKey,
      fabcoin.opcodes.OP_CHECKSIGVERIFY,
      fabcoin.opcodes.OP_ENDIF,

      aQ.publicKey,
      fabcoin.opcodes.OP_CHECKSIG
    ])
  }

  function utcNow () {
    return Math.floor(Date.now() / 1000)
  }

  // expiry past, {Alice's signature} OP_TRUE
  it('can create (and broadcast via 3PBP) a Transaction where Alice can redeem the output after the expiry (in the past)', function (done) {
    // 3 hours ago
    const lockTime = bip65.encode({ utc: utcNow() - (3600 * 3) })
    const redeemScript = cltvCheckSigOutput(alice, bob, lockTime)
    const { address } = fabcoin.payments.p2sh({ redeem: { output: redeemScript, network: regtest }, network: regtest })

    // fund the P2SH(CLTV) address
    regtestUtils.faucet(address, 1e5, function (err, unspent) {
      if (err) return done(err)

      const txb = new fabcoin.TransactionBuilder(regtest)
      txb.setLockTime(lockTime)
      txb.addInput(unspent.txId, unspent.vout, 0xfffffffe)
      txb.addOutput(regtestUtils.RANDOM_ADDRESS, 7e4)

      // {Alice's signature} OP_TRUE
      const tx = txb.buildIncomplete()
      const signatureHash = tx.hashForSignature(0, redeemScript, hashType)
      const redeemScriptSig = fabcoin.payments.p2sh({
        redeem: {
          input: fabcoin.script.compile([
            fabcoin.script.signature.encode(alice.sign(signatureHash), hashType),
            fabcoin.opcodes.OP_TRUE
          ]),
          output: redeemScript
        }
      }).input
      tx.setInputScript(0, redeemScriptSig)

      regtestUtils.broadcast(tx.toHex(), function (err) {
        if (err) return done(err)

        regtestUtils.verify({
          txId: tx.getId(),
          address: regtestUtils.RANDOM_ADDRESS,
          vout: 0,
          value: 7e4
        }, done)
      })
    })
  })

  // expiry will pass, {Alice's signature} OP_TRUE
  it('can create (and broadcast via 3PBP) a Transaction where Alice can redeem the output after the expiry (in the future)', function (done) {
    regtestUtils.height(function (err, height) {
      if (err) return done(err)

      // 5 blocks from now
      const lockTime = bip65.encode({ blocks: height + 5 })
      const redeemScript = cltvCheckSigOutput(alice, bob, lockTime)
      const { address } = fabcoin.payments.p2sh({ redeem: { output: redeemScript, network: regtest }, network: regtest })

      // fund the P2SH(CLTV) address
      regtestUtils.faucet(address, 1e5, function (err, unspent) {
        if (err) return done(err)

        const txb = new fabcoin.TransactionBuilder(regtest)
        txb.setLockTime(lockTime)
        txb.addInput(unspent.txId, unspent.vout, 0xfffffffe)
        txb.addOutput(regtestUtils.RANDOM_ADDRESS, 7e4)

        // {Alice's signature} OP_TRUE
        const tx = txb.buildIncomplete()
        const signatureHash = tx.hashForSignature(0, redeemScript, hashType)
        const redeemScriptSig = fabcoin.payments.p2sh({
          redeem: {
            input: fabcoin.script.compile([
              fabcoin.script.signature.encode(alice.sign(signatureHash), hashType),
              fabcoin.opcodes.OP_TRUE
            ]),
            output: redeemScript
          }
        }).input
        tx.setInputScript(0, redeemScriptSig)

        // TODO: test that it failures _prior_ to expiry, unfortunately, race conditions when run concurrently
        // ...
        // into the future!
        regtestUtils.mine(5, function (err) {
          if (err) return done(err)

          regtestUtils.broadcast(tx.toHex(), function (err) {
            if (err) return done(err)

            regtestUtils.verify({
              txId: tx.getId(),
              address: regtestUtils.RANDOM_ADDRESS,
              vout: 0,
              value: 7e4
            }, done)
          })
        })
      })
    })
  })

  // expiry ignored, {Bob's signature} {Alice's signature} OP_FALSE
  it('can create (and broadcast via 3PBP) a Transaction where Alice and Bob can redeem the output at any time', function (done) {
    // two hours ago
    const lockTime = bip65.encode({ utc: utcNow() - (3600 * 2) })
    const redeemScript = cltvCheckSigOutput(alice, bob, lockTime)
    const { address } = fabcoin.payments.p2sh({ redeem: { output: redeemScript, network: regtest }, network: regtest })

    // fund the P2SH(CLTV) address
    regtestUtils.faucet(address, 2e5, function (err, unspent) {
      if (err) return done(err)

      const txb = new fabcoin.TransactionBuilder(regtest)
      txb.setLockTime(lockTime)
      txb.addInput(unspent.txId, unspent.vout, 0xfffffffe)
      txb.addOutput(regtestUtils.RANDOM_ADDRESS, 8e4)

      // {Alice's signature} {Bob's signature} OP_FALSE
      const tx = txb.buildIncomplete()
      const signatureHash = tx.hashForSignature(0, redeemScript, hashType)
      const redeemScriptSig = fabcoin.payments.p2sh({
        redeem: {
          input: fabcoin.script.compile([
            fabcoin.script.signature.encode(alice.sign(signatureHash), hashType),
            fabcoin.script.signature.encode(bob.sign(signatureHash), hashType),
            fabcoin.opcodes.OP_FALSE
          ]),
          output: redeemScript
        }
      }).input
      tx.setInputScript(0, redeemScriptSig)

      regtestUtils.broadcast(tx.toHex(), function (err) {
        if (err) return done(err)

        regtestUtils.verify({
          txId: tx.getId(),
          address: regtestUtils.RANDOM_ADDRESS,
          vout: 0,
          value: 8e4
        }, done)
      })
    })
  })

  // expiry in the future, {Alice's signature} OP_TRUE
  it('can create (but fail to broadcast via 3PBP) a Transaction where Alice attempts to redeem before the expiry', function (done) {
    // two hours from now
    const lockTime = bip65.encode({ utc: utcNow() + (3600 * 2) })
    const redeemScript = cltvCheckSigOutput(alice, bob, lockTime)
    const { address } = fabcoin.payments.p2sh({ redeem: { output: redeemScript, network: regtest }, network: regtest })

    // fund the P2SH(CLTV) address
    regtestUtils.faucet(address, 2e4, function (err, unspent) {
      if (err) return done(err)

      const txb = new fabcoin.TransactionBuilder(regtest)
      txb.setLockTime(lockTime)
      txb.addInput(unspent.txId, unspent.vout, 0xfffffffe)
      txb.addOutput(regtestUtils.RANDOM_ADDRESS, 1e4)

      // {Alice's signature} OP_TRUE
      const tx = txb.buildIncomplete()
      const signatureHash = tx.hashForSignature(0, redeemScript, hashType)
      const redeemScriptSig = fabcoin.payments.p2sh({
        redeem: {
          input: fabcoin.script.compile([
            fabcoin.script.signature.encode(alice.sign(signatureHash), hashType),
            fabcoin.script.signature.encode(bob.sign(signatureHash), hashType),
            fabcoin.opcodes.OP_TRUE
          ]),
          output: redeemScript
        }
      }).input
      tx.setInputScript(0, redeemScriptSig)

      regtestUtils.broadcast(tx.toHex(), function (err) {
        assert.throws(function () {
          if (err) throw err
        }, /Error: 64: non-final/)

        done()
      })
    })
  })
})
