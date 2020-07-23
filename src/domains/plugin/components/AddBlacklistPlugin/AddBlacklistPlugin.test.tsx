import React from "react";
import { render } from "testing-library";

import { plugins } from "../../data";
import { translations } from "../../i18n";
import { AddBlacklistPlugin } from "./AddBlacklistPlugin";

describe("AddBlacklistPlugin", () => {
	it("should not render if not open", () => {
		const { asFragment, getByTestId } = render(<AddBlacklistPlugin isOpen={false} plugins={[]} />);

		expect(() => getByTestId("modal__inner")).toThrow(/Unable to find an element by/);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render a modal", () => {
		const { asFragment, getByTestId } = render(<AddBlacklistPlugin isOpen={true} plugins={plugins} />);

		expect(getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_ADD_BLACKLIST_PLUGIN.TITLE);
		expect(getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_ADD_BLACKLIST_PLUGIN.DESCRIPTION);
		expect(asFragment()).toMatchSnapshot();
	});
});
