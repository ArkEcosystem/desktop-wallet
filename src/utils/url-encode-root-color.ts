export const urlEncodeRootColor = (rootColor: string): string => {
	const hexColor = getComputedStyle(document.body).getPropertyValue(rootColor);
	return `%23${hexColor.trim().slice(1)}`;
};
