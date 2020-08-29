import { RequestMock } from "testcafe";

export const walletMock = (address: string) =>
	RequestMock()
		.onRequestTo(`https://dwallets.ark.io/api/wallets/${address}`)
		.respond(
			{
				data: {
					address: "D5sRKWckH4rE1hQ9eeMeHAepgyC3cvJtwb",
					nonce: "0",
					balance: "2500000000",
					isDelegate: false,
					isResigned: false,
					attributes: {},
				},
			},
			200,
			{
				"access-control-allow-origin": "*",
			},
		);

export const transactionsMock = () =>
	RequestMock()
		.onRequestTo("https://dwallets.ark.io/api/transactions")
		.respond(
			{
				data: {
					accept: ["transaction-id"],
					broadcast: ["transaction-id"],
					excess: [],
					invalid: [],
				},
			},
			200,
			{
				"access-control-allow-origin": "*",
			},
		);
