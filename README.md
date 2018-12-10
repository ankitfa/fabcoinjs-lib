# FabcoinJS (fabcoinjs-lib)

This is a Javascript library for node.js and browsers to develop applications on top of FAB Blockchain. This library is based on bitcoinjs library combined with other helper libraries.

Released under the terms of the [MIT LICENSE](LICENSE).


## Installation
``` bash
npm install fabcoinjs
```

## Can I trust this code?
> Don't trust. Verify.

We recommend every user of this library and the [fabcoinjs](https://github.com/ankitfa/fabcoinjs-lib) ecosystem audit and verify any underlying code for its validity and suitability.

Mistakes and bugs happen, but with your help in resolving and reporting [issues](https://github.com/ankitfa/fabcoinjs-lib/issues), together we can produce open source software that is:

- Easy to audit and verify,
- Tested, with test coverage >95%,
- Advanced and feature rich,
- Standardized, using [standard](http://github.com/standard/standard) and Node `Buffer`'s throughout, and
- Friendly, with a strong and helpful community, ready to answer questions.

## Documentation
Presently,  we do not have any formal documentation other than our [examples](#examples), please [ask for help](https://github.com/ankitfa/fabcoinjs-lib/issues/new) if our examples aren't enough to guide you.

**WARNING**: We presently don't provide any tooling to verify that the release on `npm` matches GitHub.  As such, you should verify anything downloaded by `npm` against your own verified copy.


## Examples
The below examples are implemented as integration tests, they should be very easy to understand.
Otherwise, pull requests are appreciated.
Some examples interact (via HTTPS) with a 3rd Party Blockchain Provider (3PBP).

- [Generate a random address](https://github.com/ankitfa/fabcoinjs-lib/tree/master/test/integration/addresses.js#L22)
- [Generate an address from a SHA256 hash](https://github.com/ankitfa/fabcoinjs-lib/tree/master/test/integration/addresses.js#L29)
- [Import an address via WIF](https://github.com/ankitfa/fabcoinjs-lib/tree/master/test/integration/addresses.js#L40)
- [Generate a 2-of-3 P2SH multisig address](https://github.com/ankitfa/fabcoinjs-lib/tree/master/test/integration/addresses.js#L47)
- [Generate a SegWit address](https://github.com/ankitfa/fabcoinjs-lib/tree/master/test/integration/addresses.js#L60)
- [Generate a SegWit P2SH address](https://github.com/ankitfa/fabcoinjs-lib/tree/master/test/integration/addresses.js#L67)
- [Generate a SegWit 3-of-4 multisig address](https://github.com/ankitfa/fabcoinjs-lib/tree/master/test/integration/addresses.js#L76)
- [Generate a SegWit 2-of-2 P2SH multisig address](https://github.com/ankitfa/fabcoinjs-lib/tree/master/test/integration/addresses.js#L90)
- [Support the retrieval of transactions for an address (3rd party blockchain)](https://github.com/ankitfa/fabcoinjs-lib/tree/master/test/integration/addresses.js#L104)
- [Generate a Testnet address](https://github.com/ankitfa/fabcoinjs-lib/tree/master/test/integration/addresses.js#L123)
- [Generate a Litecoin address](https://github.com/ankitfa/fabcoinjs-lib/tree/master/test/integration/addresses.js#L133)
- [Create a 1-to-1 Transaction](https://github.com/ankitfa/fabcoinjs-lib/tree/master/test/integration/transactions.js#L13)
- [Create a 2-to-2 Transaction](https://github.com/ankitfa/fabcoinjs-lib/tree/master/test/integration/transactions.js#L28)
- [Create (and broadcast via 3PBP) a typical Transaction](https://github.com/ankitfa/fabcoinjs-lib/tree/master/test/integration/transactions.js#L47)
- [Create (and broadcast via 3PBP) a Transaction with an OP\_RETURN output](https://github.com/ankitfa/fabcoinjs-lib/tree/master/test/integration/transactions.js#L81)
- [Create (and broadcast via 3PBP) a Transaction with a 2-of-4 P2SH(multisig) input](https://github.com/ankitfa/fabcoinjs-lib/tree/master/test/integration/transactions.js#L101)
- [Create (and broadcast via 3PBP) a Transaction with a SegWit P2SH(P2WPKH) input](https://github.com/ankitfa/fabcoinjs-lib/tree/master/test/integration/transactions.js#L137)
- [Create (and broadcast via 3PBP) a Transaction with a SegWit P2WPKH input](https://github.com/ankitfa/fabcoinjs-lib/tree/master/test/integration/transactions.js#L166)
- [Create (and broadcast via 3PBP) a Transaction with a SegWit P2PK input](https://github.com/ankitfa/fabcoinjs-lib/tree/master/test/integration/transactions.js#L194)
- [Create (and broadcast via 3PBP) a Transaction with a SegWit 3-of-4 P2SH(P2WSH(multisig)) input](https://github.com/ankitfa/fabcoinjs-lib/tree/master/test/integration/transactions.js#L223)
- [Verify a Transaction signature](https://github.com/ankitfa/fabcoinjs-lib/tree/master/test/integration/transactions.js#L262)
- [Import a BIP32 testnet xpriv and export to WIF](https://github.com/ankitfa/fabcoinjs-lib/tree/master/test/integration/bip32.js#L13)
- [Export a BIP32 xpriv, then import it](https://github.com/ankitfa/fabcoinjs-lib/tree/master/test/integration/bip32.js#L20)
- [Export a BIP32 xpub](https://github.com/ankitfa/fabcoinjs-lib/tree/master/test/integration/bip32.js#L31)
- [Create a BIP32, fabcoin, account 0, external address](https://github.com/ankitfa/fabcoinjs-lib/tree/master/test/integration/bip32.js#L42)
- [Create a BIP44, fabcoin, account 0, external address](https://github.com/ankitfa/fabcoinjs-lib/tree/master/test/integration/bip32.js#L55)
- [Create a BIP49, fabcoin testnet, account 0, external address](https://github.com/ankitfa/fabcoinjs-lib/tree/master/test/integration/bip32.js#L73)
- [Use BIP39 to generate BIP32 addresses](https://github.com/ankitfa/fabcoinjs-lib/tree/master/test/integration/bip32.js#L86)
- [Create (and broadcast via 3PBP) a Transaction where Alice can redeem the output after the expiry (in the past)](https://github.com/ankitfa/fabcoinjs-lib/tree/master/test/integration/cltv.js#L42)
- [Create (and broadcast via 3PBP) a Transaction where Alice can redeem the output after the expiry (in the future)](https://github.com/ankitfa/fabcoinjs-lib/tree/master/test/integration/cltv.js#L85)
- [Create (and broadcast via 3PBP) a Transaction where Alice and Bob can redeem the output at any time](https://github.com/ankitfa/fabcoinjs-lib/tree/master/test/integration/cltv.js#L139)
- [Create (but fail to broadcast via 3PBP) a Transaction where Alice attempts to redeem before the expiry](https://github.com/ankitfa/fabcoinjs-lib/tree/master/test/integration/cltv.js#L183)
- [Recover a private key from duplicate R values](https://github.com/ankitfa/fabcoinjs-lib/tree/master/test/integration/crypto.js#L11)
- [Recover a BIP32 parent private key from the parent public key, and a derived, non-hardened child private key](https://github.com/ankitfa/fabcoinjs-lib/tree/master/test/integration/crypto.js#L62)
- [Generate a single-key stealth address](https://github.com/ankitfa/fabcoinjs-lib/tree/master/test/integration/stealth.js#L72)
- [Generate a single-key stealth address (randomly)](https://github.com/ankitfa/fabcoinjs-lib/tree/master/test/integration/stealth.js#L91)
- [Recover parent recipient.d, if a derived private key is leaked (and nonce was revealed)](https://github.com/ankitfa/fabcoinjs-lib/tree/master/test/integration/stealth.js#L107)
- [Generate a dual-key stealth address](https://github.com/ankitfa/fabcoinjs-lib/tree/master/test/integration/stealth.js#L124)
- [Generate a dual-key stealth address (randomly)](https://github.com/ankitfa/fabcoinjs-lib/tree/master/test/integration/stealth.js#L147)

If you have a use case that you feel could be listed here, please [ask for it](https://github.com/ankitfa/fabcoinjs-lib/issues/new)!


### Running the test suite

``` bash
npm test
npm run-script coverage
```
