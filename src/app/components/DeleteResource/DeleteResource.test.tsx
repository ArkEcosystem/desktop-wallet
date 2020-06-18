import { render } from "@testing-library/react";
import { i18n } from "app/i18n";
import React from "react";
import { I18nextProvider } from "react-i18next";

import { DeleteResource } from "./DeleteResource";

describe("DeleteWallet", () => {
	const onDelete = jest.fn();

	it("should not render if not open", () => {
		const { asFragment, getByTestId } = render(
			<I18nextProvider i18n={i18n}>
				<DeleteResource isOpen={false} onDelete={onDelete} />
			</I18nextProvider>,
		);

		expect(() => getByTestId("modal__inner")).toThrow(/Unable to find an element by/);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render with children", () => {
		const { asFragment, getByTestId } = render(
			<I18nextProvider i18n={i18n}>
				<DeleteResource isOpen={true} onDelete={onDelete}>
					<span>Hello!</span>
				</DeleteResource>
			</I18nextProvider>,
		);

		expect(getByTestId("modal__inner")).toHaveTextContent("Hello!");
		expect(asFragment()).toMatchSnapshot();
	});
});
