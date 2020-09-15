import React, { useState } from "react";

import { InputFee } from "./InputFee";

export default { title: "App / Components / InputFee" };

export const Default = () => {
	const [value, setValue] = useState((5 * 1e8).toFixed(0));
	const fees = {
		min: (1 * 1e8).toFixed(0),
		max: (10 * 1e8).toFixed(0),
		avg: (1.354 * 1e8).toFixed(0),
	};

	return (
		<div className="max-w-lg">
			<InputFee
				{...fees}
				defaultValue={value}
				step={0.01}
				onChange={(currency: any) => setValue(currency.value)}
			/>
		</div>
	);
};
