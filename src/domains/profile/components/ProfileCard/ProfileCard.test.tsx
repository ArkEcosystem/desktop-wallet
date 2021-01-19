import { Profile, ProfileSetting } from "@arkecosystem/platform-sdk-profiles";
import { act } from "@testing-library/react-hooks";
import React from "react";
import { env, fireEvent, getDefaultProfileId, render } from "testing-library";

import { ProfileCard } from "./ProfileCard";

let profile: Profile;

const options = [
	{ label: "Option 1", value: "1" },
	{ label: "Option 2", value: "2" },
];

describe("ProfileCard", () => {
	beforeAll(() => {
		profile = env.profiles().findById(getDefaultProfileId());
	});

	it("should render", () => {
		const { container, asFragment, getByTestId, getByText } = render(<ProfileCard profile={profile} />);

		expect(container).toBeTruthy();
		expect(getByText(profile.name())).toBeTruthy();
		expect(getByTestId("ProfileAvatar__svg")).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render the profile with avatar image", () => {
		profile.settings().set(ProfileSetting.Avatar, "avatarImage");

		const { container, asFragment, getByTestId, getByText } = render(<ProfileCard profile={profile} />);

		expect(container).toBeTruthy();
		expect(getByText(profile.name())).toBeTruthy();
		expect(getByTestId("ProfileAvatar__image")).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render the settings icon", () => {
		const { container, getByTestId } = render(<ProfileCard profile={profile} actions={options} showSettings />);

		expect(container).toMatchSnapshot();
		expect(getByTestId("dropdown__toggle")).toBeTruthy();
	});

	it("should hide the settings icon", () => {
		const { container } = render(<ProfileCard profile={profile} actions={options} showSettings={false} />);

		expect(container).toMatchSnapshot();
	});

	it("should open dropdown settings on icon click", () => {
		const { getByTestId } = render(<ProfileCard profile={profile} actions={options} />);
		const toggle = getByTestId("dropdown__toggle");

		act(() => {
			fireEvent.click(toggle);
		});

		expect(getByTestId("dropdown__content")).toBeTruthy();
	});

	it("should select an option in the settings", () => {
		const onSelect = jest.fn();
		const { getByTestId } = render(<ProfileCard profile={profile} actions={options} onSelect={onSelect} />);
		const toggle = getByTestId("dropdown__toggle");

		act(() => {
			fireEvent.click(toggle);
		});

		expect(getByTestId("dropdown__content")).toBeTruthy();

		const firstOption = getByTestId("dropdown__option--0");
		expect(firstOption).toBeTruthy();

		act(() => {
			fireEvent.click(firstOption);
		});

		expect(onSelect).toBeCalledWith({ label: "Option 1", value: "1" });
	});

	it("should ignore triggering onSelect callback if not exists", () => {
		const { container, getByTestId } = render(<ProfileCard profile={profile} actions={options} />);
		const toggle = getByTestId("dropdown__toggle");

		act(() => {
			fireEvent.click(toggle);
		});

		expect(getByTestId("dropdown__content")).toBeTruthy();

		const firstOption = getByTestId("dropdown__option--0");
		expect(firstOption).toBeTruthy();

		act(() => {
			fireEvent.click(firstOption);
		});

		expect(container.querySelectorAll("ul").length).toEqual(0);
	});
});
