export default {
    create: jest.fn(function () {
        return {
            close: jest.fn(),
            disconected: false
        };
    })
};
//# sourceMappingURL=hw-transport-node-hid-singleton.js.map