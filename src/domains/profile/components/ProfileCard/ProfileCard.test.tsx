import { act } from "@testing-library/react-hooks";
import React from "react";
import { fireEvent, render } from "testing-library";

import { ProfileCard } from "./ProfileCard";

const profile = {
	id: () => "fdda765f-fc57-5604-a269-52a7df8164ec",
	name: () => "Oleg Gelo",
	balance: () => "234,500.46 USD",
	avatar: () =>
		'<svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><style>circle{mix-blend-mode:soft-light;}</style><rect fill="rgb(33, 150, 243)" width="100" height="100"/><circle r="40" cx="60" cy="50" fill="rgb(255, 87, 34)"/><circle r="55" cx="80" cy="40" fill="rgb(205, 220, 57)"/><circle r="35" cx="50" cy="70" fill="rgb(255, 193, 7)"/></svg>',
};

describe("ProfileCard", () => {
	it("should render", () => {
		const { container, asFragment, getByTestId } = render(<ProfileCard profile={profile} />);

		expect(container).toBeTruthy();
		expect(getByTestId("profile-card__user--name")).toHaveTextContent(profile.name());
		expect(getByTestId("profile-card__user--balance")).toHaveTextContent(profile.balance());
		expect(getByTestId("profile-card__user--avatar")).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render the settings icon", () => {
		const { container, getByTestId } = render(<ProfileCard profile={profile} showSettings />);

		expect(container).toMatchSnapshot();
		expect(getByTestId("dropdown__toggle")).toBeTruthy();
	});

	it("should hide the settings icon", () => {
		const { container } = render(<ProfileCard profile={profile} showSettings={false} />);

		expect(container).toMatchSnapshot();
	});

	it("should open dropdown settings on icon click", () => {
		const { getByTestId } = render(<ProfileCard profile={profile} />);
		const toggle = getByTestId("dropdown__toggle");

		act(() => {
			fireEvent.click(toggle);
		});

		expect(getByTestId("dropdown__content")).toBeTruthy();
	});

	it("should select an option in the settings", () => {
		const options = [{ label: "Option 1", value: "1" }];
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
		const options = [
			{ label: "Option 1", value: "1" },
			{ label: "Option 2", value: "2" },
		];
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
