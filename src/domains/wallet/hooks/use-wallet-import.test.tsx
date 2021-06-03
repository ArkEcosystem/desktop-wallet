/* eslint-disable @typescript-eslint/require-await */
import { Contracts } from "@arkecosystem/platform-sdk-profiles";
import { act, renderHook } from "@testing-library/react-hooks";
import { env } from "utils/testing-library";

import { useWalletImport } from "./use-wallet-import";

let profile: Contracts.IProfile;

describe("useWalletImport", () => {
	beforeAll(async () => {
		profile = env.profiles().first();
		await env.profiles().restore(profile);
		await profile.sync();
	});

	it("#encryptedWif", async () => {
		const {
			result: { current },
		} = renderHook(() => useWalletImport({ profile }));
		const wallet = profile.wallets().first();
		const network = wallet.network();

		const mockEncryptedWif = jest.spyOn(profile.walletFactory(), "fromWIF").mockImplementation(() => {
			throw new Error("error");
		});

		await act(async () => {
			expect(
				current.importWalletByType({ network, type: "encryptedWif", value: "password", encryptedWif: "wif" }),
			).rejects.toBeTruthy();
		});

		mockEncryptedWif.mockRestore();

		await act(async () => {
			expect(
				current.importWalletByType({ network, type: "uknown", value: "password", encryptedWif: "wif" }),
			).resolves.toBeUndefined();
		});
	});
});
