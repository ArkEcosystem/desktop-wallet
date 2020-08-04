import { Profile } from "@arkecosystem/platform-sdk-profiles";
import React from "react";
import { act, env, fireEvent, getDefaultProfileId, render, waitFor } from "utils/testing-library";

import { DeleteProfile } from "./DeleteProfile";

let profile: Profile;

describe("DeleteProfile", () => {
	beforeAll(() => {
		profile = env.profiles().findById(getDefaultProfileId());
	});

	it("should render", async () => {
		const { getByTestId, asFragment } = render(<DeleteProfile isOpen profileId={profile.id()} />);

		await waitFor(() => expect(getByTestId("modal__inner")).toBeTruthy());
		expect(getByTestId("DeleteResource__submit-button")).toBeInTheDocument();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should delete", async () => {
		const { getByTestId } = render(<DeleteProfile isOpen profileId={profile.id()} />);

		await waitFor(() => expect(getByTestId("modal__inner")).toBeTruthy());

		act(() => {
			fireEvent.click(getByTestId("DeleteResource__submit-button"));
		});

		await waitFor(() => expect(env.profiles().values()).toHaveLength(1));
	});
});
