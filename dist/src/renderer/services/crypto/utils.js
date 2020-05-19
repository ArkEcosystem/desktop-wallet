import { cloneDeep } from 'lodash';
var CryptoUtils = /** @class */ (function () {
    function CryptoUtils() {
    }
    CryptoUtils.transactionFromData = function (transaction) {
        transaction = cloneDeep(transaction);
        transaction.multiSignature = undefined;
        transaction.timestamp = undefined;
        return transaction;
    };
    /*
     * Normalizes the passphrase by decomposing any characters (if applicable)
     * This is mainly used for the korean language where characters are combined while the passphrase was based on the decomposed consonants
     */
    CryptoUtils.normalizePassphrase = function (passphrase) {
        if (passphrase) {
            return passphrase.normalize('NFD');
        }
    };
    return CryptoUtils;
}());
export { CryptoUtils };
//# sourceMappingURL=utils.js.map