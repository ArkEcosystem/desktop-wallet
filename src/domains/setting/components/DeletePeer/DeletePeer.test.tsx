import { Profile } from "@arkecosystem/platform-sdk-profiles";
import React from "react";
import { act, env, fireEvent, getDefaultProfileId, renderWithRouter, waitFor } from "testing-library";

import { translations } from "../../i18n";
import { DeletePeer } from "./DeletePeer";

const peer = {
	coin: "ARK",
	network: "ark.devnet",
	host: "http://167.114.29.48:4003/api",
};
let profile: Profile;

const onDelete = jest.fn();

describe("DeletePeer", () => {
	beforeAll(() => {
		profile = env.profiles().findById(getDefaultProfileId());
		profile.peers().create("ARK", "ark.devnet", {
			name: "ROBank",
			host: "http://167.114.29.48:4003/api",
			isMultiSignature: false,
		});
	});

	afterEach(() => {
		onDelete.mockRestore();
	});

	it("should not render if not open", () => {
		const { asFragment, getByTestId } = renderWithRouter(
			<DeletePeer isOpen={false} peer={peer} profile={profile} onDelete={onDelete} />,
		);

		expect(() => getByTestId("modal__inner")).toThrow(/Unable to find an element by/);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render a modal", () => {
		const { asFragment, getByTestId } = renderWithRouter(
			<DeletePeer isOpen={true} peer={peer} profile={profile} onDelete={onDelete} />,
		);

		expect(getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_DELETE_PEER.TITLE);
		expect(getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_DELETE_PEER.DESCRIPTION);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should delete peer", async () => {
		const { getByTestId } = renderWithRouter(
			<DeletePeer isOpen={true} peer={peer} profile={profile} onDelete={onDelete} />,
		);
		const deleteBtn = getByTestId("DeleteResource__submit-button");

		act(() => {
			fireEvent.click(deleteBtn);
		});

		await waitFor(() => expect(onDelete).toBeCalled());
	});
});
