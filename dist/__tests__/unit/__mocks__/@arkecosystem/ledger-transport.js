var ARKTransport = /** @class */ (function () {
    function ARKTransport() {
        this.getPublicKey = jest.fn(function () { return '0278a28d0eac9916ef46613d9dbac706acc218e64864d4b4c1fcb0c759b6205b2b'; });
        this.signMessage = jest.fn(function () { return 'SIGNATURE'; });
        this.signTransaction = jest.fn(function () { return 'SIGNATURE'; });
        this.getVersion = jest.fn(function () { return '1.0.0'; });
    }
    return ARKTransport;
}());
export { ARKTransport };
//# sourceMappingURL=ledger-transport.js.map