/* eslint-disable @typescript-eslint/require-await */
import { Profile } from "@arkecosystem/platform-sdk-profiles";
import { availableNetworksMock } from "domains/network/data";
import React from "react";
import { act, env, fireEvent, getDefaultProfileId, render, RenderResult, waitFor } from "testing-library";

import { CreatePeer } from "./CreatePeer";

let profile: Profile;
const onClose = jest.fn();

describe("CreatePeer", () => {
	beforeAll(() => {
		profile = env.profiles().findById(getDefaultProfileId());
	});

	it("should not render if not open", async () => {
		let rendered: RenderResult;

		await act(async () => {
			rendered = render(
				<CreatePeer isOpen={false} networks={availableNetworksMock} profile={profile} onClose={onClose} />,
			);
		});

		const { asFragment, getByTestId } = rendered;

		expect(() => getByTestId("modal__inner")).toThrow(/Unable to find an element by/);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render create peer modal", async () => {
		let rendered: RenderResult;

		await act(async () => {
			rendered = render(
				<CreatePeer isOpen={true} networks={availableNetworksMock} profile={profile} onClose={onClose} />,
			);
		});

		const { asFragment } = rendered;

		expect(asFragment()).toMatchSnapshot();
	});

	it("should create a peer", async () => {
		let rendered: RenderResult;

		await act(async () => {
			rendered = render(
				<CreatePeer isOpen={true} networks={availableNetworksMock} profile={profile} onClose={onClose} />,
			);
		});

		const { getByTestId } = rendered;

		await act(async () => {
			const selectNetworkInput = getByTestId("SelectNetworkInput__input");

			await fireEvent.change(selectNetworkInput, { target: { value: "Bitco" } });
			await fireEvent.keyDown(selectNetworkInput, { key: "Enter", code: 13 });

			expect(selectNetworkInput).toHaveValue("Bitcoin");

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

			await waitFor(() => expect(onClose).toHaveBeenCalled());
		});
	});
});
