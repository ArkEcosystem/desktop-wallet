import React from "react";
import { render } from "testing-library";

import { translations } from "../../i18n";
import { Splash } from "./Splash";

describe("Splash", () => {
	it("should render", () => {
		const { container, asFragment, getByTestId } = render(<Splash year="2020" />);

		expect(container).toBeTruthy();
		expect(getByTestId("Splash__text")).toHaveTextContent(translations.BRAND);
		expect(getByTestId("Splash__text")).toHaveTextContent(translations.LOADING);

		expect(getByTestId("Splash__footer")).toHaveTextContent(translations.COPYRIGHT);
		expect(getByTestId("Splash__footer")).toHaveTextContent(translations.RIGHTS);
		expect(getByTestId("Splash__footer")).toHaveTextContent(translations.PRODUCT);
		expect(getByTestId("Splash__footer")).toHaveTextContent("2020");
		expect(getByTestId("Splash__footer")).toHaveTextContent(translations.VERSION);

		expect(asFragment()).toMatchSnapshot();
	});
});
