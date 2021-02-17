import { Profile, ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";
import { env, getDefaultProfileId, getDefaultWalletId } from "utils/testing-library";

import { sendTransfer } from "./SendTransfer";

describe("Send Transfer Validations", () => {
	let profile: Profile;
	let wallet: ReadWriteWallet;

	beforeEach(() => {
		profile = env.profiles().findById(getDefaultProfileId());
		wallet = profile.wallets().findById(getDefaultWalletId());
	});

	it("should return required message for empty recipient address", async () => {
		const t = jest.fn((value) => value);
		const validation = sendTransfer(t, env).recipientAddress(wallet.network(), [], false);

		await validation.validate.valid("");

		expect(t).toHaveBeenLastCalledWith("COMMON.VALIDATION.FIELD_REQUIRED", { field: "COMMON.RECIPIENT" });
	});

	it("should return false for empty network", async () => {
		const t = jest.fn((value) => value);
		const validation = sendTransfer(t, env).recipientAddress(undefined, [], false);

		const result = await validation.validate.valid("DDA5nM7KEqLeTtQKv5qGgcnc6dpNBKJNTS");

		expect(result).toBe(false);
	});

	it("should return true for valid address", async () => {
		const t = jest.fn((value) => value);
		const validation = sendTransfer(t, env).recipientAddress(wallet.network(), [], false);

		const result = await validation.validate.valid("DDA5nM7KEqLeTtQKv5qGgcnc6dpNBKJNTS");

		expect(result).toBe(true);
	});
});
