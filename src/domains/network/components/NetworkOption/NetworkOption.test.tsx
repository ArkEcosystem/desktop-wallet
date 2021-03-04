import { Coins } from "@arkecosystem/platform-sdk";
import { CoinNetworkExtended } from "domains/network/data";
import { getNetworkExtendedData } from "domains/network/helpers";
import React from "react";
import { env, getDefaultProfileId, render } from "utils/testing-library";

import { NetworkOption } from "./NetworkOption";

let network: Coins.Network & { extra?: CoinNetworkExtended };
let networkTestnet: Coins.Network & { extra?: CoinNetworkExtended };

describe("NetworkIcon", () => {
	beforeAll(async () => {
		const profile = env.profiles().findById(getDefaultProfileId());

		const wallet1 = await profile.wallets().importByMnemonic("test", "ARK", "ark.mainnet");
		network = wallet1.network();

		network.extra = getNetworkExtendedData({ coin: network.coin(), network: network.id() });

		networkTestnet = profile.wallets().first().network();
		networkTestnet.extra = getNetworkExtendedData({ coin: networkTestnet.coin(), network: networkTestnet.id() });
	});

	it("should render network", () => {
		const { getByTestId } = render(<NetworkOption network={network} />, {});
		expect(getByTestId("NetworkIcon-ARK-ark.mainnet")).toHaveAttribute("aria-label", network.extra?.displayName);
		expect(getByTestId("NetworkIcon__icon")).toBeTruthy();
	});

	it("should not render different class for testnet network", () => {
		const { getByTestId, asFragment } = render(<NetworkOption network={networkTestnet} />, {});
		expect(getByTestId("NetworkIcon-ARK-ark.devnet")).toHaveAttribute(
			"aria-label",
			networkTestnet.extra?.displayName,
		);
		expect(getByTestId("NetworkIcon__icon")).toBeTruthy();
		expect(asFragment).toMatchSnapshot();
	});

	it("should not render network if extended options are not available", () => {
		network.extra = undefined;
		const { getByTestId } = render(<NetworkOption network={network} />, {});
		expect(() => getByTestId("NetworkIcon-ARK-ark.mainnet")).toThrow();
		expect(() => getByTestId("NetworkIcon__icon")).toThrow();
	});
});
