/* eslint-disable @typescript-eslint/require-await */
import { Contracts } from "@arkecosystem/platform-sdk-profiles";
import React from "react";
import { env, fireEvent, getDefaultProfileId, render, screen, waitFor } from "testing-library";

import { translations } from "../../i18n";
import { UpdatePeer } from "./UpdatePeer";

const peer = {
	coin: "ARK",
	network: "ark.mainnet",
	name: "ROBank",
	host: "http://167.114.29.48:4003/api",
	isMultiSignature: false,
};

let profile: Contracts.IProfile;
const onClose = jest.fn();

describe("UpdatePeer", () => {
	beforeAll(() => {
		profile = env.profiles().findById(getDefaultProfileId());
		profile.peers().create("ARK", "ark.mainnet", {
			name: "ROBank",
			host: "http://167.114.29.48:4003/api",
			isMultiSignature: false,
		});
	});

	it("should not render if not open", async () => {
		const { asFragment } = render(<UpdatePeer isOpen={false} peer={peer} profile={profile} onClose={onClose} />);

		expect(() => screen.getByTestId("modal__inner")).toThrow(/Unable to find an element by/);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render update peer modal", async () => {
		const { asFragment } = render(<UpdatePeer isOpen={true} peer={peer} profile={profile} onClose={onClose} />);

		await waitFor(() => expect(screen.getByTestId("PeerForm__submit-button")).toBeDisabled());

		expect(screen.getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_CUSTOM_PEER.TITLE);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should update a peer", async () => {
		render(<UpdatePeer isOpen={true} peer={peer} profile={profile} onClose={onClose} />);

		fireEvent.input(screen.getByTestId("PeerForm__name-input"), { target: { value: "Private" } });
		fireEvent.input(screen.getByTestId("PeerForm__host-input"), {
			target: { value: "http://167.114.29.48:4003/api" },
		});

		await waitFor(() => {
			expect(screen.getByTestId("PeerForm__submit-button")).not.toBeDisabled();
		});

		fireEvent.click(screen.getByTestId("PeerForm__submit-button"));

		await waitFor(() => expect(onClose).toHaveBeenCalled());
	});

	it("should update a peer selecting another network", async () => {
		profile.peers().create("ARK", "ark.devnet", {
			name: "ROBank",
			host: "http://167.114.29.48:4003/api",
			isMultiSignature: false,
		});

		render(<UpdatePeer isOpen={true} peer={peer} profile={profile} onClose={onClose} />);

		const selectNetworkInput = screen.getByTestId("SelectDropdownInput__input");

		await waitFor(() => expect(selectNetworkInput).toHaveValue("ARK Mainnet"));

		// reset input
		fireEvent.change(selectNetworkInput, { target: { value: "" } });

		fireEvent.change(selectNetworkInput, { target: { value: "ARK D" } });
		fireEvent.keyDown(selectNetworkInput, { key: "Enter", code: 13 });

		await waitFor(() => expect(selectNetworkInput).toHaveValue("ARK Devnet"));

		fireEvent.input(screen.getByTestId("PeerForm__name-input"), { target: { value: "Private" } });
		fireEvent.input(screen.getByTestId("PeerForm__host-input"), {
			target: { value: "http://167.114.29.48:4003/api" },
		});

		await waitFor(() => {
			expect(screen.getByTestId("PeerForm__submit-button")).not.toBeDisabled();
		});

		fireEvent.click(screen.getByTestId("PeerForm__submit-button"));

		await waitFor(() => expect(onClose).toHaveBeenCalled());
	});
});
