import BaseModel from './base';
export default new BaseModel({
    type: 'object',
    properties: {
        ip: {
            type: 'string'
        },
        host: {
            type: ['string', 'null'],
            format: function (value) { return value.host || null; }
        },
        port: {
            type: ['integer', 'null']
        },
        p2pPort: {
            type: ['integer', 'null'],
            format: function (value) { return value.p2pPort || null; }
        },
        version: {
            type: 'string'
        },
        height: {
            type: 'integer'
        },
        status: {
            type: ['string', 'integer']
        },
        os: {
            type: 'string'
        },
        latency: {
            type: 'integer'
        },
        isCustom: {
            type: 'boolean',
            format: function (value) { return value.isCustom || false; }
        },
        lastUpdated: {
            type: ['date', 'null'],
            format: function (value) { return value.lastUpdated || null; }
        },
        isHttps: {
            type: 'boolean',
            format: function (value) { return value.isHttps || false; }
        }
    },
    required: ['ip', 'port', 'height', 'latency']
});
//# sourceMappingURL=peer.js.map