import React from "react";
import { render } from "@testing-library/react";

import { VerifyMessage } from "../";

describe("VerifyMessage", () => {
	it("should render verify message success", () => {
		const { container, asFragment } = render(<VerifyMessage type="success" />);

		expect(container).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render verify message error", () => {
		const { container, asFragment } = render(<VerifyMessage type="error" />);

		expect(container).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});
});
