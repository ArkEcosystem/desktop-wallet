/* eslint-disable @typescript-eslint/require-await */
import { availableNetworksMock as networks } from "domains/network/data";
import React from "react";
import { act, fireEvent, render, RenderResult, waitFor } from "testing-library";

import { PeerForm } from "./PeerForm";

const peer = {
	coin: "ARK",
	network: "ark.devnet",
	name: "ROBank",
	host: "http://167.114.29.48:4003/api",
	isMultiSignature: false,
};

const onSave = jest.fn();

describe("PeerForm", () => {
	it("should render", async () => {
		let rendered: RenderResult;

		await act(async () => {
			rendered = render(<PeerForm networks={networks} onSave={onSave} />);
		});

		const { asFragment } = rendered;

		expect(asFragment()).toMatchSnapshot();
	});

	it("should select network", async () => {
		let rendered: RenderResult;

		await act(async () => {
			rendered = render(<PeerForm networks={networks} onSave={onSave} />);
		});

		const { getByTestId } = rendered;

		await act(async () => {
			const selectNetworkInput = getByTestId("SelectDropdownInput__input");

			await fireEvent.change(selectNetworkInput, { target: { value: "ark" } });
			await fireEvent.keyDown(selectNetworkInput, { key: "Enter", code: 13 });

			await waitFor(() => expect(selectNetworkInput).toHaveValue("ARK Mainnet"));
		});
	});

	it("should handle save", async () => {
		let rendered: RenderResult;

		await act(async () => {
			rendered = render(<PeerForm networks={networks} onSave={onSave} />);
		});

		const { getByTestId } = rendered;

		await act(async () => {
			const selectNetworkInput = getByTestId("SelectDropdownInput__input");

			await fireEvent.change(selectNetworkInput, { target: { value: "ark" } });
			await fireEvent.keyDown(selectNetworkInput, { key: "Enter", code: 13 });

			await waitFor(() => expect(selectNetworkInput).toHaveValue("ARK Mainnet"));

			await fireEvent.input(getByTestId("PeerForm__name-input"), { target: { value: "ROBank" } });
			await fireEvent.input(getByTestId("PeerForm__host-input"), {
				target: { value: "http://167.114.29.48:4003/api" },
			});

			const submitButton = getByTestId("PeerForm__submit-button");
			expect(submitButton).toBeTruthy();
			await waitFor(() => {
				expect(submitButton).not.toHaveAttribute("disabled");
			});

			await fireEvent.click(submitButton);

			await waitFor(() => expect(onSave).toHaveBeenCalled());
		});
	});

	it("should render the peer on the form", async () => {
		let rendered: RenderResult;

		await act(async () => {
			rendered = render(<PeerForm networks={networks} peer={peer} onSave={onSave} />);
		});

		const { asFragment, getByTestId } = rendered;

		expect(getByTestId("PeerForm__name-input")).toHaveValue(peer.name);
		expect(getByTestId("PeerForm__host-input")).toHaveValue(peer.host);

		expect(asFragment()).toMatchSnapshot();
	});

	it("should error if host already exists", async () => {
		let rendered: RenderResult;

		const validateHost = () => "already exists";

		await act(async () => {
			rendered = render(<PeerForm networks={networks} onSave={onSave} onValidateHost={validateHost} />);
		});

		const { getByTestId } = rendered;

		await act(async () => {
			const selectNetworkInput = getByTestId("SelectDropdownInput__input");

			await fireEvent.input(getByTestId("PeerForm__name-input"), { target: { value: "ROBank" } });
			await fireEvent.input(getByTestId("PeerForm__host-input"), {
				target: { value: "http://167.114.29.48:4005/api" },
			});

			await fireEvent.change(selectNetworkInput, { target: { value: "ark" } });
			await fireEvent.keyDown(selectNetworkInput, { key: "Enter", code: 13 });

			await waitFor(() => expect(selectNetworkInput).toHaveValue("ARK Mainnet"));

			const submitButton = getByTestId("PeerForm__submit-button");
			expect(submitButton).toBeTruthy();
			await waitFor(() => {
				expect(submitButton).toHaveAttribute("disabled");
			});
		});
	});
});
