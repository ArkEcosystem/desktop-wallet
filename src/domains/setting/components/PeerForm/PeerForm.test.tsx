/* eslint-disable @typescript-eslint/require-await */
import { Contracts } from "@arkecosystem/platform-sdk-profiles";
import React from "react";
import { env, fireEvent, getDefaultProfileId, render, screen, waitFor } from "testing-library";

import { PeerForm } from "./PeerForm";

const peer = {
	coin: "ARK",
	network: "ark.devnet",
	name: "ROBank",
	host: "http://167.114.29.48:4003/api",
	isMultiSignature: false,
};

const onSave = jest.fn();

let profile: Contracts.IProfile;

describe("PeerForm", () => {
	beforeAll(() => {
		profile = env.profiles().findById(getDefaultProfileId());
	});

	it("should render", async () => {
		const { asFragment } = render(<PeerForm profile={profile} onSave={onSave} />);

		await waitFor(() => {
			expect(screen.getByTestId("PeerForm__submit-button")).not.toBeDisabled();
		});

		expect(asFragment()).toMatchSnapshot();
	});

	it("should select network", async () => {
		render(<PeerForm profile={profile} onSave={onSave} />);

		const selectNetworkInput = screen.getByTestId("SelectDropdownInput__input");

		fireEvent.input(selectNetworkInput, { target: { value: "ark" } });
		fireEvent.keyDown(selectNetworkInput, { key: "Enter", code: 13 });

		await waitFor(() => {
			expect(selectNetworkInput).toHaveValue("ARK Mainnet");
		});
	});

	it("should handle save", async () => {
		render(<PeerForm profile={profile} onSave={onSave} />);

		const selectNetworkInput = screen.getByTestId("SelectDropdownInput__input");

		fireEvent.input(selectNetworkInput, { target: { value: "ark" } });
		fireEvent.keyDown(selectNetworkInput, { key: "Enter", code: 13 });

		await waitFor(() => {
			expect(selectNetworkInput).toHaveValue("ARK Mainnet");
		});

		fireEvent.input(screen.getByTestId("PeerForm__name-input"), { target: { value: "ROBank" } });
		fireEvent.input(screen.getByTestId("PeerForm__host-input"), {
			target: { value: "http://167.114.29.48:4003/api" },
		});

		const submitButton = screen.getByTestId("PeerForm__submit-button");
		await waitFor(() => {
			expect(submitButton).not.toBeDisabled();
		});

		fireEvent.click(submitButton);

		await waitFor(() => {
			expect(onSave).toHaveBeenCalled();
		});
	});

	it("should render the peer on the form", async () => {
		const { asFragment } = render(<PeerForm peer={peer} profile={profile} onSave={onSave} />);

		await waitFor(() => {
			expect(screen.getByTestId("PeerForm__name-input")).toHaveValue(peer.name);
		});

		expect(screen.getByTestId("PeerForm__host-input")).toHaveValue(peer.host);

		expect(asFragment()).toMatchSnapshot();
	});

	it("should error if name consists only of whitespace", async () => {
		render(<PeerForm profile={profile} onSave={onSave} />);

		fireEvent.input(screen.getByTestId("PeerForm__name-input"), { target: { value: "     " } });

		await waitFor(() => {
			expect(screen.getByTestId("Input__error")).toBeVisible();
		});

		expect(screen.getByTestId("PeerForm__submit-button")).toBeDisabled();
	});

	it("should error if host already exists", async () => {
		const peersSpy = jest.spyOn(profile.peers(), "get").mockReturnValue([
			{
				name: peer.name,
				host: peer.host,
				isMultiSignature: peer.isMultiSignature,
			},
		]);

		render(<PeerForm profile={profile} onSave={onSave} />);

		const selectNetworkInput = screen.getByTestId("SelectDropdownInput__input");

		fireEvent.input(selectNetworkInput, { target: { value: "ARK D" } });
		fireEvent.keyDown(selectNetworkInput, { key: "Enter", code: 13 });

		await waitFor(() => {
			expect(selectNetworkInput).toHaveValue("ARK Devnet");
		});

		fireEvent.input(screen.getByTestId("PeerForm__name-input"), { target: { value: "ROBank" } });

		await waitFor(() => {
			expect(screen.getByTestId("PeerForm__name-input")).toHaveValue("ROBank");
		});

		fireEvent.input(screen.getByTestId("PeerForm__host-input"), {
			target: { value: peer.host },
		});

		await waitFor(() => {
			expect(screen.getByTestId("PeerForm__host-input")).toHaveValue(peer.host);
		});

		expect(screen.getByTestId("Input__error")).toBeVisible();
		expect(screen.getByTestId("PeerForm__submit-button")).toBeDisabled();

		peersSpy.mockRestore();
	});
});
