import React, { useState } from "react";
import { withKnobs, select, text } from "@storybook/addon-knobs";
import { VerifyMessageStatus } from "./VerifyMessageStatus";
import { Button } from "app/components/Button";

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
