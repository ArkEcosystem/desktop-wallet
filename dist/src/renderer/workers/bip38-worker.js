/* eslint-disable @typescript-eslint/no-var-requires */
'use strict';
var bip38 = require('bip38');
var wif = require('wif');
var Identities = require('@arkecosystem/crypto').Identities;
process.on('message', function (message) {
    if (message.passphrase) {
        try {
            var key = Identities.WIF.fromPassphrase(message.passphrase, { wif: message.wif });
            var decoded = wif.decode(key);
            process.send({
                bip38key: bip38.encrypt(decoded.privateKey, decoded.compressed, message.password)
            });
        }
        catch (error) {
            process.send({
                error: "Failed to encrypt passphrase: " + error.message
            });
        }
    }
    else if (message.bip38key) {
        try {
            var decryptedKey = bip38.decrypt(message.bip38key, message.password);
            process.send({
                encodedWif: wif.encode(message.wif, decryptedKey.privateKey, decryptedKey.compressed)
            });
        }
        catch (error) {
            process.send({
                error: "Failed to decrypt passphrase: " + error.message
            });
        }
    }
    else if (message === 'quit') {
        process.exit();
    }
});
//# sourceMappingURL=bip38-worker.js.map