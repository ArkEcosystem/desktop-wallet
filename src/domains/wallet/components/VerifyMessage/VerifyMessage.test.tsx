import React from "react";
import { act, fireEvent, render } from "test-utils";

import { VerifyMessage } from "./VerifyMessage";

describe("VerifyMessage", () => {
	it("should render", () => {
		const { container, asFragment } = render(<VerifyMessage />);

		expect(container).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render the non verify address content", () => {
		const { asFragment, getByTestId } = render(<VerifyMessage isOpen={true} />);

		const verifyAddressToggle = getByTestId("verify-address__togle");
		act(() => {
			fireEvent.click(verifyAddressToggle);
		});
		expect(getByTestId("noverify-address__content")).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});
});
