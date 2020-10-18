import { Profile, ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";
import React from "react";
import { env, getDefaultProfileId, render, screen, waitFor } from "utils/testing-library";

import { Signatures } from "./Signatures";

describe("Signatures", () => {
	let profile: Profile;
	let wallet: ReadWriteWallet;

	beforeEach(() => {
		profile = env.profiles().findById(getDefaultProfileId());
		wallet = profile.wallets().first();
	});

	it("should render", async () => {
		jest.spyOn(wallet.transaction(), "isAwaitingSignatureByPublicKey").mockImplementation((_, publicKey) => {
			if (wallet.publicKey() === publicKey) {
				return true;
			}
			return false;
		});

		const { container } = render(
			<Signatures transactionId="1" wallet={wallet} publicKeys={[profile.wallets().last().publicKey()!]} />,
		);

		await waitFor(() => expect(screen.getAllByTestId("Signatures__participant-status")).toHaveLength(2));

		expect(screen.getAllByTestId("Signatures__signed-badge")).toHaveLength(1);
		expect(screen.getAllByTestId("Signatures__waiting-badge")).toHaveLength(1);

		expect(container).toMatchSnapshot();
	});

	it("should render with final signature", async () => {
		jest.spyOn(wallet.transaction(), "isAwaitingSignatureByPublicKey").mockImplementation(() => {
			throw new Error("Failed");
		});

		const { container } = render(
			<Signatures transactionId="1" wallet={wallet} publicKeys={[profile.wallets().last().publicKey()!]} />,
		);

		await waitFor(() => expect(screen.getAllByTestId("Signatures__participant-status")).toHaveLength(2));

		expect(screen.getAllByTestId("Signatures__signed-badge")).toHaveLength(2);

		expect(container).toMatchSnapshot();
	});
});
