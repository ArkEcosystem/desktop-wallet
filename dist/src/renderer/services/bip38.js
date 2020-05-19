import { fork } from 'child_process';
import { resolve } from 'path';
var default_1 = /** @class */ (function () {
    function default_1() {
        var workersPath = process.env.NODE_ENV === 'production' ? 'workers/' : '../workers/';
        this.worker = fork(resolve(__dirname, workersPath, 'bip38-worker.js'));
    }
    default_1.prototype.decrypt = function (_a) {
        var bip38key = _a.bip38key, password = _a.password, wif = _a.wif;
        var onMessage = this.onMessage();
        this.worker.send({ bip38key: bip38key, password: password, wif: wif });
        return onMessage;
    };
    default_1.prototype.encrypt = function (_a) {
        var passphrase = _a.passphrase, password = _a.password, wif = _a.wif;
        var onMessage = this.onMessage();
        this.worker.send({ passphrase: passphrase, password: password, wif: wif });
        return onMessage;
    };
    default_1.prototype.onMessage = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.worker.on('message', function (message) {
                message.error ? reject(message.error) : resolve(message);
            });
        });
    };
    default_1.prototype.quit = function () {
        this.worker.send('quit');
    };
    return default_1;
}());
export default default_1;
//# sourceMappingURL=bip38.js.map