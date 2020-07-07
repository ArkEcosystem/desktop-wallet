const actions = [
	{
		label: "Edit",
		value: "edit",
	},
	{
		label: "Delete",
		value: "delete",
	},
];

export const peers = [
	{
		coin: "Ark",
		coinClass: "text-logo border-theme-danger-200",
		name: "ROBank",
		peerIp: "194.168.4.67:800",
		type: "Multisig",
		actions,
	},
	{
		coin: "Ethereum",
		coinClass: "border-theme-neutral-300",
		name: "MATBank",
		peerIp: "194.168.4.67:800",
		type: "Multisig",
		actions,
	},
	{
		coin: "Bitcoin",
		coinClass: "text-theme-warning-400 border-theme-warning-200",
		name: "OLEBank",
		peerIp: "194.168.4.67:800",
		type: "Multisig",
		actions,
	},
];

export const networks = [
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
