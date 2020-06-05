import React from "react";
import { render } from "@testing-library/react";

import { CardControl } from "../";

describe("Card Control", () => {
	it("should render", () => {
		const { container, asFragment } = render(<CardControl />);

		expect(container).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});
});
