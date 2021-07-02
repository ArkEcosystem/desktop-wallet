import React from "react";
import { render, screen } from "utils/testing-library";

import { TruncateMiddleDynamic } from "./TruncateMiddleDynamic";

describe("TruncateMiddleDynamic", () => {
	it("should render", () => {
		const { asFragment } = render(<TruncateMiddleDynamic value="Lorem ipsum dolor sit amet" />);

		expect(screen.getByText("Lorem ipsum dolor sit amet")).toBeTruthy();

		expect(asFragment()).toMatchSnapshot();
	});
});
