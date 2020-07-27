import React from "react";
import { render } from "testing-library";

import { plugins } from "../../data";
import { translations } from "../../i18n";
import { BestPlugins } from "./BestPlugins";

describe("BestPlugins", () => {
	it("should not render if not open", () => {
		const { asFragment, getByTestId } = render(<BestPlugins isOpen={false} plugins={[]} />);

		expect(() => getByTestId("modal__inner")).toThrow(/Unable to find an element by/);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render a modal", () => {
		const { asFragment, getByTestId } = render(<BestPlugins isOpen={true} plugins={plugins} />);

		expect(getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_BEST_PLUGINS.TITLE);
		expect(getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_BEST_PLUGINS.DESCRIPTION);
		expect(asFragment()).toMatchSnapshot();
	});
});
