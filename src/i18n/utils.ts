export function flattenMessages(nestedMessages: any, prefix = "") {
	return Object.keys(nestedMessages).reduce((messages: any, key) => {
		let value = nestedMessages[key];
		let prefixedKey = prefix ? `${prefix}.${key}` : key;

		if (typeof value === "string") {
			messages[prefixedKey] = value;
		} else {
			Object.assign(messages, flattenMessages(value, prefixedKey));
		}

		return messages;
	}, {});
}
