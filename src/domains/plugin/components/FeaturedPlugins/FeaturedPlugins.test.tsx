import React from "react";
import { render } from "testing-library";

import { plugins } from "../../data";
import { translations } from "../../i18n";
import { FeaturedPlugins } from "./FeaturedPlugins";

describe("FeaturedPlugins", () => {
	it("should not render if not open", () => {
		const { asFragment, getByTestId } = render(<FeaturedPlugins isOpen={false} plugins={[]} />);

		expect(() => getByTestId("modal__inner")).toThrow(/Unable to find an element by/);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render a modal", () => {
		const { asFragment, getByTestId } = render(<FeaturedPlugins isOpen={true} plugins={plugins} />);

		expect(getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_FEATURED_PLUGINS.TITLE);
		expect(getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_FEATURED_PLUGINS.DESCRIPTION);
		expect(asFragment()).toMatchSnapshot();
	});
});
