import React, { useState } from "react";

import { InputFee } from "./InputFee";

export default { title: "App / Components / InputFee" };

export const Default = () => {
	const [value, setValue] = useState((5 * 1e8).toFixed(0));
	const feeOptions = {
		min: (1 * 1e8).toFixed(0),
		max: (10 * 1e8).toFixed(0),
		average: (1.354 * 1e8).toFixed(0),
	};

	return (
		<div className="max-w-lg">
			<InputFee {...feeOptions} defaultValue={value} step={0.01} onChange={(toshi: any) => setValue(toshi)} />
		</div>
	);
};
