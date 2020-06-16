import { select, text, withKnobs } from "@storybook/addon-knobs";
import { Button } from "app/components/Button";
import React, { useState } from "react";

import { VerifyMessageStatus } from "./VerifyMessageStatus";

export default { title: "Wallets / Components / Verify Message Status Modal", decorators: [withKnobs] };

export const Default = () => {
	const [isOpen, setIsOpen] = useState(false);
	const type = select("Type", ["success", "error"], "success");
	const title = text("Title", "Title");
	const description = text("Description", "Description");

	return (
		<>
			<Button onClick={() => setIsOpen(!isOpen)}>Toggle Status Modal</Button>
			<VerifyMessageStatus
				title={title}
				description={description}
				type={type}
				isOpen={isOpen}
				onClose={() => setIsOpen(false)}
			/>
		</>
	);
};
