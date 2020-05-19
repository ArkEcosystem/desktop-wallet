import trunc from 'trunc-html';
import BaseModel from './base';
export default new BaseModel({
    type: 'object',
    properties: {
        guid: {},
        date: {
            format: function (data) { return data.isoDate; }
        },
        title: {},
        summary: {
            type: ['string', 'null'],
            format: function (data) { return trunc(data['content:encoded'], 300).text; }
        },
        url: {
            format: function (data) { return data.link; }
        },
        isRead: {
            format: function () { return false; }
        }
    }
});
//# sourceMappingURL=announcement.js.map