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
import { BridgechainResignationBuilder } from './bridgechain-resignation.builder';
import { BridgechainUpdateBuilder } from './bridgechain-update.builder';
import { BridgechainRegistrationBuilder } from './bridgechain-registration.builder';
import { BusinessResignationBuilder } from './business-resignation.builder';
import { BusinessUpdateBuilder } from './business-update.builder';
import { BusinessRegistrationBuilder } from './business-registration.builder';
import { DelegateResignationBuilder } from './delegate-resignation.builder';
import { MultiPaymentBuilder } from './multi-payment.builder';
import { IpfsBuilder } from './ipfs.builder';
import { MultiSignatureBuilder } from './multi-signature.builder';
import { SecondSignatureRegistrationBuilder } from './second-signature-registration.builder';
import { TransferBuilder } from './transfer.builder';
import { DelegateRegistrationBuilder } from './delegate-registration.builder';
import { VoteBuilder } from './vote.builder';
import './configure-magistrate-transactions';
var TransactionBuilderService = /** @class */ (function () {
    function TransactionBuilderService() {
    }
    TransactionBuilderService.buildTransfer = function (data, isAdvancedFee, returnObject) {
        if (isAdvancedFee === void 0) { isAdvancedFee = false; }
        if (returnObject === void 0) { returnObject = false; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, TransferBuilder.build(data, isAdvancedFee, returnObject)];
            });
        });
    };
    TransactionBuilderService.buildSecondSignatureRegistration = function (data, isAdvancedFee, returnObject) {
        if (isAdvancedFee === void 0) { isAdvancedFee = false; }
        if (returnObject === void 0) { returnObject = false; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, SecondSignatureRegistrationBuilder.build(data, isAdvancedFee, returnObject)];
            });
        });
    };
    TransactionBuilderService.buildDelegateRegistration = function (data, isAdvancedFee, returnObject) {
        if (isAdvancedFee === void 0) { isAdvancedFee = false; }
        if (returnObject === void 0) { returnObject = false; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, DelegateRegistrationBuilder.build(data, isAdvancedFee, returnObject)];
            });
        });
    };
    TransactionBuilderService.buildVote = function (data, isAdvancedFee, returnObject) {
        if (isAdvancedFee === void 0) { isAdvancedFee = false; }
        if (returnObject === void 0) { returnObject = false; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, VoteBuilder.build(data, isAdvancedFee, returnObject)];
            });
        });
    };
    TransactionBuilderService.buildMultiSignature = function (data, isAdvancedFee, returnObject) {
        if (isAdvancedFee === void 0) { isAdvancedFee = false; }
        if (returnObject === void 0) { returnObject = false; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, MultiSignatureBuilder.build(data, isAdvancedFee, returnObject)];
            });
        });
    };
    TransactionBuilderService.buildIpfs = function (data, isAdvancedFee, returnObject) {
        if (isAdvancedFee === void 0) { isAdvancedFee = false; }
        if (returnObject === void 0) { returnObject = false; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, IpfsBuilder.build(data, isAdvancedFee, returnObject)];
            });
        });
    };
    TransactionBuilderService.buildMultiPayment = function (data, isAdvancedFee, returnObject) {
        if (isAdvancedFee === void 0) { isAdvancedFee = false; }
        if (returnObject === void 0) { returnObject = false; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, MultiPaymentBuilder.build(data, isAdvancedFee, returnObject)];
            });
        });
    };
    TransactionBuilderService.buildDelegateResignation = function (data, isAdvancedFee, returnObject) {
        if (isAdvancedFee === void 0) { isAdvancedFee = false; }
        if (returnObject === void 0) { returnObject = false; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, DelegateResignationBuilder.build(data, isAdvancedFee, returnObject)];
            });
        });
    };
    TransactionBuilderService.buildBusinessRegistration = function (data, isAdvancedFee, returnObject) {
        if (isAdvancedFee === void 0) { isAdvancedFee = false; }
        if (returnObject === void 0) { returnObject = false; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, BusinessRegistrationBuilder.build(data, isAdvancedFee, returnObject)];
            });
        });
    };
    TransactionBuilderService.buildBusinessUpdate = function (data, isAdvancedFee, returnObject) {
        if (isAdvancedFee === void 0) { isAdvancedFee = false; }
        if (returnObject === void 0) { returnObject = false; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, BusinessUpdateBuilder.build(data, isAdvancedFee, returnObject)];
            });
        });
    };
    TransactionBuilderService.buildBusinessResignation = function (data, isAdvancedFee, returnObject) {
        if (isAdvancedFee === void 0) { isAdvancedFee = false; }
        if (returnObject === void 0) { returnObject = false; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, BusinessResignationBuilder.build(data, isAdvancedFee, returnObject)];
            });
        });
    };
    TransactionBuilderService.buildBridgechainRegistration = function (data, isAdvancedFee, returnObject) {
        if (isAdvancedFee === void 0) { isAdvancedFee = false; }
        if (returnObject === void 0) { returnObject = false; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, BridgechainRegistrationBuilder.build(data, isAdvancedFee, returnObject)];
            });
        });
    };
    TransactionBuilderService.buildBridgechainUpdate = function (data, isAdvancedFee, returnObject) {
        if (isAdvancedFee === void 0) { isAdvancedFee = false; }
        if (returnObject === void 0) { returnObject = false; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, BridgechainUpdateBuilder.build(data, isAdvancedFee, returnObject)];
            });
        });
    };
    TransactionBuilderService.buildBridgechainResignation = function (data, isAdvancedFee, returnObject) {
        if (isAdvancedFee === void 0) { isAdvancedFee = false; }
        if (returnObject === void 0) { returnObject = false; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, BridgechainResignationBuilder.build(data, isAdvancedFee, returnObject)];
            });
        });
    };
    return TransactionBuilderService;
}());
export { TransactionBuilderService };
//# sourceMappingURL=transaction-builder.service.js.map