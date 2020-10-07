export const modalTopOffsetClass = (itemHeight: number, windowHeight: number) => {
	const additionalHeight = 10;
	return itemHeight + additionalHeight > windowHeight ? "mt-36" : "";
};
