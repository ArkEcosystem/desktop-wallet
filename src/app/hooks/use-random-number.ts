import { useMemo } from "react";

export const useRandomNumber = (minimum: number, maximum: number) => {
	if (!Number.isInteger(minimum) || !Number.isInteger(maximum)) {
		throw new TypeError("Arguments must be integers");
	}

	return useMemo(() => Math.floor(Math.random() * (maximum - minimum + 1)) + minimum, [maximum, minimum]);
};
