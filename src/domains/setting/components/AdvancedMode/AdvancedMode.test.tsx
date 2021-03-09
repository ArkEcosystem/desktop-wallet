import React from "react";
import { render } from "testing-library";

import { translations } from "../../i18n";
import { AdvancedMode } from "./AdvancedMode";

describe("AdvancedMode", () => {
	it("should not render if not open", () => {
		const { asFragment, getByTestId } = render(<AdvancedMode isOpen={false} />);

		expect(() => getByTestId("modal__inner")).toThrow(/Unable to find an element by/);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render a modal", () => {
		const { asFragment, getByTestId } = render(<AdvancedMode isOpen={true} />);

		expect(getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_ADVANCED_MODE.TITLE);
		expect(getByTestId("modal__inner")).toHaveTextContent(
			translations.MODAL_ADVANCED_MODE.DISCLAIMER.replace(/\n\n/g, " "),
		);
		expect(asFragment()).toMatchSnapshot();
	});
});
