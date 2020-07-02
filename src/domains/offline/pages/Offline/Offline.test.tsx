import React from "react";
import { render } from "testing-library";

import { translations } from "../../i18n";
import { Offline } from "./Offline";

describe("Offline", () => {
	it("should render", () => {
		const { container, asFragment, getByTestId } = render(<Offline />);

		expect(container).toBeTruthy();
		expect(getByTestId("Offline")).toHaveTextContent(translations.TITLE);
		expect(getByTestId("Offline")).toHaveTextContent(translations.DESCRIPTION);
		expect(asFragment()).toMatchSnapshot();
	});
});
