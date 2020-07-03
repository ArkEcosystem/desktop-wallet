import React from "react";

import { CreateContact } from "./CreateContact";

export default {
	title: "Domains / Contact / Components / CreateContact",
};

export const Default = () => {
	const assets = [
		{
			icon: "Ark",
			name: "ARK Ecosystem",
			className: "text-theme-danger-400 border-theme-danger-200",
		},
		{
			icon: "Bitcoin",
			name: "Bitcoin",
			className: "text-theme-warning-400 border-theme-warning-200",
		},
		{
			icon: "Ethereum",
			name: "Ethereum",
			className: "text-theme-neutral-800 border-theme-neutral-600",
		},
		{
			icon: "Lisk",
			name: "Lisk",
			className: "text-theme-primary-600 border-theme-primary-400",
		},
		{
			icon: "Ripple",
			name: "Ripple",
			className: "text-theme-primary-700 border-theme-primary-500",
		},
	];

	return (
		<CreateContact
			isOpen={true}
			assets={assets}
			onClose={() => alert("closed")}
			onCancel={() => alert("cancelled")}
			onSave={() => alert("saved")}
		/>
	);
};
