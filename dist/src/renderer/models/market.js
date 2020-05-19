import BaseModel from './base';
export var MarketTicker = new BaseModel({
    type: 'object',
    properties: {
        id: {
            format: function (data) { return data.token + "/" + data.currency; }
        },
        token: {},
        currency: {},
        price: {
            format: function (data) { return Number(data.price) || 0.0; }
        },
        marketCap: {
            format: function (data) { return Number(data.marketCap) || 0.0; }
        },
        volume: {
            format: function (data) { return Number(data.volume) || 0.0; }
        },
        date: {},
        change24h: {
            format: function (data) { return Number(data.change24h) || 0; }
        }
    }
});
//# sourceMappingURL=market.js.map