interface RangeInput {
	min: number;
	max: number;
	step: number;
}

const isStepDivisible = ({ min, max, step }: RangeInput) => {
	const res = (max - min) / step;
	return Number.parseInt(res.toString(), 10) === res;
};

export const sanitizeStep = ({ min, max, step }: RangeInput): number =>
	isStepDivisible({ max, min, step }) ? step : (max - min) / 100;
