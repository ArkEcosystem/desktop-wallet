import React from "react";
import { render } from "utils/testing-library";

import { Image } from "./Image";

describe("Image", () => {
	it("should render", () => {
		const { container, asFragment } = render(<Image name="WelcomeBanner" />);

		expect(container).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render with domain", () => {
		const { container, asFragment } = render(<Image name="GenericError" domain="error" />);

		expect(container).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render nothing if image can't be found", () => {
		const { container, asFragment } = render(<Image name="NotExistingImage" />);

		expect(container).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});
});
