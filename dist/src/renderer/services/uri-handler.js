var schemaRegex = new RegExp(/^(?:ark:)([0-9a-zA-Z]{34})([-a-zA-Z0-9+&@#/%=~_|$?!:,.]*)$/);
var URIHandler = /** @class */ (function () {
    function URIHandler(url) {
        this.url = url;
    }
    /**
     * Transforms a uri schema into a json object
     * @returns {Object}
     */
    URIHandler.prototype.deserialize = function () {
        if (!this.validate())
            return;
        var schema = this.__formatSchema();
        var queryString = {};
        var regex = new RegExp('([^?=&]+)(=([^&]*))?', 'g');
        schema[2].replace(regex, function (_, $1, __, $3) { return (queryString[$1] = $3); });
        var scheme = {
            address: null,
            amount: null,
            label: null,
            nethash: null,
            vendorField: null,
            wallet: null
        };
        for (var prop in scheme) {
            scheme[prop] = queryString[prop];
        }
        scheme.address = schema[1];
        scheme.amount = scheme.amount ? Number(scheme.amount) : null;
        scheme.label = scheme.label ? this.__fullyDecode(scheme.label) : null;
        scheme.nethash = scheme.nethash ? this.__fullyDecode(scheme.nethash) : null;
        scheme.vendorField = scheme.vendorField ? this.__fullyDecode(scheme.vendorField) : null;
        scheme.wallet = scheme.wallet ? this.__fullyDecode(scheme.wallet) : null;
        return scheme;
    };
    /**
     * Check if is a valid URI
     * @returns {Boolean}
     */
    URIHandler.prototype.validate = function () {
        return schemaRegex.test(this.url);
    };
    /**
     * Checks whether the parameter is encoded
     * @param {String} param
     * @returns {String}
     */
    URIHandler.prototype.__fullyDecode = function (param) {
        var isEncoded = function (str) { return str !== decodeURIComponent(str); };
        while (isEncoded(param))
            param = decodeURIComponent(param);
        return param;
    };
    URIHandler.prototype.__formatSchema = function () {
        return schemaRegex.exec(this.url);
    };
    return URIHandler;
}());
export default URIHandler;
//# sourceMappingURL=uri-handler.js.map