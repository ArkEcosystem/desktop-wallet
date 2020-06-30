import React from "react";
import { render } from "test-utils";

import { translations } from "../../i18n";
import { AddBlacklistPlugin } from "./AddBlacklistPlugin";

describe("AddBlacklistPlugin", () => {
	it("should not render if not open", () => {
		const { asFragment, getByTestId } = render(<AddBlacklistPlugin isOpen={false} />);

		expect(() => getByTestId("modal__inner")).toThrow(/Unable to find an element by/);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render a modal", () => {
		const { asFragment, getByTestId } = render(<AddBlacklistPlugin isOpen={true} />);

		expect(getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_ADD_BLACKLIST_PLUGIN.TITLE);
		expect(getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_ADD_BLACKLIST_PLUGIN.DESCRIPTION);
		expect(asFragment()).toMatchSnapshot();
	});
});
