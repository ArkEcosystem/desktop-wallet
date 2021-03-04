/* eslint-disable @typescript-eslint/require-await */
import { env } from "utils/testing-library";

import { sendTransfer } from "./SendTransfer";

describe("Send transfer validations", () => {
	it("should validate recipientAddress", async () => {
		const network = env.profiles().first().wallets().first().network();
		const validation = sendTransfer(jest.fn(), env).recipientAddress(network, [{}], false);
		await expect(validation.validate.valid(" ")).resolves.toBe(true);
	});

	it("should falie validate recipientAddress", async () => {
		const translationMock = jest.fn((i18nString: string) => i18nString);
		const network = env.profiles().first().wallets().first().network();
		const validation = sendTransfer(translationMock, env).recipientAddress(network, [], false);
		await expect(validation.validate.valid(null)).resolves.not.toBeUndefined();
	});
});
