const script = require('./script')
const bip39 = require('bip39')
const bip32 = require('bip32')
const opcodes = require('./fabsc-opcodes')
const networks = require('./networks')
const axios = require('axios')
const payments = require('./payments')
const ECPair = require('./ecpair')

const apiExistAddress = ':9001/fabapi/existaddress/'
/**
 *
 * @param {string} apiEndPoint A URL for connecting to the API
 * @returns returns true if the API request receives expected response, false otherwise
 */
var checkAPIStatus = async function (apiEndPoint) {
  // generate a random address
  let mn = bip39.mnemonicToSeed('')
  let ad = bip32.fromSeed(mn, networks.fabcoin).derivePath('m/44/0\'/0\'/1')
  let address = payments.p2pkh({ pubkey: ad.publicKey, network: networks.fabcoin }).address
  let res = await axios.get(apiEndPoint + apiExistAddress + address)
    .then(function (response) {
      let r = false
      if (typeof (response.data) === 'boolean') {
        r = true
      }
      return r
    })
    .catch(function (error) {
      // this means that there is something wrong with the API connection
      // console.log(error.message)
      if (error) return false
    })
  return res
}

/**
 *
 * @param {string} mnemonics
 * @param {Number} account
 * @param {Number} chainType
 * @param {Number} addressIndex
 * @returns  keypair for the given mnemonic and point in the hierarchy
 */
var getKeyPairInWif = function (mnemonics, account, chainType, addressIndex) {
  let mn = bip39.mnemonicToSeed(mnemonics)
  let ad = bip32.fromSeed(mn, networks.fabcoin).derivePath('m/44/0\'/' + Number(account).toString() + '\'/' + Number(chainType).toString() + '/' + Number(addressIndex).toString())
  return ECPair.fromWIF(ad.toWIF(), networks.fabcoin).toWIF()
}

module.exports = {
  Block: require('./block'),
  ECPair: require('./ecpair'),
  Transaction: require('./transaction'),
  TransactionBuilder: require('./transaction_builder'),
  bip39,
  bs58: require('bs58'),
  address: require('./address'),
  bip32: bip32,
  crypto: require('./crypto'),
  networks: require('./networks'),
  payments: require('./payments'),
  cryptoJS: require('crypto-js'),
  web3: require('web3-eth-abi'),
  opcodes: opcodes,
  script: script,
  checkAPIStatus,
  getKeyPairInWif
}
