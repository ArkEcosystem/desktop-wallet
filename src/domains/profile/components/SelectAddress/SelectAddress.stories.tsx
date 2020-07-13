import { contacts } from "domains/contact/data";
import React from "react";

import { SelectAddress } from "./SelectAddress";

export default { title: "Domains / Profile / Components / SelectAddress" };

export const Default = () => {
	return (
		<div className="max-w-lg space-y-8">
			<div>
				<SelectAddress contacts={contacts} />
			</div>
			<div>
				<SelectAddress contacts={contacts} isInvalid />
			</div>
			<div>
				<SelectAddress contacts={contacts} disabled />
			</div>
			<div>
				<div className="mb-3">Selected address (verified)</div>
				<SelectAddress contacts={contacts} address="bP6T9GQ3kqP6T9GQ3kqP6T9GQ3kqTTTP6T9GQ3kqT" isVerified />
			</div>
			<div>
				<div className="mb-3">Selected address (disabled)</div>
				<SelectAddress disabled contacts={contacts} address="bP6T9GQ3kqP6T9GQ3kqP6T9GQ3kqTTTP6T9GQ3kqT" />
			</div>
		</div>
	);
};
