/* global describe, it, before */

const assert = require('assert')
const fabcoin = require('../../')
const regtestUtils = require('./_regtest')
const regtest = regtestUtils.network
const bip68 = require('bip68')

const alice = fabcoin.ECPair.fromWIF('cScfkGjbzzoeewVWmU2hYPUHeVGJRDdFt7WhmrVVGkxpmPP8BHWe', regtest)
const bob = fabcoin.ECPair.fromWIF('cMkopUXKWsEzAjfa1zApksGRwjVpJRB3831qM9W4gKZsLwjHXA9x', regtest)

describe('fabcoinjs-lib (transactions w/ CSV)', function () {
  // force update MTP
  before(function (done) {
    regtestUtils.mine(11, done)
  })

  const hashType = fabcoin.Transaction.SIGHASH_ALL

  // IF MTP (from when confirmed) > seconds, aQ can redeem
  function csvCheckSigOutput (aQ, bQ, sequence) {
    return fabcoin.script.compile([
      fabcoin.opcodes.OP_IF,
      fabcoin.script.number.encode(sequence),
      fabcoin.opcodes.OP_CHECKSEQUENCEVERIFY,
      fabcoin.opcodes.OP_DROP,

      fabcoin.opcodes.OP_ELSE,
      bQ.publicKey,
      fabcoin.opcodes.OP_CHECKSIGVERIFY,
      fabcoin.opcodes.OP_ENDIF,

      aQ.publicKey,
      fabcoin.opcodes.OP_CHECKSIG
    ])
  }

  // expiry will pass, {Alice's signature} OP_TRUE
  it('can create (and broadcast via 3PBP) a Transaction where Alice can redeem the output after the expiry (in the future)', function (done) {
    regtestUtils.height(function (err, height) {
      if (err) return done(err)

      // 5 blocks from now
      const sequence = bip68.encode({ blocks: 5 })
      const p2sh = fabcoin.payments.p2sh({
        redeem: {
          output: csvCheckSigOutput(alice, bob, sequence)
        },
        network: regtest
      })

      // fund the P2SH(CSV) address
      regtestUtils.faucet(p2sh.address, 1e5, function (err, unspent) {
        if (err) return done(err)

        const txb = new fabcoin.TransactionBuilder(regtest)
        txb.addInput(unspent.txId, unspent.vout, sequence)
        txb.addOutput(regtestUtils.RANDOM_ADDRESS, 7e4)

        // {Alice's signature} OP_TRUE
        const tx = txb.buildIncomplete()
        const signatureHash = tx.hashForSignature(0, p2sh.redeem.output, hashType)
        const redeemScriptSig = fabcoin.payments.p2sh({
          network: regtest,
          redeem: {
            network: regtest,
            output: p2sh.redeem.output,
            input: fabcoin.script.compile([
              fabcoin.script.signature.encode(alice.sign(signatureHash), hashType),
              fabcoin.opcodes.OP_TRUE
            ])
          }
        }).input
        tx.setInputScript(0, redeemScriptSig)

        // TODO: test that it failures _prior_ to expiry, unfortunately, race conditions when run concurrently
        // ...
        // into the future!
        regtestUtils.mine(10, function (err) {
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

  // expiry in the future, {Alice's signature} OP_TRUE
  it('can create (but fail to broadcast via 3PBP) a Transaction where Alice attempts to redeem before the expiry', function (done) {
    // two hours after confirmation
    const sequence = bip68.encode({ seconds: 7168 })
    const p2sh = fabcoin.payments.p2sh({
      network: regtest,
      redeem: {
        output: csvCheckSigOutput(alice, bob, sequence)
      }
    })

    // fund the P2SH(CSV) address
    regtestUtils.faucet(p2sh.address, 2e4, function (err, unspent) {
      if (err) return done(err)

      const txb = new fabcoin.TransactionBuilder(regtest)
      txb.addInput(unspent.txId, unspent.vout, sequence)
      txb.addOutput(regtestUtils.RANDOM_ADDRESS, 1e4)

      // {Alice's signature} OP_TRUE
      const tx = txb.buildIncomplete()
      const signatureHash = tx.hashForSignature(0, p2sh.redeem.output, hashType)
      const redeemScriptSig = fabcoin.payments.p2sh({
        network: regtest,
        redeem: {
          network: regtest,
          output: p2sh.redeem.output,
          input: fabcoin.script.compile([
            fabcoin.script.signature.encode(alice.sign(signatureHash), hashType),
            fabcoin.script.signature.encode(bob.sign(signatureHash), hashType),
            fabcoin.opcodes.OP_TRUE
          ])
        }
      }).input
      tx.setInputScript(0, redeemScriptSig)

      regtestUtils.broadcast(tx.toHex(), function (err) {
        assert.throws(function () {
          if (err) throw err
        }, /Error: 64: non-BIP68-final/)

        done()
      })
    })
  })
})
