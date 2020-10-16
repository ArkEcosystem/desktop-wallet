import React, { useState } from "react";

import { InputRange } from "./InputRange";

export default { title: "App / Components / InputRange" };

export const Default = () => {
	const [value, setValue] = useState({ display: "25", value: (25 * 1e8).toFixed(0) });
	const fees = {
		min: "0",
		max: "100",
		avg: "1354000",
	};

	return (
		<div className="max-w-lg">
			<InputRange {...fees} avg={fees.avg} step={0.01} onChange={(toshi: any) => setValue(toshi)} />

			{value.value}
		</div>
	);
};
