export const networks = [
	{
		name: "Ark",
		isSelected: true,
	},
	{
		name: "Ethereum",
		isSelected: true,
	},
	{
		name: "Bitcoin",
		isSelected: false,
	},
];

// Transaction History data
export const transactions = [
	{
		id: "ee4175091d9f4dacf5fed213711c3e0e4cc371e37afa7bce0429d09bcf3ecefe",
		confirmations: "10",
		timestamp: "17 Mar 2020 22:02:10",
		type: "transfer",
		sender: "ASuusXSW9kfWnicScSgUTjttP6T9GQ3kqT",
		recipient: "ASuusXSW9kfWnicScSgUTjttP6T9GQ3kqT",
		amount: "100",
		fee: "21",
		vendorField: "Test",
		isSent: true,
	},
	{
		id: "ee4175091d9f4dacf5fed213711c3e0e4cc371e37afa7bce0429d09bcf3ecefe",
		confirmations: "5",
		timestamp: "17 Mar 2020 10:22:05",
		type: "multiPayment",
		sender: "ASuusXSW9kfWnicScSgUTjttP6T9GQ3kqT",
		recipient: "",
		recipients: [
			{
				amount: "0.1",
				address: "ASuusXSW9kfWnicScSgUTjttP6T9GQ3kqT",
			},
			{
				amount: "0.2",
				address: "ASuusXSW9kfWnicScSgUTjttP6T9GQ3kqT",
			},
		],
		amount: "52",
		fee: "0.2",
		isSent: true,
	},
	{
		id: "ee4175091d9f4dacf5fed213711c3e0e4cc371e37afa7bce0429d09bcf3ecefe",
		confirmations: "100",
		timestamp: "17 Mar 2020 10:22:05",
		type: "secondSignature",
		sender: "ASuusXSW9kfWnicScSgUTjttP6T9GQ3kqT",
		recipient: "ASuusXSW9kfWnicScSgUTjttP6T9GQ3kqT",
		amount: "0",
		fee: "0.1",
		isSent: true,
	},
	{
		id: "ee4175091d9f4dacf5fed213711c3e0e4cc371e37afa7bce0429d09bcf3ecefe",
		confirmations: "100",
		timestamp: "17 Mar 2020 10:22:05",
		type: "vote",
		sender: "ASuusXSW9kfWnicScSgUTjttP6T9GQ3kqT",
		recipient: "ASuusXSW9kfWnicScSgUTjttP6T9GQ3kqT",
		amount: "0",
		fee: "0.1",
		isSent: true,
	},
	{
		id: "ee4175091d9f4dacf5fed213711c3e0e4cc371e37afa7bce0429d09bcf3ecefe",
		confirmations: "100",
		timestamp: "17 Mar 2020 10:22:05",
		type: "delegateRegistration",
		sender: "ASuusXSW9kfWnicScSgUTjttP6T9GQ3kqT",
		recipient: "ASuusXSW9kfWnicScSgUTjttP6T9GQ3kqT",
		amount: "0",
		fee: "0.1",
		isSent: true,
	},
	{
		id: "ee4175091d9f4dacf5fed213711c3e0e4cc371e37afa7bce0429d09bcf3ecefe",
		confirmations: "100",
		timestamp: "17 Mar 2020 10:22:05",
		type: "transfer",
		sender: "ASuusXSW9kfWnicScSgUTjttP6T9GQ3kqT",
		recipient: "ASuusXSW9kfWnicScSgUTjttP6T9GQ3kqT",
		amount: "52",
		fee: "0.2",
		isSent: false,
	},
];

export const portfolioPercentages = [
	{
		label: "ARK",
		value: 40,
		color: "danger-500",
	},
	{
		label: "BTC",
		value: 25,
		color: "warning-500",
	},
	{
		label: "ETH",
		value: 20,
		color: "primary-500",
	},
	{
		label: "Other",
		value: 15,
		color: "neutral-400",
	},
];

export const balances = [
	{ name: "Mon", label: "22 Jun, 2020", usd: 1000, btc: 2400, formatted: { usd: "1,000", btc: "0.26" } },
	{ name: "Tue", label: "23 Jun, 2020", usd: 3000, btc: 5400, formatted: { usd: "3,000", btc: "0.58" } },
	{ name: "Wed", label: "24 Jun, 2020", usd: 15100, btc: 1398, formatted: { usd: "15,100", btc: "0.15" } },
	{ name: "Thu", label: "25 Jun, 2020", usd: 4000, btc: 9800, formatted: { usd: "4,000", btc: "1.06" } },
	{ name: "Fri", label: "26 Jun, 2020", usd: 11200, btc: 2000, formatted: { usd: "11,200", btc: "0.22" } },
	{ name: "Sat", label: "27 Jun, 2020", usd: 3000, btc: 4800, formatted: { usd: "3,000", btc: "0.52" } },
	{ name: "Sun", label: "28 Jun, 2020", usd: 8000, btc: 18000, formatted: { usd: "8,000", btc: "2.16" } },
];
