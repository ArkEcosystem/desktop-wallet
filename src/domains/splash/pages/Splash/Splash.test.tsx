import { DateTime } from "@arkecosystem/platform-sdk-intl";
import React from "react";
import { render } from "testing-library";

import * as utils from "../../../../utils/electron-utils";
import { translations } from "../../i18n";
import { Splash } from "./Splash";

describe("Splash", () => {
	it.each(["light", "dark"])("should  render  %s theme", (theme) => {
		jest.spyOn(utils, "shouldUseDarkColors").mockImplementation(() => theme === "dark");
		const { container, asFragment, getByTestId } = render(<Splash year="2020" />);

		expect(container).toBeTruthy();
		expect(getByTestId("Splash__text")).toHaveTextContent(translations.BRAND);
		expect(getByTestId("Splash__text")).toHaveTextContent(translations.LOADING);

		expect(getByTestId("Splash__footer")).toHaveTextContent(translations.COPYRIGHT);
		expect(getByTestId("Splash__footer")).toHaveTextContent(translations.RIGHTS);
		expect(getByTestId("Splash__footer")).toHaveTextContent(translations.PRODUCT);
		expect(getByTestId("Splash__footer")).toHaveTextContent("2020");
		expect(getByTestId("Splash__footer")).toHaveTextContent(translations.VERSION);

		expect(asFragment()).toMatchSnapshot();
	});

	it("should render without year", () => {
		const { container, asFragment, getByTestId } = render(<Splash />);

		expect(container).toBeTruthy();
		expect(getByTestId("Splash__text")).toHaveTextContent(translations.BRAND);
		expect(getByTestId("Splash__text")).toHaveTextContent(translations.LOADING);

		expect(getByTestId("Splash__footer")).toHaveTextContent(translations.COPYRIGHT);
		expect(getByTestId("Splash__footer")).toHaveTextContent(translations.RIGHTS);
		expect(getByTestId("Splash__footer")).toHaveTextContent(translations.PRODUCT);
		expect(getByTestId("Splash__footer")).toHaveTextContent(DateTime.make().format("YYYY"));
		expect(getByTestId("Splash__footer")).toHaveTextContent(translations.VERSION);

		expect(asFragment()).toMatchSnapshot();
	});
});
