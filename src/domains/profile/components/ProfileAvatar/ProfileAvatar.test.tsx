import { Profile, ProfileSetting } from "@arkecosystem/platform-sdk-profiles";
import React from "react";
import { env, getDefaultProfileId, render } from "utils/testing-library";

import { ProfileAvatar } from "./ProfileAvatar";

let profile: Profile;

describe("Avatar", () => {
	beforeAll(() => (profile = env.profiles().findById(getDefaultProfileId())));

	it("should render with svg", () => {
		const { getByTestId, asFragment } = render(<ProfileAvatar profile={profile} />);
		expect(getByTestId("ProfileAvatar__svg")).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render with profile image", () => {
		profile.settings().set(ProfileSetting.Avatar, "avatarImage");

		const { getByTestId, asFragment } = render(<ProfileAvatar profile={profile} />);
		expect(getByTestId("ProfileAvatar__image")).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});
});
