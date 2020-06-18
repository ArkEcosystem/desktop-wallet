




export default {
	title: "Settings / Components / PeerListItem",
};

const data = [
	{
		coin: "Btc",
		coinClassName: "text-theme-warning-400 border-theme-warning-200",
		name: "ROBank",
		peerIp: "194.168.4.67:800",
		type: "Multisig",
		actions: [
			{
				label: "Edit",
				value: "edit",
			},
			{
				label: "Delete",
				value: "delete",
			},
		],
	},
];

const columns = [
	{
		Header: "Network",
	},
	{
		Header: "Name",
	},
	{
		Header: "Peer IP",
	},
	{
		Header: "Type",
	},
];
