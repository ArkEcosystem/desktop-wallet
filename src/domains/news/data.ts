export const AVAILABLE_CATEGORIES = ["Technical", "Marketing", "Community", "Emergency"];

export const assets = [
	{
		id: "ark.mainnet",
		name: "ARK",
		isSelected: true,
		coin: "ARK",
	},
	{
		id: "eth.mainnet",
		name: "Ethereum",
		isSelected: false,
		coin: "ETH",
	},
	{
		id: "btc.livenet",
		name: "Bitcoin",
		isSelected: false,
		coin: "BTC",
	},
	{
		id: "lsk.mainnet",
		name: "Lisk",
		isSelected: false,
		coin: "LSK",
	},
];

export const coins: any = {
	eth: {
		name: "Ethereum",
		coin: "ETH",
		network: "eth.mainnet",
	},
	ark: {
		name: "ARK Ecosystem",
		coin: "ARK",
		network: "ark.mainnet",
	},
	btc: {
		name: "Bitcoin",
		coin: "BTC",
		network: "btc.livenet",
	},
	lsk: {
		name: "Lisk",
		coin: "LSK",
		network: "lsk.mainnet",
	},
};
