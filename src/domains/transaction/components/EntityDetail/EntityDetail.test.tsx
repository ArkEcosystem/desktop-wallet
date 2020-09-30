import React from "react";
import { render } from "testing-library";
import { TransactionFixture } from "tests/fixtures/transactions";

import { translations } from "../../i18n";
import { EntityDetail } from "./EntityDetail";

describe("EntityDetail", () => {
	it("should not render if not open", () => {
		const { asFragment, getByTestId } = render(<EntityDetail isOpen={false} transaction={TransactionFixture} />);

		expect(() => getByTestId("modal__inner")).toThrow(/Unable to find an element by/);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render a modal", () => {
		const { asFragment, getByTestId } = render(
			<EntityDetail
				isOpen={true}
				transaction={{
					...TransactionFixture,
					isTransfer: () => false,
					isBusinessEntityRegistration: () => true,
				}}
			/>,
		);

		expect(getByTestId("modal__inner")).toHaveTextContent(
			translations.TRANSACTION_TYPES.BUSINESS_ENTITY_REGISTRATION,
		);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render a modal without a wallet alias", () => {
		const { asFragment, getByTestId } = render(
			<EntityDetail
				isOpen={true}
				transaction={{
					...TransactionFixture,
					isTransfer: () => false,
					isBusinessEntityRegistration: () => true,
					wallet: () => ({
						...TransactionFixture.wallet(),
						alias: () => undefined,
					}),
				}}
			/>,
		);

		expect(getByTestId("modal__inner")).toHaveTextContent(
			translations.TRANSACTION_TYPES.BUSINESS_ENTITY_REGISTRATION,
		);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render as confirmed", () => {
		const { asFragment, getByText, getByTestId } = render(
			<EntityDetail
				isOpen={true}
				transaction={{
					...TransactionFixture,
					isTransfer: () => false,
					isBusinessEntityRegistration: () => true,
					isConfirmed: () => true,
				}}
			/>,
		);

		expect(getByTestId("modal__inner")).toHaveTextContent(
			translations.TRANSACTION_TYPES.BUSINESS_ENTITY_REGISTRATION,
		);
		expect(getByText(translations.WELL_CONFIRMED)).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});
});
