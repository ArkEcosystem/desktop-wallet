import React from "react";
import { render } from "testing-library";

import { comments } from "../../data";
import { Comments } from "./Comments";

const sortOptions = {
	type: "Best",
	direction: "desc",
};

describe("Comments", () => {
	it("should render properly", () => {
		const { asFragment } = render(<Comments comments={comments} sortOptions={sortOptions} />);

		expect(asFragment()).toMatchSnapshot();
	});
});
