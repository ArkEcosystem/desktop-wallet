var testRequired = function (model, validValue) {
    if (validValue === void 0) { validValue = 'not empty'; }
    if (!Object.prototype.hasOwnProperty.call(model, 'required') && !Object.prototype.hasOwnProperty.call(model, 'requiredIfFull')) {
        throw new Error('missing required property');
    }
    expect(Object.prototype.hasOwnProperty.call(model, 'required') ? model.required : model.requiredIfFull).toBe(false);
    expect(model.$invalid).toBe(true);
    model.$model = validValue;
    expect(Object.prototype.hasOwnProperty.call(model, 'required') ? model.required : model.requiredIfFull).toBe(true);
    expect(model.$invalid).toBe(false);
    model.$model = '';
    expect(Object.prototype.hasOwnProperty.call(model, 'required') ? model.required : model.requiredIfFull).toBe(false);
    expect(model.$invalid).toBe(true);
};
var testIsValid = function (model, valueTests) {
    for (var _i = 0, valueTests_1 = valueTests; _i < valueTests_1.length; _i++) {
        var valueTest = valueTests_1[_i];
        model.$model = valueTest.value;
        if (valueTest.valid) {
            expect(model.isValid).toBe(true);
            expect(model.$invalid).toBe(false);
        }
        else {
            expect(model.isValid).toBe(false);
            expect(model.$invalid).toBe(true);
        }
    }
};
var testUrl = function (model) {
    testIsValid(model, [
        {
            value: 'http://-test.com',
            valid: false
        },
        {
            value: 'http://test.com',
            valid: true
        },
        {
            value: 'http://test.com-',
            valid: false
        },
        {
            value: 'http://test.com:4003',
            valid: true
        },
        {
            value: 'http://test.com:abcd',
            valid: false
        },
        {
            value: 'http://test.com',
            valid: true
        },
        {
            value: 'http://$test.com',
            valid: false
        }
    ]);
};
var testScheme = function (model) {
    model.$model = 'ark://1.2.3.4';
    expect(model.hasScheme).toBe(false);
    expect(model.$invalid).toBe(true);
    model.$model = 'http://1.2.3.4';
    expect(model.hasScheme).toBe(true);
    expect(model.$invalid).toBe(false);
    model.$model = 'ark://1.2.3.4';
    expect(model.hasScheme).toBe(false);
    expect(model.$invalid).toBe(true);
    model.$model = 'https://1.2.3.4';
    expect(model.hasScheme).toBe(true);
    expect(model.$invalid).toBe(false);
    model.$model = 'ark://1.2.3.4';
    expect(model.hasScheme).toBe(false);
    expect(model.$invalid).toBe(true);
};
var testNumeric = function (model) {
    model.$model = 'not numeric';
    expect(model.numeric).toBe(false);
    expect(model.$invalid).toBe(true);
    model.$model = '1';
    expect(model.numeric).toBe(true);
    expect(model.$invalid).toBe(false);
    model.$model = 'not numeric';
    expect(model.numeric).toBe(false);
    expect(model.$invalid).toBe(true);
};
export { testIsValid, testNumeric, testRequired, testScheme, testUrl };
//# sourceMappingURL=validation.js.map