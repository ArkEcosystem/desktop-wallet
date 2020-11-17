/* eslint-disable @typescript-eslint/require-await */
import { Profile } from "@arkecosystem/platform-sdk-profiles";
import { availableNetworksMock } from "domains/network/data";
import React from "react";
import { act, env, getDefaultProfileId, render, RenderResult } from "testing-library";

import { translations } from "../../i18n";
import { AddPeer } from "./AddPeer";

const onClose = jest.fn();
let profile: Profile;

describe("AddPeer", () => {
	beforeAll(() => {
		profile = env.profiles().findById(getDefaultProfileId());
	});

	it("should not render if not open", async () => {
		let rendered: RenderResult;

		await act(async () => {
			rendered = render(
				<AddPeer isOpen={false} networks={availableNetworksMock} profile={profile} onClose={onClose} />,
			);
		});

		const { asFragment, getByTestId } = rendered;

		expect(() => getByTestId("modal__inner")).toThrow(/Unable to find an element by/);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render add peer modal", async () => {
		let rendered: RenderResult;

		await act(async () => {
			rendered = render(
				<AddPeer isOpen={true} networks={availableNetworksMock} profile={profile} onClose={onClose} />,
			);
		});

		const { asFragment, getByTestId } = rendered;

		expect(getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_CUSTOM_PEER.TITLE);
		expect(asFragment()).toMatchSnapshot();
	});
});
