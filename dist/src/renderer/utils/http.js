var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import got from 'got';
export var reqwest = function (url, options) {
    if (options === void 0) { options = {}; }
    return got(url, __assign({
        timeout: 1000,
        retry: 0
    }, options));
};
//# sourceMappingURL=http.js.map