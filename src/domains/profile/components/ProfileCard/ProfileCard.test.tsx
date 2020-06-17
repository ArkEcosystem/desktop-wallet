import { fireEvent, render } from "@testing-library/react";
import { act } from "@testing-library/react-hooks";
import React from "react";

import { ProfileCard } from "./";

describe("ProfileCard", () => {
	const profile = {
		name: "Oleg Gelo",
		balance: "234,500.46 USD",
		avatar: "https://www.w3schools.com/howto/img_avatar.png",
	};

	it("should render", () => {
		const { container, asFragment, getByTestId } = render(<ProfileCard {...profile} />);

		expect(container).toBeTruthy();
		expect(getByTestId("profile-card__user--name")).toHaveTextContent(profile.name);
		expect(getByTestId("profile-card__user--balance")).toHaveTextContent(profile.balance);
		expect(getByTestId("profile-card__user--avatar")).toHaveAttribute("src", profile.avatar);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render the settings icon", () => {
		const { container, getByTestId } = render(<ProfileCard {...profile} showSettings />);

		expect(container).toMatchSnapshot();
		expect(getByTestId("dropdown__toggle")).toBeTruthy();
	});

	it("should hide the settings icon", () => {
		const { container, getByTestId } = render(<ProfileCard {...profile} showSettings={false} />);

		expect(container).toMatchSnapshot();
	});

	it("should open dropdown settings on icon click", () => {
		const { getByTestId } = render(<ProfileCard {...profile} />);
		const toggle = getByTestId("dropdown__toggle");

		act(() => {
			fireEvent.click(toggle);
		});

		expect(getByTestId("dropdown__content")).toBeTruthy();
	});

	it("should select an option in the settings", () => {
		const options = [
			{ label: "Option 1", value: "1" },
			{ label: "Option 2", value: "2" },
		];
		const onSelect = jest.fn();
		const { container, getByTestId } = render(<ProfileCard {...profile} actions={options} onSelect={onSelect} />);
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
		const { container, getByTestId } = render(<ProfileCard {...profile} actions={options} />);
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
