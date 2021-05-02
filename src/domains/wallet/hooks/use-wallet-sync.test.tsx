/* eslint-disable @typescript-eslint/require-await */
import { Contracts } from "@arkecosystem/platform-sdk-profiles";
import { act, renderHook } from "@testing-library/react-hooks";
import { env } from "utils/testing-library";

import { useWalletSync } from "./use-wallet-sync";

let profile: Contracts.IProfile;

describe("useWalletSync", () => {
	beforeAll(async () => {
		profile = env.profiles().first();
		await env.profiles().restore(profile);
		await profile.sync();
	});

	it("#syncAll", async () => {
		const {
			result: { current },
		} = renderHook(() => useWalletSync({ profile, env }));

		const wallet = profile.wallets().first();
		const network = wallet.network();

		const mockAllowVoting = jest.spyOn(network, "allowsVoting").mockReturnValue(false);

		await act(async () => {
			expect(current.syncAll(wallet)).resolves.toBeTruthy();
		});

		mockAllowVoting.mockRestore();
	});
});
