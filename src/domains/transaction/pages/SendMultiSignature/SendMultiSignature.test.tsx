import { Profile, ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";
import React from "react";
import { Route } from "react-router-dom";
import {
	act,
	env,
	fireEvent,
	getDefaultProfileId,
	renderWithRouter,
	screen,
	syncFees,
	waitFor,
} from "utils/testing-library";

import { SendMultiSignature } from "./SendMultiSignature";

describe("Send MultiSignature Transaction", () => {
	let profile: Profile;
	let wallet: ReadWriteWallet;

	beforeAll(async () => {
		await syncFees();
	});

	beforeEach(() => {
		profile = env.profiles().findById(getDefaultProfileId());
		wallet = profile.wallets().first();
	});

	const renderComponent = async () => {
		const rendered = renderWithRouter(
			<Route path="/profiles/:profileId/wallets/:walletId/send-multisignature">
				<SendMultiSignature />
			</Route>,
			{
				routes: [`/profiles/${profile.id()}/wallets/${wallet.id()}/send-multisignature`],
			},
		);

		await waitFor(() => expect(screen.getByTestId("SendMultiSignature--form-step")).toBeInTheDocument());
		return rendered;
	};

	it("should render", async () => {
		const { asFragment } = await renderComponent();
		expect(screen.queryByTestId("SendMultiSignature--form-step")).toBeInTheDocument();
		expect(screen.queryByTestId("SendMultiSignature--review-step")).not.toBeInTheDocument();
		expect(screen.queryByTestId("AuthenticationStep")).not.toBeInTheDocument();
		expect(screen.queryByTestId("SendMultiSignature--sent-step")).not.toBeInTheDocument();
		expect(asFragment()).toMatchSnapshot();
	});

	it.skip("should render back and continue button", async () => {
		await renderComponent();

		expect(screen.queryByTestId("SendMultiSignature--form-step")).toBeInTheDocument();

		act(() => {
			fireEvent.click(screen.getByTestId("SendMultiSignature__button--continue"));
		});

		expect(screen.queryByTestId("SendMultiSignature--review-step")).toBeInTheDocument();

		act(() => {
			fireEvent.click(screen.getByTestId("SendMultiSignature__button--back"));
		});

		expect(screen.queryByTestId("SendMultiSignature--form-step")).toBeInTheDocument();
	});
});
