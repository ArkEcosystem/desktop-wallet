import { contacts } from "domains/contact/data";
import React from "react";

import { SelectRecipient } from "./SelectRecipient";

export default { title: "Domains / Profile / Components / Select Recipient" };

export const Default = () => {
	return (
		<div className="max-w-lg space-y-8">
			<div>
				<SelectRecipient contacts={contacts} />
			</div>
			<div>
				<SelectRecipient contacts={contacts} isInvalid />
			</div>
			<div>
				<SelectRecipient contacts={contacts} disabled />
			</div>
			<div>
				<div className="mb-3">Selected address</div>
				<SelectRecipient contacts={contacts} address="bP6T9GQ3kqP6T9GQ3kqP6T9GQ3kqTTTP6T9GQ3kqT" />
			</div>
			<div>
				<div className="mb-3">Selected address (disabled)</div>
				<SelectRecipient disabled contacts={contacts} address="bP6T9GQ3kqP6T9GQ3kqP6T9GQ3kqTTTP6T9GQ3kqT" />
			</div>
		</div>
	);
};
