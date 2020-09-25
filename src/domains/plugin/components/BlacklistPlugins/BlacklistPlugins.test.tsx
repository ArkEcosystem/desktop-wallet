import React from "react";
import { render } from "testing-library";

import { plugins } from "../../data";
import { translations } from "../../i18n";
import { BlacklistPlugins } from "./BlacklistPlugins";

describe("BlacklistPlugins", () => {
	it("should not render if not open", () => {
		const { asFragment, getByTestId } = render(<BlacklistPlugins isOpen={false} plugins={[]} />);

		expect(() => getByTestId("modal__inner")).toThrow(/Unable to find an element by/);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render a modal", () => {
		const { asFragment, getByTestId } = render(<BlacklistPlugins isOpen={true} plugins={plugins} />);

		expect(getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_BLACKLIST_PLUGINS.TITLE);
		expect(getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_BLACKLIST_PLUGINS.DESCRIPTION);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render a modal with blacklist", () => {
		const { asFragment, getByTestId } = render(
			<BlacklistPlugins isOpen={true} plugins={plugins} blacklisted={[plugins[0].id]} />,
		);

		expect(getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_BLACKLIST_PLUGINS.TITLE);
		expect(getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_BLACKLIST_PLUGINS.DESCRIPTION);
		expect(asFragment()).toMatchSnapshot();
	});
});
