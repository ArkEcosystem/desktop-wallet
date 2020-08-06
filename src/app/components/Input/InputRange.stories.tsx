import React, { useState } from "react";

import { InputRange } from "./InputRange";

export default { title: "App / Components / InputRange" };

export const Default = () => {
	const [value, setValue] = useState((25 * 1e8).toFixed(0));
	const feeOptions = {
		min: 0,
		max: 100,
	};

	return (
		<div className="max-w-lg">
			<InputRange
				{...feeOptions}
				defaultValue={value}
				value={value}
				step={0.01}
				onChange={(toshi: any) => setValue(toshi)}
			/>

			{value}
		</div>
	);
};
