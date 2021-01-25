import { Profile, ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";
import Transport from "@ledgerhq/hw-transport";
import { createTransportReplayer, RecordStore } from "@ledgerhq/hw-transport-mocker";
import { env, getDefaultProfileId } from "utils/testing-library";

import { searchAddresses } from "./scanner.utils";

describe("Scanner Utils", () => {
	let profile: Profile;
	let wallet: ReadWriteWallet;
	let transport: typeof Transport;

	beforeEach(() => {
		profile = env.profiles().findById(getDefaultProfileId());
		wallet = profile.wallets().first();
		transport = createTransportReplayer(RecordStore.fromString(""));
	});

	it("should scan without custom derivation modes", async () => {
		const publicKeyPaths = new Map([
			["44'/1'/0'/0/0", "027716e659220085e41389efc7cf6a05f7f7c659cf3db9126caabce6cda9156582"],
			["44'/1'/1'/0/0", "020aac4ec02d47d306b394b79d3351c56c1253cd67fe2c1a38ceba59b896d584d1"],
		]);

		jest.spyOn(wallet.coin().ledger(), "getPublicKey").mockImplementation((path) =>
			Promise.resolve(publicKeyPaths.get(path)!),
		);

		const result = await searchAddresses([0, 1], wallet.coin(), profile);

		expect(result).toEqual({
			DJpFwW39QnQvQRQJF2MCfAoKvsX4DJ28jq: {
				address: "DJpFwW39QnQvQRQJF2MCfAoKvsX4DJ28jq",
				path: "44'/1'/0'/0/0",
				index: 0,
				timestamp: 1593561600000,
			},
			DRgF3PvzeGWndQjET7dZsSmnrc6uAy23ES: {
				address: "DRgF3PvzeGWndQjET7dZsSmnrc6uAy23ES",
				path: "44'/1'/1'/0/0",
				index: 1,
				timestamp: 1593561600000,
			},
		});
	});
});
