import { withKnobs } from "@storybook/addon-knobs";
import { Button } from "app/components/Button";
import React, { useState } from "react";

import { Clipboard } from "./Clipboard";

export default {
	title: "App / Components / Clipboard",
	decorators: [withKnobs],
};

export const Default = () => {
	const [value, setValue] = useState(null);
	const data = "C-C-C-COPY";

	return (
		<>
			<Clipboard data={data} options={{ onSuccess: setValue }}>
				<Button>Click to copy</Button>
			</Clipboard>

			{value && <span className="block mt-4">Copied value: {value}</span>}
		</>
	);
};
