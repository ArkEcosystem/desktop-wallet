import { transform } from 'lodash';
import { validate as jsonValidate } from 'jsonschema';
import { isNil } from '@/utils';
var BaseModel = /** @class */ (function () {
    function BaseModel(schema) {
        this.schema = schema;
    }
    BaseModel.prototype.deserialize = function (input) {
        if (typeof input !== 'object') {
            throw new Error("Invalid model input type: `" + input + "`");
        }
        var model = {};
        var properties = this.formatProperties(input);
        Object.defineProperties(model, properties);
        this.validate(model);
        return model;
    };
    BaseModel.prototype.formatProperties = function (input) {
        return transform(this.schema.properties, function (result, item, key) {
            var value;
            if (item.format && typeof item.format === 'function') {
                value = item.format(input);
            }
            else if (input[key] !== undefined) {
                value = input[key];
            }
            if (isNil(value) && item.default) {
                value = item.default;
            }
            result[key] = {
                enumerable: true,
                writable: true,
                value: value
            };
        }, {});
    };
    BaseModel.prototype.validate = function (input) {
        var validation = jsonValidate(input, this.schema);
        if (!validation.valid) {
            var errors = validation.errors.map(function (error) { return error.stack; }).join(', ');
            throw new Error("JSON: " + JSON.stringify(this.schema, null, 2) + " Cannot be instantiated due to errors: " + errors + "\n        input: " + JSON.stringify(input) + "\n      ");
        }
    };
    return BaseModel;
}());
export default BaseModel;
//# sourceMappingURL=base.js.map