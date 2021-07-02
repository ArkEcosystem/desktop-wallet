import { Networks } from "@arkecosystem/platform-sdk";
import { CoinNetworkExtended } from "domains/network/data";
import { getNetworkExtendedData } from "domains/network/helpers";
import React from "react";
import { env, fireEvent, getDefaultProfileId, MNEMONICS, render } from "utils/testing-library";

import { NetworkOption } from "./NetworkOption";

let network: Networks.Network & { extra?: CoinNetworkExtended };
let networkTestnet: Networks.Network & { extra?: CoinNetworkExtended };

describe("NetworkIcon", () => {
	beforeAll(async () => {
		const profile = env.profiles().findById(getDefaultProfileId());
		await env.profiles().restore(profile);
		await profile.sync();

		const wallet1 = await profile.walletFactory().fromMnemonicWithBIP39({
			coin: "ARK",
			mnemonic: MNEMONICS[0],
			network: "ark.mainnet",
		});

		network = wallet1.network();

		network.extra = getNetworkExtendedData(network.id());

		networkTestnet = profile.wallets().first().network();
		networkTestnet.extra = getNetworkExtendedData(networkTestnet.id());
	});

	it("should render network", () => {
		const { getByTestId } = render(<NetworkOption network={network} />, {});

		expect(getByTestId("NetworkIcon-ARK-ark.mainnet")).toHaveAttribute("aria-label", network.extra?.displayName);
		expect(getByTestId("NetworkIcon__icon")).toBeTruthy();
	});

	it("should call onClick callback", () => {
		const onClick = jest.fn();

		const { getByTestId } = render(<NetworkOption network={network} onClick={onClick} />, {});

		expect(getByTestId("NetworkIcon-ARK-ark.mainnet")).toHaveAttribute("aria-label", network.extra?.displayName);
		expect(getByTestId("NetworkIcon__icon")).toBeTruthy();

		fireEvent.click(getByTestId("SelectNetwork__NetworkIcon--container"));

		expect(onClick).toHaveBeenCalled();
	});

	it("should not call onClick callback if disabled", () => {
		const onClick = jest.fn();

		const { getByTestId } = render(<NetworkOption network={network} onClick={onClick} disabled />, {});

		expect(getByTestId("NetworkIcon-ARK-ark.mainnet")).toHaveAttribute("aria-label", network.extra?.displayName);
		expect(getByTestId("NetworkIcon__icon")).toBeTruthy();

		fireEvent.click(getByTestId("SelectNetwork__NetworkIcon--container"));

		expect(onClick).not.toHaveBeenCalled();
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
