import React from "react";
import { render } from "testing-library";
import { TransactionFixture } from "tests/fixtures/transactions";

import { translations } from "../../i18n";
import { LegacyMagistrateDetail } from "./LegacyMagistrateDetail";

describe("LegacyMagistrateDetail", () => {
	it("should not render if not open", () => {
		const { asFragment, getByTestId } = render(
			<LegacyMagistrateDetail isOpen={false} transaction={TransactionFixture} />,
		);

		expect(() => getByTestId("modal__inner")).toThrow(/Unable to find an element by/);
		expect(asFragment()).toMatchSnapshot();
	});

	describe.each(["Business", "Bridgechain"])("Legacy %s Transactions", (type) => {
		it.each(["Registration", "Resignation", "Update"])("should render a legacy %s modal", (subtype) => {
			const transactionType = `legacy${type}${subtype}`;

			const { asFragment, getByTestId } = render(
				<LegacyMagistrateDetail
					isOpen={true}
					transaction={{
						...TransactionFixture,
						isTransfer: () => false,
						type: () => transactionType,
					}}
				/>,
			);

			expect(getByTestId("modal__inner")).toHaveTextContent(
				translations.TRANSACTION_TYPES[`LEGACY_${type.toUpperCase()}_${subtype.toUpperCase()}`],
			);
			expect(asFragment()).toMatchSnapshot();
		});
	});
});
