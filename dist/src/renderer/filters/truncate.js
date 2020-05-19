export default function truncate(value, limit) {
    if (limit === void 0) { limit = 10; }
    if (value && value.length <= limit) {
        return value;
    }
    return value ? value.slice(0, limit) + "\u2026" : value;
}
//# sourceMappingURL=truncate.js.map