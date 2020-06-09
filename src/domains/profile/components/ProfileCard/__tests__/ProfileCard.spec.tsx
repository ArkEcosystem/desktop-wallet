import React from "react";
import { fireEvent, render } from "@testing-library/react";
import { act } from "@testing-library/react-hooks";

import { ProfileCard } from "../";

describe("ProfileCard", () => {
	const profile = {
		name: "Oleg Gelo",
		balance: "234,500.46 USD",
		avatar: "https://www.w3schools.com/howto/img_avatar.png",
	};

	beforeEach(() => {
		jest.spyOn(console, "error").mockImplementation(() => null);
	});

	it("should render", () => {
		const { container, asFragment, getByTestId } = render(<ProfileCard {...profile} />);

		expect(container).toBeTruthy();
		expect(getByTestId("profile-card__user--name")).toHaveTextContent(profile.name);
		expect(getByTestId("profile-card__user--balance")).toHaveTextContent(profile.balance);
		expect(getByTestId("profile-card__user--avatar")).toHaveAttribute("src", profile.avatar);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render settings button", () => {
		const { container, getByTestId } = render(<ProfileCard {...profile} />);

		expect(container).toMatchSnapshot();
		expect(getByTestId("dropdown__toggle")).toBeTruthy();
	});

	it("should open dropdown settings on icon click", () => {
		const { getByTestId } = render(<ProfileCard {...profile} />);
		const toggle = getByTestId("dropdown__toggle");

		act(() => {
			fireEvent.click(toggle);
		});

		expect(getByTestId("dropdown__content")).toBeTruthy();
	});
});
