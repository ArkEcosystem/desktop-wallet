import { Profile } from "@arkecosystem/platform-sdk-profiles";
import React from "react";
import { env, getDefaultProfileId, render } from "utils/testing-library";

import { GridWallet, WalletsList } from "./";

let profile: Profile;
let wallets: GridWallet[];

describe("WalletsList", () => {
	beforeAll(() => {
		profile = env.profiles().findById(getDefaultProfileId());

		wallets = profile
			.wallets()
			.values()
			.map((wallet) => ({ wallet: wallet, actions: [] }));
	});

	it("should render", () => {
		const { asFragment, getByTestId } = render(<WalletsList wallets={wallets} />);

		expect(getByTestId("WalletsList")).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should not render if isVisible is false", () => {
		const { asFragment, getByTestId } = render(<WalletsList wallets={wallets} isVisible={false} />);

		expect(() => getByTestId("WalletsList")).toThrow();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render hidden", () => {
		const { asFragment, getByTestId } = render(<WalletsList wallets={wallets} isVisible={false} />);

		expect(() => getByTestId("WalletsList")).toThrowError(/Unable to find/);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render with view more button", () => {
		const { asFragment, getByTestId } = render(<WalletsList wallets={wallets} hasMore={true} />);

		expect(getByTestId("WalletsList")).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render empty block", () => {
		const { asFragment, getByTestId } = render(<WalletsList wallets={[]} />);

		expect(getByTestId("EmptyBlock")).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render loading state", () => {
		const { asFragment, getAllByTestId } = render(<WalletsList wallets={[]} isLoading={true} />);

		expect(getAllByTestId("TableRow").length).toBeGreaterThan(0);
		expect(asFragment()).toMatchSnapshot();
	});
});
