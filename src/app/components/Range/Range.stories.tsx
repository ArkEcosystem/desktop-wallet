import React from "react";

import { Range } from "./Range";

export default { title: "Basic / Range" };

export const Default = () => {
	const [values, setValues] = React.useState([10]);
	return (
		<div className="max-w-lg">
			<Range values={values} min={0} max={100} step={0.1} onChange={setValues} />
		</div>
	);
};
