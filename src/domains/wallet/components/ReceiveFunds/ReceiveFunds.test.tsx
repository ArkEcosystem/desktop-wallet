/* eslint-disable @typescript-eslint/require-await */
import { Network } from "@arkecosystem/platform-sdk/dist/coins";
import React from "react";
import { act, env, fireEvent, getDefaultProfileId, getDefaultWalletId, render, waitFor } from "utils/testing-library";

import { ReceiveFunds } from "./ReceiveFunds";

let network: Network;

describe("ReceiveFunds", () => {
	beforeEach(() => {
		const profile = env.profiles().findById(getDefaultProfileId());
		const wallet = profile.wallets().findById(getDefaultWalletId());
		network = wallet.network();
	});

	it("should render without a wallet name", async () => {
		const { asFragment, queryAllByTestId } = render(
			<ReceiveFunds isOpen={true} address="abc" icon="ARK" network={network} />,
		);

		await waitFor(() => expect(queryAllByTestId("ReceiveFunds__name")).toHaveLength(0));
		await waitFor(() => expect(queryAllByTestId("ReceiveFunds__address")).toHaveLength(1));
		await waitFor(() => expect(queryAllByTestId("ReceiveFunds__qrcode")).toHaveLength(1));

		expect(asFragment()).toMatchSnapshot();
	});

	it("should not render qrcode without an address", async () => {
		// @ts-ignore
		const { asFragment, queryAllByTestId } = render(<ReceiveFunds isOpen={true} icon="ARK" network={network} />);

		await waitFor(() => expect(queryAllByTestId("ReceiveFunds__name")).toHaveLength(0));
		await waitFor(() => expect(queryAllByTestId("ReceiveFunds__address")).toHaveLength(1));
		await waitFor(() => expect(queryAllByTestId("ReceiveFunds__qrcode")).toHaveLength(0));

		expect(asFragment()).toMatchSnapshot();
	});

	it("should render with a wallet name", async () => {
		const { asFragment, queryAllByTestId } = render(
			<ReceiveFunds isOpen={true} address="abc" icon="ARK" name="My Wallet" network={network} />,
		);

		await waitFor(() => expect(queryAllByTestId("ReceiveFunds__name")).toHaveLength(1));
		await waitFor(() => expect(queryAllByTestId("ReceiveFunds__address")).toHaveLength(1));
		await waitFor(() => expect(queryAllByTestId("ReceiveFunds__qrcode")).toHaveLength(1));

		expect(asFragment()).toMatchSnapshot();
	});

	it("should handle close", async () => {
		const onClose = jest.fn();

		const { getByTestId, queryAllByTestId } = render(
			<ReceiveFunds
				isOpen={true}
				address="abc"
				icon="ARK"
				name="My Wallet"
				network={network}
				onClose={onClose}
			/>,
		);

		await waitFor(() => expect(queryAllByTestId("ReceiveFunds__name")).toHaveLength(1));
		await waitFor(() => expect(queryAllByTestId("ReceiveFunds__address")).toHaveLength(1));
		await waitFor(() => expect(queryAllByTestId("ReceiveFunds__qrcode")).toHaveLength(1));

		act(() => {
			fireEvent.click(getByTestId("modal__close-btn"));
		});
		expect(onClose).toHaveBeenCalled();
	});

	it("should open qr code form", async () => {
		const { getByTestId, queryAllByTestId } = render(
			<ReceiveFunds isOpen={true} address="abc" icon="ARK" name="My Wallet" network={network} />,
		);

		await waitFor(() => expect(queryAllByTestId("ReceiveFunds__name")).toHaveLength(1));
		await waitFor(() => expect(queryAllByTestId("ReceiveFunds__address")).toHaveLength(1));
		await waitFor(() => expect(queryAllByTestId("ReceiveFunds__qrcode")).toHaveLength(1));

		act(() => {
			fireEvent.click(getByTestId("ReceiveFunds__toggle"));
		});

		await waitFor(() => expect(getByTestId("ReceiveFundsForm__amount")).toHaveValue(""));
		await waitFor(() => expect(getByTestId("ReceiveFundsForm__smartbridge")).toHaveValue(""));
		await waitFor(() => expect(getByTestId("ReceiveFundsForm__uri")).toHaveTextContent("ark:abc"));
	});
});
