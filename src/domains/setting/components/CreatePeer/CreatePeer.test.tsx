/* eslint-disable @typescript-eslint/require-await */
import { Contracts } from "@arkecosystem/platform-sdk-profiles";
import React from "react";
import { env, fireEvent, getDefaultProfileId, render, screen, waitFor } from "testing-library";

import { CreatePeer } from "./CreatePeer";

let profile: Contracts.IProfile;
const onClose = jest.fn();

describe("CreatePeer", () => {
	beforeAll(() => {
		profile = env.profiles().findById(getDefaultProfileId());
	});

	it("should not render if not open", async () => {
		const { asFragment } = render(<CreatePeer isOpen={false} profile={profile} onClose={onClose} />);

		expect(() => screen.getByTestId("modal__inner")).toThrow(/Unable to find an element by/);

		expect(asFragment()).toMatchSnapshot();
	});

	it("should render create peer modal", async () => {
		const { asFragment } = render(<CreatePeer isOpen={true} profile={profile} onClose={onClose} />);

		await waitFor(() => expect(screen.getByTestId("PeerForm__submit-button")).toBeDisabled());

		expect(asFragment()).toMatchSnapshot();
	});

	it("should create a peer", async () => {
		render(<CreatePeer isOpen={true} profile={profile} onClose={onClose} />);

		const selectNetworkInput = screen.getByTestId("SelectDropdownInput__input");

		fireEvent.change(selectNetworkInput, { target: { value: "ARK D" } });
		fireEvent.keyDown(selectNetworkInput, { key: "Enter", code: 13 });

		await waitFor(() => expect(selectNetworkInput).toHaveValue("ARK Devnet"));

		fireEvent.input(screen.getByTestId("PeerForm__name-input"), { target: { value: "ROBank" } });
		fireEvent.input(screen.getByTestId("PeerForm__host-input"), {
			target: { value: "http://167.114.29.48:4003/api" },
		});

		await waitFor(() => expect(screen.getByTestId("PeerForm__submit-button")).not.toBeDisabled());

		fireEvent.click(screen.getByTestId("PeerForm__submit-button"));

		await waitFor(() => expect(onClose).toHaveBeenCalled());
	});
});
