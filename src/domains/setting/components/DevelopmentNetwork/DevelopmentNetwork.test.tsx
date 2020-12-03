import React from "react";
import { render } from "testing-library";

import { translations } from "../../i18n";
import { DevelopmentNetwork } from "./DevelopmentNetwork";

describe("DevelopmentNetwork", () => {
	it("should not render if not open", () => {
		const { asFragment, getByTestId } = render(<DevelopmentNetwork isOpen={false} />);

		expect(() => getByTestId("modal__inner")).toThrow(/Unable to find an element by/);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render a modal", () => {
		const { asFragment, getByTestId } = render(<DevelopmentNetwork isOpen={true} />);

		expect(getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_DEVELOPMENT_NETWORK.TITLE);
		expect(getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_DEVELOPMENT_NETWORK.DESCRIPTION);
		expect(asFragment()).toMatchSnapshot();
	});
});
