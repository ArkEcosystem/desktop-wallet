type RangeInput = {
	min: number;
	max: number;
	step: number;
};

const isStepDivisible = ({ min, max, step }: RangeInput) => {
	const res = (max - min) / step;
	return parseInt(res.toString(), 10) === res;
};

export const sanitizeStep = ({ min, max, step }: RangeInput): number =>
	isStepDivisible({ min, max, step }) ? step : (max - min) / 100;
