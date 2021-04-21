/* eslint-disable @typescript-eslint/require-await */
import { Contracts } from "@arkecosystem/platform-sdk-profiles";
import { renderHook } from "@testing-library/react-hooks";
import { env, getDefaultProfileId } from "utils/testing-library";

import { useProfileAddresses } from "./use-profile-addresses";

let profile: Contracts.IProfile;

describe("useProfileAddresses", () => {
	beforeAll(async () => {
		profile = env.profiles().findById(getDefaultProfileId());
		await profile.restore();
		profile
			.contacts()
			.last()
			.setAddresses([
				{
					name: "test",
					address: "D8rr7B1d6TL6pf14LgMz4sKp1VBMs6YUYD",
					coin: "ARK",
					network: "ark.devnet",
				},
			]);
	});

	it("should return all available addresses", async () => {
		const { result } = renderHook(() => useProfileAddresses({ profile }));

		expect(result.current.allAddresses).toHaveLength(3);
		expect(result.current.contactAddresses).toHaveLength(1);
		expect(result.current.profileAddresses).toHaveLength(2);
	});

	it("should filter address by selected network", async () => {
		const wallet = await profile.wallets().importByMnemonic("test", "ARK", "ark.mainnet");
		const { result } = renderHook(() => useProfileAddresses({ profile, network: wallet.network() }));

		expect(result.current.allAddresses).toHaveLength(1);
		expect(result.current.contactAddresses).toHaveLength(0);
		expect(result.current.profileAddresses).toHaveLength(1);
	});
});
