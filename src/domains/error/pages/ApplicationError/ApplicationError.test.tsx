import React from "react";
import { render } from "testing-library";

import { translations } from "../../i18n";
import { ApplicationError } from "./ApplicationError";

describe("ApplicationError", () => {
	it("should render", () => {
		const { container, asFragment, getByTestId } = render(<ApplicationError />);

		expect(container).toBeTruthy();
		expect(getByTestId("ApplicationError__text")).toHaveTextContent(translations.APPLICATION.TITLE);
		expect(getByTestId("ApplicationError__text")).toHaveTextContent(translations.APPLICATION.DESCRIPTION);
		expect(asFragment()).toMatchSnapshot();
	});
});
