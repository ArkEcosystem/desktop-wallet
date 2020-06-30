import { fireEvent, render } from "@testing-library/react";
import { i18n } from "app/i18n";
import { translations } from "app/i18n/common/i18n";
import React from "react";
import { I18nextProvider } from "react-i18next";

import { CollapseToggleButton } from "./CollapseToggleButton";

describe("CollapseToggleButton", () => {
	it("should render", () => {
		const onClick = jest.fn();
		const { getByTestId } = render(<CollapseToggleButton isOpen={false} onClick={onClick} />);
		const button = getByTestId("CollapseToggleButton");
		expect(button).toHaveTextContent(translations.SHOW);
		fireEvent.click(button);
		expect(onClick).toHaveBeenCalled();
	});

	it("should render open", () => {
		const { getByTestId } = render(
			<I18nextProvider i18n={i18n}>
				<CollapseToggleButton isOpen={true} />
			</I18nextProvider>,
		);
		const button = getByTestId("CollapseToggleButton");
		expect(button).toHaveTextContent(translations.HIDE);
	});
});
