export const modalOffsetClass = (itemHeight: number, windowHeight: number) => {
	const padding = 80;

	return itemHeight + 2 * padding > windowHeight ? "top-0 my-20" : "";
};
