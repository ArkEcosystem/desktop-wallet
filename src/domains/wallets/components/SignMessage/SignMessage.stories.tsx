import { Button } from "app/components/Button";
import React, { useState } from "react";

import { SignMessage } from "./SignMessage";

export default { title: "Wallets / Components / Sign Message" };

export const Default = () => {
	const [isOpen, setIsOpen] = useState(false);
	const [isSigned, setIsSigned] = useState(false);

	return (
		<>
			<Button onClick={() => setIsOpen(!isOpen)}>Toggle Sign Message</Button>
			<Button className="ml-5" onClick={() => setIsSigned(!isOpen)}>
				{`isSigned is ${isSigned}, click to change`}
			</Button>
			<SignMessage
				signatoryAddress="AUexKjGtgsSpVzPLs6jNMM6vJ6znEVTQWK"
				isOpen={isOpen}
				isSigned={isSigned}
				handleClose={() => setIsOpen(false)}
				handleSign={() => setIsSigned(true)}
			/>
		</>
	);
};
