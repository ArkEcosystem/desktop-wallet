import React from "react";
import { render } from "testing-library";

import { translations } from "../../i18n";
import { ManualInstallationDisclaimer } from "./ManualInstallationDisclaimer";

describe("ManualInstallationDisclaimer", () => {
	it("should not render if not open", () => {
		const { asFragment, getByTestId } = render(<ManualInstallationDisclaimer isOpen={false} />);

		expect(() => getByTestId("modal__inner")).toThrow(/Unable to find an element by/);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render a modal", () => {
		const { asFragment, getByTestId } = render(<ManualInstallationDisclaimer isOpen={true} />);

		expect(getByTestId("modal__inner")).toHaveTextContent(translations.MANUAL_INSTALLATION_DISCLAIMER.TITLE);
		expect(getByTestId("modal__inner")).toHaveTextContent(
			translations.MANUAL_INSTALLATION_DISCLAIMER.DISCLAIMER.replace(/\n\n/g, " "),
		);
		expect(asFragment()).toMatchSnapshot();
	});
});
