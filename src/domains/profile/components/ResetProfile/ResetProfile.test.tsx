import { Profile, ProfileSetting } from "@arkecosystem/platform-sdk-profiles";
import React from "react";
import { act, env, fireEvent, getDefaultProfileId, render, waitFor } from "utils/testing-library";

import { ResetProfile } from "./ResetProfile";

let profile: Profile;

describe("ResetProfile", () => {
	beforeAll(() => {
		profile = env.profiles().findById(getDefaultProfileId());
		profile.settings().set(ProfileSetting.Theme, "dark");
		env.persist();
	});

	it("should render", async () => {
		const { getByTestId, asFragment } = render(<ResetProfile isOpen profile={profile} />);

		await waitFor(() => expect(getByTestId("modal__inner")).toBeTruthy());
		expect(getByTestId("ResetProfile__submit-button")).toBeInTheDocument();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should reset profile", async () => {
		const onReset = jest.fn();

		const { getByTestId } = render(<ResetProfile isOpen profile={profile} onReset={onReset} />);

		const theme = profile.settings().get(ProfileSetting.Theme);

		await waitFor(() => expect(getByTestId("modal__inner")).toBeTruthy());

		act(() => {
			fireEvent.click(getByTestId("ResetProfile__submit-button"));
		});

		await waitFor(() => expect(profile.settings().get(ProfileSetting.Theme)).not.toBe(theme));

		expect(onReset).toHaveBeenCalled();
	});
});
