import { BigNumber } from "@arkecosystem/platform-sdk-support";
import React from "react";
import { render } from "testing-library";

import { translations as transactionTranslations } from "../../../i18n";
import { TransactionAmount } from "./TransactionAmount";

describe("TransactionAmount", () => {
	it("should render", () => {
		const { container } = render(<TransactionAmount amount={BigNumber.ONE} currency="DARK" />);

		expect(container).toMatchSnapshot();
	});

	it("should render currency amount", () => {
		const { container } = render(<TransactionAmount amount={BigNumber.ONE} currency="DARK" />);

		expect(container).toHaveTextContent("1 DARK");
	});

	it("should render currency amount", () => {
		const { container } = render(<TransactionAmount amount={BigNumber.ONE} currency="DARK" />);

		expect(container).toHaveTextContent("1 DARK");
		expect(container).toMatchSnapshot();
	});

	it("should render converted currency amount", () => {
		const { container } = render(
			<TransactionAmount
				amount={BigNumber.ONE}
				convertedAmount={BigNumber.ONE}
				currency="DARK"
				exchangeCurrency="ARK"
			/>,
		);

		expect(container).toHaveTextContent("1 DARK");
		expect(container).toHaveTextContent("1 ARK");
	});

	it.each([false, true])("should render label for multiple recipients", (isMultiPayment) => {
		const { container } = render(
			<TransactionAmount amount={BigNumber.ONE} currency="DARK" isMultiPayment={isMultiPayment} />,
		);

		expect(container).toHaveTextContent(
			isMultiPayment ? transactionTranslations.TOTAL_AMOUNT : transactionTranslations.AMOUNT,
		);
		expect(container).toMatchSnapshot();
	});

	it.each(["Sent", "Received"])("should render '%s' icon", (type) => {
		const { container } = render(
			<TransactionAmount amount={BigNumber.ONE} currency="DARK" isSent={type === "Sent"} />,
		);

		expect(container).toHaveTextContent(`${type.toLowerCase()}.svg`);
	});
});
