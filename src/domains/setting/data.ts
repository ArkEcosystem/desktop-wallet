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
		coin: "ARK",
		coinClass: "text-logo border-theme-danger-light",
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
		icon: "ARK",
		name: "ARK Ecosystem",
		className: "text-theme-danger-400 border-theme-danger-light",
	},
	{
		icon: "BIND",
		name: "Compendia",
		className: "text-theme-danger-400 border-theme-danger-light",
	},
	{
		icon: "BTC",
		name: "Bitcoin",
		className: "text-theme-warning-400 border-theme-warning-200",
	},
	{
		icon: "ETH",
		name: "Ethereum",
		className: "text-theme-neutral-800 border-theme-neutral-600",
	},
	{
		icon: "LSK",
		name: "Lisk",
		className: "text-theme-primary border-theme-primary-400",
	},
	{
		icon: "XRP",
		name: "Ripple",
		className: "text-theme-primary-dark border-theme-primary-500",
	},
];
