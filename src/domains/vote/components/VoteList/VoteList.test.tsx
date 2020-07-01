import React from "react";
import { render } from "test-utils";

import { VoteList } from "./VoteList";

const votes = [
	{
		address: "FJKDSALJFKASLJFKSDAJD333FKFKDSAJFKSAJFKLASJKDFJ",
		delegateName: "Delegate 1",
	},
	{
		address: "AhFJKDSALJFKASLJFKSDEAJ333FKFKDSAJFKSAJFKLASJKDFJ",
		delegateName: "Delegate 2",
	},
	{
		address: "FAhFJKDSALJFKASLJFKSFDAJ333FKFKDSAJFKSAJFKLASJKDFJ",
		delegateName: "Delegate 3",
	},
];

describe("VoteList", () => {
	it("should render", () => {
		const { container, asFragment } = render(<VoteList votes={votes} />);

		expect(container).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render with empty list", () => {
		const { container, asFragment } = render(<VoteList votes={[]} />);

		expect(container).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});
});
