/* eslint-disable @typescript-eslint/require-await */
import { env } from "utils/testing-library";

import { sendTransfer } from "./SendTransfer";

describe("Send transfer validations", () => {
	it("should validate recipientAddress", () => {
		const network = env.profiles().first().wallets().first().network();
		const validation = sendTransfer(jest.fn(), env).recipientAddress(network, [{}], false);
		expect(validation.validate.valid(" ")).resolves.toBe(true);
	});

	it("should falie validate recipientAddress", () => {
		const network = env.profiles().first().wallets().first().network();
		const validation = sendTransfer(jest.fn(), env).recipientAddress(network, [], false);
		expect(validation.validate.valid(null)).resolves.toBe(true);
	});
});
