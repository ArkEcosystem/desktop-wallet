import React from "react";
import { render } from "testing-library";
import { TransactionFixture } from "tests/fixtures/transactions";

import { translations } from "../../i18n";
import { DelegateResignationDetail } from "./DelegateResignationDetail";

describe("DelegateResignationDetail", () => {
	it("should not render if not open", () => {
		const { asFragment, getByTestId } = render(
			<DelegateResignationDetail
				isOpen={false}
				transaction={{
					...TransactionFixture,
					wallet: () => ({
						...TransactionFixture.wallet(),
						username: () => "ARK Wallet",
					}),
				}}
			/>,
		);

		expect(() => getByTestId("modal__inner")).toThrow(/Unable to find an element by/);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render a modal", () => {
		const { asFragment, getByTestId } = render(
			<DelegateResignationDetail
				isOpen={true}
				transaction={{
					...TransactionFixture,
					wallet: () => ({
						...TransactionFixture.wallet(),
						username: () => "ARK Wallet",
					}),
				}}
			/>,
		);

		expect(getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_DELEGATE_RESIGNATION_DETAIL.TITLE);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render as confirmed", () => {
		const { asFragment, getByTestId } = render(
			<DelegateResignationDetail
				isOpen={true}
				transaction={{
					...TransactionFixture,
					username: () => "Ark Wallet",
					isConfirmed: () => true,
					wallet: () => ({
						...TransactionFixture.wallet(),
						username: () => "ARK Wallet",
					}),
				}}
			/>,
		);

		expect(getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_DELEGATE_RESIGNATION_DETAIL.TITLE);
		expect(asFragment()).toMatchSnapshot();
	});
});
