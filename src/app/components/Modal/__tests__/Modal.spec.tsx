import React from "react";
import { render } from "@testing-library/react";

import { Modal } from "../";

describe("Modal", () => {
	it("should render", () => {
		const { container, asFragment } = render(<Modal title="ark" />);

		expect(container).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});
});
