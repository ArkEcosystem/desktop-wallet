import React from "react";
import { render } from "testing-library";

import { translations } from "../../i18n";
import { BestPlugins } from "./BestPlugins";

describe("BestPlugins", () => {
	it("should not render if not open", () => {
		const { asFragment, getByTestId } = render(<BestPlugins isOpen={false} />);

		expect(() => getByTestId("modal__inner")).toThrow(/Unable to find an element by/);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render a modal", () => {
		const { asFragment, getByTestId } = render(<BestPlugins isOpen={true} />);

		expect(getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_BEST_PLUGINS.TITLE);
		expect(getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_BEST_PLUGINS.DESCRIPTION);
		expect(asFragment()).toMatchSnapshot();
	});
});
