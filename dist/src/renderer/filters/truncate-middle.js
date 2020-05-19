export default function truncateMiddle(value, limit) {
    if (limit === void 0) { limit = 10; }
    if (value.length <= limit) {
        return value;
    }
    var lengthTruncation = Math.floor(limit / 2);
    var leftData = value.slice(0, lengthTruncation);
    var rightData = value.slice(value.length - lengthTruncation);
    return leftData + "\u2026" + rightData;
}
//# sourceMappingURL=truncate-middle.js.map