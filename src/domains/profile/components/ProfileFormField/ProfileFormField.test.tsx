/* eslint-disable @typescript-eslint/require-await */
import React from "react";
import { fireEvent, render } from "testing-library";

import { ProfileFormField } from "./";

describe("ProfileFormField", () => {
	const profiles = [
		{
			address: "FJKDSALJFKASLJFKSDAJFKFKDSAJFKSAJFKLASJKDFJ",
			walletName: "My Wallet",
			avatarId: "FJKDSALJFKASLJFKSDAJFKFKDSAJFKSAJFKLASJKDFJ",
			formatted: "My Wallet FJKDSALJFKASL...SAJFKLASJKDFJ",
		},
	];

	it("should render", () => {
		const { container } = render(<ProfileFormField formName="profile" formLabel="Profile" profiles={profiles} />);
		expect(container).toMatchSnapshot();
	});

	it("should render with selected profile", () => {
		const { container } = render(
			<ProfileFormField
				formName="profile"
				formLabel="Profile"
				profiles={profiles}
				selectedProfile={profiles[0]}
			/>,
		);
		expect(container).toMatchSnapshot();
	});

	it("should select profile", () => {
		const { getByTestId, getAllByTestId, container } = render(
			<ProfileFormField formName="profile" formLabel="Profile" profiles={profiles} />,
		);
		fireEvent.change(getByTestId("ProfileFormField__select-profile"), {
			target: { value: profiles[0].address },
		});
		const options = getAllByTestId("ProfileFormField__profile-select");

		expect((options[0] as HTMLOptionElement).selected).toBeTruthy();
		expect(container).toMatchSnapshot();
	});
});
