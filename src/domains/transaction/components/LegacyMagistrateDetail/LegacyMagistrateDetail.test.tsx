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

	it("should render a legacy magistrate modal", () => {
		const { asFragment, getByTestId } = render(
			<LegacyMagistrateDetail
				isOpen={true}
				transaction={{
					...TransactionFixture,
					isTransfer: () => false,
					type: () => "magistrate",
				}}
			/>,
		);

		expect(getByTestId("modal__inner")).toHaveTextContent(translations.TRANSACTION_TYPES.MAGISTRATE);
		expect(asFragment()).toMatchSnapshot();
	});
});
