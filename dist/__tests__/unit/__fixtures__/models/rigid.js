"use strict";
module.exports = {
    type: 'object',
    properties: {
        integer: {
            type: 'integer'
        },
        date: {
            type: 'date',
            format: function (data) { return new Date(data.timestamp); }
        },
        timestamp: {
            type: 'number'
        }
    },
    required: ['integer', 'timestamp']
};
//# sourceMappingURL=rigid.js.map