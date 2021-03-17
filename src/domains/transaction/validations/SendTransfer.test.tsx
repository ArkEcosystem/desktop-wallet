/* eslint-disable @typescript-eslint/require-await */
import { BigNumber } from "@arkecosystem/platform-sdk-support";
import { env } from "utils/testing-library";

import { sendTransfer } from "./SendTransfer";

let translationMock: any;
let network: any;

describe("Send transfer validations", () => {
	beforeAll(() => {
		translationMock = jest.fn((i18nString: string) => i18nString);
		network = env.profiles().first().wallets().first().network();
	});

	it("recipientAddress", async () => {
		const withoutNetwork = sendTransfer(translationMock, env).recipientAddress(undefined, [], false);
		await expect(withoutNetwork.validate.valid("")).resolves.toBe(false);

		const noAddressWithRecipients = sendTransfer(translationMock, env).recipientAddress(network, [{}], false);
		await expect(noAddressWithRecipients.validate.valid("")).resolves.toBe(true);

		const noAddressWithoutRecipients = sendTransfer(translationMock, env).recipientAddress(network, [], false);
		await expect(noAddressWithoutRecipients.validate.valid("")).resolves.toBe("COMMON.VALIDATION.FIELD_REQUIRED");
	});

	it("amount", () => {
		const noBalance = sendTransfer(translationMock, env).amount(network, BigNumber.ZERO, [], false);
		expect(noBalance.validate.valid("1")).toBe("TRANSACTION.VALIDATION.LOW_BALANCE");

		const noAmount = sendTransfer(translationMock, env).amount(network, BigNumber.ONE, [], false);
		expect(noAmount.validate.valid("")).toBe("COMMON.VALIDATION.FIELD_REQUIRED");

		const amountTooSmall = sendTransfer(translationMock, env).amount(network, BigNumber.ONE, [], false);
		expect(amountTooSmall.validate.valid("0")).toBe("TRANSACTION.VALIDATION.AMOUNT_BELOW_MINIMUM");
	});
});
