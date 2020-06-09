import React, { useState } from "react";

import { SignMessage } from "./SignMessage";
import { Button } from "app/components/Button";

export default { title: "Components / Sign Message" };

export const Default = () => {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<>
			<Button onClick={() => setIsOpen(!isOpen)}>Toggle Sign Message</Button>
			<SignMessage
				signatoryAddress="AUexKjGtgsSpVzPLs6jNMM6vJ6znEVTQWK"
				isOpen={isOpen}
				handleClose={() => setIsOpen(false)}
			/>
		</>
	);
};
