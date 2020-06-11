import React, { useState } from "react";
import { withKnobs, select } from "@storybook/addon-knobs";
import { MessageStatus } from "./MessageStatus";
import { Button } from "app/components/Button";

export default { title: "Wallets / Message / Status Modal", decorators: [withKnobs] };

export const Default = () => {
	const [isOpen, setIsOpen] = useState(false);
	const template = select("Template", ["VerifyMessage"], "VerifyMessage");
	const type = select("Type", ["success", "error"], "success");

	return (
		<>
			<Button onClick={() => setIsOpen(!isOpen)}>Toggle Status Modal</Button>
			<MessageStatus template={template} type={type} isOpen={isOpen} onClose={() => setIsOpen(false)} />
		</>
	);
};
