export const lowerCaseEquals = (a?: string, b?: string): boolean => {
	if (!a) {
		return false;
	}

	if (!b) {
		return false;
	}

	return a.toLowerCase() === b.toLowerCase();
};
