import React from "react";

import { TransactionTable } from "./TransactionTable";
import { Transaction } from "./TransactionTable.models";

export default { title: "Domains / Transaction / Components / TransactionTable" };

const transactions: Transaction[] = [
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

export const Default = () => <TransactionTable transactions={transactions} />;

export const WithCurrency = () => <TransactionTable transactions={transactions} currencyRate="2" />;

export const WithSign = () => (
	<TransactionTable
		transactions={[
			{
				id: "ee4175091d9f4dacf5fed213711c3e0e4cc371e37afa7bce0429d09bcf3ecefe",
				confirmations: "100",
				timestamp: "17 Mar 2020 10:22:05",
				type: "transfer",
				sender: "ASuusXSW9kfWnicScSgUTjttP6T9GQ3kqT",
				recipient: "ASuusXSW9kfWnicScSgUTjttP6T9GQ3kqT",
				amount: "52",
				fee: "0.2",
				vendorField: "Test",
				isSent: true,
				isMultiSignature: true,
				isSignaturePending: true,
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
				isSent: true,
				isMultiSignature: true,
				isSignaturePending: false,
			},
		]}
		showSignColumn
	/>
);
