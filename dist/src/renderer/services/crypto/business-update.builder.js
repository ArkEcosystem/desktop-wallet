var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import * as MagistrateCrypto from '@arkecosystem/core-magistrate-crypto';
import { TRANSACTION_TYPES } from '@config';
import store from '@/store';
import { CryptoUtils } from './utils';
import { TransactionSigner } from './transaction-signer';
var BusinessUpdateBuilder = /** @class */ (function () {
    function BusinessUpdateBuilder() {
    }
    BusinessUpdateBuilder.build = function (_a, isAdvancedFee, returnObject) {
        var address = _a.address, fee = _a.fee, asset = _a.asset, passphrase = _a.passphrase, secondPassphrase = _a.secondPassphrase, wif = _a.wif, networkWif = _a.networkWif, multiSignature = _a.multiSignature, nonce = _a.nonce;
        if (isAdvancedFee === void 0) { isAdvancedFee = false; }
        if (returnObject === void 0) { returnObject = false; }
        return __awaiter(this, void 0, void 0, function () {
            var staticFee, businessAsset, transaction;
            return __generator(this, function (_b) {
                if (!store.getters['session/network'].constants.aip11) {
                    throw new Error('AIP-11 transaction not supported on network');
                }
                staticFee = store.getters['transaction/staticFee'](TRANSACTION_TYPES.GROUP_2.BUSINESS_UPDATE, 2);
                if (!isAdvancedFee && fee.gt(staticFee)) {
                    throw new Error("Business Update fee should be smaller than " + staticFee);
                }
                businessAsset = {
                    name: asset.name,
                    website: asset.website
                };
                if (asset.vat && asset.vat.length) {
                    businessAsset.vat = asset.vat;
                }
                if (asset.repository && asset.repository.length) {
                    businessAsset.repository = asset.repository;
                }
                transaction = new MagistrateCrypto.Builders.BusinessUpdateBuilder()
                    .businessUpdateAsset(businessAsset)
                    .fee(fee);
                passphrase = CryptoUtils.normalizePassphrase(passphrase);
                secondPassphrase = CryptoUtils.normalizePassphrase(secondPassphrase);
                return [2 /*return*/, TransactionSigner.sign({
                        address: address,
                        transaction: transaction,
                        passphrase: passphrase,
                        secondPassphrase: secondPassphrase,
                        wif: wif,
                        networkWif: networkWif,
                        multiSignature: multiSignature,
                        nonce: nonce
                    }, returnObject)];
            });
        });
    };
    return BusinessUpdateBuilder;
}());
export { BusinessUpdateBuilder };
//# sourceMappingURL=business-update.builder.js.map