import React, { useState } from "react";
import { CircularProgressBar } from "./CircularProgressBar";

export default {
	title: "Components / CircularProgressBar",
};

export const Default = () => {
	const [percentage, setPercentage] = useState(10);

	const updatePercentage = (event: any) => {
		setPercentage(event.target.value);
	};

	return (
		<>
			<CircularProgressBar value={percentage} />
			<input
				type="range"
				min="0"
				max="100"
				step="1"
				value={percentage}
				className="mt-5"
				onChange={updatePercentage}
			/>
		</>
	);
};
