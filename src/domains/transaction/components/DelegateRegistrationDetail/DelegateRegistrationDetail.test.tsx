import { BigNumber } from "@arkecosystem/platform-sdk-support";
import React from "react";
import { render } from "testing-library";
import { TransactionFixture } from "tests/fixtures/transactions";

// i18n
import { translations } from "../../i18n";
import { DelegateRegistrationDetail } from "./DelegateRegistrationDetail";

describe("DelegateRegistrationDetail", () => {
	it("should not render if not open", () => {
		const { asFragment, getByTestId } = render(
			<DelegateRegistrationDetail
				isOpen={false}
				transaction={{ ...TransactionFixture, username: () => "Ark Wallet" }}
			/>,
		);

		expect(() => getByTestId("modal__inner")).toThrow(/Unable to find an element by/);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render a modal", () => {
		const { asFragment, getByTestId } = render(
			<DelegateRegistrationDetail
				isOpen={true}
				transaction={{ ...TransactionFixture, username: () => "Ark Wallet" }}
			/>,
		);

		expect(getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_DELEGATE_REGISTRATION_DETAIL.TITLE);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render as confirmed", () => {
		const { asFragment, getByTestId } = render(
			<DelegateRegistrationDetail
				isOpen={true}
				transaction={{
					...TransactionFixture,
					username: () => "Ark Wallet",
					confirmations: () => BigNumber.make(52),
				}}
			/>,
		);

		expect(getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_DELEGATE_REGISTRATION_DETAIL.TITLE);
		expect(asFragment()).toMatchSnapshot();
	});
});
