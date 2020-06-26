import { boolean } from "@storybook/addon-knobs";
import React, { useEffect, useState } from "react";

import { InstallPlugin } from "./InstallPlugin";

export default { title: "Plugins / Components / Install Plugin" };

export const Default = () => {
	const [step, setStep] = useState(1);

	useEffect(() => {
		if (step === 2) {
			setTimeout(() => setStep(3), 3000);
		}
	}, [step]);

	return (
		<InstallPlugin
			step={step}
			isOpen={boolean("Is Open", true)}
			onClose={() => alert("closed")}
			onCancel={() => alert("cancelled")}
			onDownload={() => setStep(2)}
		/>
	);
};
