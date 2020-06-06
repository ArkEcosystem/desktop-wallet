import React from "react";
import { render } from "@testing-library/react";

import { ProfileCard } from "../";

describe("ProfileCard", () => {
	it("should render", () => {
		const name = "Oleg Gelo";
		const balance = "234,500.46 USD";
		const avatar = "https://www.w3schools.com/howto/img_avatar.png";

		const { container, asFragment, getByTestId } = render(
			<ProfileCard name={name} balance={balance} avatar={avatar} />,
		);

		expect(container).toBeTruthy();
		expect(getByTestId("profile-card__user--name")).toHaveTextContent(name);
		expect(getByTestId("profile-card__user--balance")).toHaveTextContent(balance);
		expect(getByTestId("profile-card__user--avatar")).toHaveAttribute("src", avatar);
		expect(asFragment()).toMatchSnapshot();
	});
});
