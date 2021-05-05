/* eslint-disable @typescript-eslint/require-await */
import { Contracts } from "@arkecosystem/platform-sdk-profiles";
import { BigNumber } from "@arkecosystem/platform-sdk-support";
import { env, getDefaultProfileId } from "utils/testing-library";

import { sendTransfer } from "./SendTransfer";

let profile: Contracts.IProfile;
let translationMock: any;
let network: any;

describe("Send transfer validations", () => {
	beforeAll(async () => {
		profile = env.profiles().findById(getDefaultProfileId());
		await env.profiles().restore(profile);
		await profile.sync();

		translationMock = jest.fn((i18nString: string) => i18nString);
		network = env.profiles().first().wallets().first().network();
	});

	it("recipientAddress", async () => {
		const withoutNetwork = sendTransfer(translationMock).recipientAddress(profile, undefined, [], false);
		await expect(withoutNetwork.validate.valid("")).resolves.toBe(false);

		const noAddressWithRecipients = sendTransfer(translationMock).recipientAddress(profile, network, [{}], false);
		await expect(noAddressWithRecipients.validate.valid("")).resolves.toBe(true);

		const noAddressWithoutRecipients = sendTransfer(translationMock).recipientAddress(profile, network, [], false);
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
