import React from "react";
import { render } from "testing-library";

import { MyVoteTable } from "./MyVoteTable";

describe("MyVoteTable", () => {
	it("should render", () => {
		const { asFragment, container } = render(<MyVoteTable maxVotes={1} />);

		expect(container).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});
});
