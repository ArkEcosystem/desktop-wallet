import React, { useState } from "react";

import { VerifyMessage } from "./VerifyMessage";
import { Button } from "app/components/Button";

export default { title: "Wallets / Components / Verify Message" };

export const Default = () => {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<>
			<Button onClick={() => setIsOpen(!isOpen)}>Toggle Verify Message</Button>
			<VerifyMessage
				isOpen={isOpen}
				handleClose={() => setIsOpen(false)}
				publicKey="AUexKjGtgsSpVzPLs6jNMM6vJ6znEVTQWKAUexKjGtgsSpVzPLs6jNMM"
			/>
		</>
	);
};
