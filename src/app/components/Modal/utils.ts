export const modalOffsetClass = (itemHeight: number, windowHeight: number) => {
	const padding = 80;

	return itemHeight + padding > windowHeight ? "top-0 my-20" : "";
};
