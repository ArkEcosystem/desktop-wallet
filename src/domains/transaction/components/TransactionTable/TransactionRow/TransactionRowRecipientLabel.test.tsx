import React from "react";
import { render } from "testing-library";
import { TransactionFixture } from "tests/fixtures/transactions";

import { translations } from "../../../i18n";
import { TransactionRowRecipientLabel } from "./TransactionRowRecipientLabel";

describe("TransactionRowRecipientLabel", () => {
	it("should show address", () => {
		const { getByTestId } = render(<TransactionRowRecipientLabel transaction={TransactionFixture} />);
		expect(getByTestId("address__wallet-address")).toHaveTextContent("D8rr7B … s6YUYD");
	});

	it("should show label", () => {
		const { getByText } = render(
			<TransactionRowRecipientLabel transaction={{ ...TransactionFixture, type: () => "secondSignature" }} />,
		);
		expect(getByText(translations.TRANSACTION_TYPES.SECOND_SIGNATURE)).toBeTruthy();
	});

	it("should show a multi payment label", () => {
		const { getByText } = render(
			<TransactionRowRecipientLabel
				transaction={{
					...TransactionFixture,
					isTransfer: () => false,
					isMultiPayment: () => true,
					type: () => "multiPayment",
				}}
			/>,
		);
		expect(getByText(translations.TRANSACTION_TYPES.MULTI_PAYMENT)).toBeTruthy();
	});

	it("should show a business entity registration label", () => {
		const { getByText } = render(
			<TransactionRowRecipientLabel
				transaction={{
					...TransactionFixture,
					isTransfer: () => false,
					isBusinessEntityRegistration: () => true,
					type: () => "entityRegistration",
				}}
			/>,
		);
		expect(getByText(translations.TRANSACTION_TYPES.BUSINESS_ENTITY_REGISTRATION)).toBeTruthy();
	});

	it("should show a business entity resignation label", () => {
		const { getByText } = render(
			<TransactionRowRecipientLabel
				transaction={{
					...TransactionFixture,
					isTransfer: () => false,
					isBusinessEntityResignation: () => true,
					type: () => "entityResignation",
				}}
			/>,
		);
		expect(getByText(translations.TRANSACTION_TYPES.BUSINESS_ENTITY_RESIGNATION)).toBeTruthy();
	});

	it("should show a business entity update label", () => {
		const { getByText } = render(
			<TransactionRowRecipientLabel
				transaction={{
					...TransactionFixture,
					isTransfer: () => false,
					isBusinessEntityUpdate: () => true,
					type: () => "entityUpdate",
				}}
			/>,
		);
		expect(getByText(translations.TRANSACTION_TYPES.BUSINESS_ENTITY_UPDATE)).toBeTruthy();
	});

	it("should show a product entity registration label", () => {
		const { getByText } = render(
			<TransactionRowRecipientLabel
				transaction={{
					...TransactionFixture,
					isTransfer: () => false,
					isProductEntityRegistration: () => true,
					type: () => "entityRegistration",
				}}
			/>,
		);
		expect(getByText(translations.TRANSACTION_TYPES.PRODUCT_ENTITY_REGISTRATION)).toBeTruthy();
	});

	it("should show a product entity resignation label", () => {
		const { getByText } = render(
			<TransactionRowRecipientLabel
				transaction={{
					...TransactionFixture,
					isTransfer: () => false,
					isProductEntityResignation: () => true,
					type: () => "entityResignation",
				}}
			/>,
		);
		expect(getByText(translations.TRANSACTION_TYPES.PRODUCT_ENTITY_RESIGNATION)).toBeTruthy();
	});

	it("should show a product entity update label", () => {
		const { getByText } = render(
			<TransactionRowRecipientLabel
				transaction={{
					...TransactionFixture,
					isTransfer: () => false,
					isProductEntityUpdate: () => true,
					type: () => "entityUpdate",
				}}
			/>,
		);
		expect(getByText(translations.TRANSACTION_TYPES.PRODUCT_ENTITY_UPDATE)).toBeTruthy();
	});

	it("should show a plugin entity registration label", () => {
		const { getByText } = render(
			<TransactionRowRecipientLabel
				transaction={{
					...TransactionFixture,
					isTransfer: () => false,
					isPluginEntityRegistration: () => true,
					type: () => "entityRegistration",
				}}
			/>,
		);
		expect(getByText(translations.TRANSACTION_TYPES.PLUGIN_ENTITY_REGISTRATION)).toBeTruthy();
	});

	it("should show a plugin entity resignation label", () => {
		const { getByText } = render(
			<TransactionRowRecipientLabel
				transaction={{
					...TransactionFixture,
					isTransfer: () => false,
					isPluginEntityResignation: () => true,
					type: () => "entityResignation",
				}}
			/>,
		);
		expect(getByText(translations.TRANSACTION_TYPES.PLUGIN_ENTITY_RESIGNATION)).toBeTruthy();
	});

	it("should show a plugin entity update label", () => {
		const { getByText } = render(
			<TransactionRowRecipientLabel
				transaction={{
					...TransactionFixture,
					isTransfer: () => false,
					isPluginEntityUpdate: () => true,
					type: () => "entityUpdate",
				}}
			/>,
		);
		expect(getByText(translations.TRANSACTION_TYPES.PLUGIN_ENTITY_UPDATE)).toBeTruthy();
	});

	it("should show a module entity registration label", () => {
		const { getByText } = render(
			<TransactionRowRecipientLabel
				transaction={{
					...TransactionFixture,
					isTransfer: () => false,
					isModuleEntityRegistration: () => true,
					type: () => "entityRegistration",
				}}
			/>,
		);
		expect(getByText(translations.TRANSACTION_TYPES.MODULE_ENTITY_REGISTRATION)).toBeTruthy();
	});

	it("should show a module entity resignation label", () => {
		const { getByText } = render(
			<TransactionRowRecipientLabel
				transaction={{
					...TransactionFixture,
					isTransfer: () => false,
					isModuleEntityResignation: () => true,
					type: () => "entityResignation",
				}}
			/>,
		);
		expect(getByText(translations.TRANSACTION_TYPES.MODULE_ENTITY_RESIGNATION)).toBeTruthy();
	});

	it("should show a module entity update label", () => {
		const { getByText } = render(
			<TransactionRowRecipientLabel
				transaction={{
					...TransactionFixture,
					isTransfer: () => false,
					isModuleEntityUpdate: () => true,
					type: () => "entityUpdate",
				}}
			/>,
		);
		expect(getByText(translations.TRANSACTION_TYPES.MODULE_ENTITY_UPDATE)).toBeTruthy();
	});
});
