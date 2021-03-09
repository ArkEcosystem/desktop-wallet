/* eslint-disable @typescript-eslint/require-await */
import { Profile } from "@arkecosystem/platform-sdk-profiles";
import { availableNetworksMock } from "domains/network/data";
import React from "react";
import { act, env, fireEvent, getDefaultProfileId, render, RenderResult, waitFor } from "testing-library";

import { translations } from "../../i18n";
import { UpdatePeer } from "./UpdatePeer";

const peer = {
	coin: "ARK",
	network: "ark.mainnet",
	name: "ROBank",
	host: "http://167.114.29.48:4003/api",
	isMultiSignature: false,
};

let profile: Profile;
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
		let rendered: RenderResult;

		await act(async () => {
			rendered = render(
				<UpdatePeer
					isOpen={false}
					networks={availableNetworksMock}
					peer={peer}
					profile={profile}
					onClose={onClose}
				/>,
			);
		});

		const { asFragment, getByTestId } = rendered;

		expect(() => getByTestId("modal__inner")).toThrow(/Unable to find an element by/);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render update peer modal", async () => {
		let rendered: RenderResult;

		await act(async () => {
			rendered = render(
				<UpdatePeer
					isOpen={true}
					networks={availableNetworksMock}
					peer={peer}
					profile={profile}
					onClose={onClose}
				/>,
			);
		});

		const { asFragment, getByTestId } = rendered;

		expect(getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_CUSTOM_PEER.TITLE);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should update a peer", async () => {
		let rendered: RenderResult;

		await act(async () => {
			rendered = render(
				<UpdatePeer
					isOpen={true}
					networks={availableNetworksMock}
					peer={peer}
					profile={profile}
					onClose={onClose}
				/>,
			);
		});

		const { getByTestId } = rendered;

		await act(async () => {
			await fireEvent.input(getByTestId("PeerForm__name-input"), { target: { value: "Private" } });
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

	it("should update a peer selecting another network", async () => {
		let rendered: RenderResult;

		await act(async () => {
			rendered = render(
				<UpdatePeer
					isOpen={true}
					networks={availableNetworksMock}
					peer={peer}
					profile={profile}
					onClose={onClose}
				/>,
			);
		});

		const { getByTestId } = rendered;

		await act(async () => {
			act(() => {
				fireEvent.focus(getByTestId("SelectNetworkInput__input"));
			});

			await waitFor(() =>
				expect(getByTestId("SelectNetworkInput__network")).toHaveAttribute("aria-label", "ARK"),
			);

			act(() => {
				fireEvent.focus(getByTestId("SelectNetworkInput__input"));
			});

			await waitFor(() => expect(getByTestId("NetworkIcon-ARK-ark.mainnet")).toBeTruthy());

			act(() => {
				fireEvent.click(getByTestId("NetworkIcon-ARK-ark.devnet"));
			});

			await waitFor(() =>
				expect(getByTestId("SelectNetworkInput__network")).toHaveAttribute("aria-label", "ARK Devnet"),
			);

			await fireEvent.input(getByTestId("PeerForm__name-input"), { target: { value: "Private" } });
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
