import React from "react";
import { render } from "utils/testing-library";

import { ConfigurationProvider } from "./";

describe("Configuration Context", () => {
	it("should render the wrapper properly", () => {
		const { container, asFragment, getByTestId } = render(
			<ConfigurationProvider>
				<span data-testid="ConfigurationProvider__content">Configuration Provider content</span>
			</ConfigurationProvider>,
		);

		expect(getByTestId("ConfigurationProvider__content")).toBeInTheDocument();

		expect(container).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});
});
