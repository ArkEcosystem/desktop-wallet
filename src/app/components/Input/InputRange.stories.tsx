import React from "react";

import { InputRange } from "./InputRange";

export default { title: "Input / Input / InputRange" };

export const Default = () => (
	<div className="max-w-lg">
		<InputRange defaultValue={25} min={1} max={100} step={1} />
	</div>
);
