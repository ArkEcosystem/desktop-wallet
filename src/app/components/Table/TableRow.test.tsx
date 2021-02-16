import React from "react";
import { render } from "testing-library";

import { TableRow } from "./TableRow";

describe("TableRow", () => {
	it("should render with border", () => {
		const { container } = render(<TableRow border={true} />);
		expect(container).toMatchSnapshot();
	});

	it("should render without border", () => {
		const { container } = render(<TableRow border={false} />);
		expect(container).toMatchSnapshot();
	});
});
