import React from "react";
import { render } from "testing-library";

import { SocialButton } from "./SocialButton";

describe("SocialButton", () => {
	it("should render", () => {
		const { container, asFragment } = render(<SocialButton icon="Twitter" link="https://twitter.ark.io/" />);

		expect(container).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});
});
