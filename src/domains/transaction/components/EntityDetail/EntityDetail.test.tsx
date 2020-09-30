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

	it("should render a modal business entity resignation", () => {
		const { asFragment, getByTestId } = render(
			<EntityDetail
				isOpen={true}
				transaction={{
					...TransactionFixture,
					isTransfer: () => false,
					isBusinessEntityResignation: () => true,
				}}
			/>,
		);

		expect(getByTestId("modal__inner")).toHaveTextContent(
			translations.TRANSACTION_TYPES.BUSINESS_ENTITY_RESIGNATION,
		);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render a modal business entity update", () => {
		const { asFragment, getByTestId } = render(
			<EntityDetail
				isOpen={true}
				transaction={{
					...TransactionFixture,
					isTransfer: () => false,
					isBusinessEntityUpdate: () => true,
				}}
			/>,
		);

		expect(getByTestId("modal__inner")).toHaveTextContent(translations.TRANSACTION_TYPES.BUSINESS_ENTITY_UPDATE);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render a modal product entity registration", () => {
		const { asFragment, getByTestId } = render(
			<EntityDetail
				isOpen={true}
				transaction={{
					...TransactionFixture,
					isTransfer: () => false,
					isProductEntityRegistration: () => true,
				}}
			/>,
		);

		expect(getByTestId("modal__inner")).toHaveTextContent(
			translations.TRANSACTION_TYPES.PRODUCT_ENTITY_REGISTRATION,
		);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render a modal product entity resignation", () => {
		const { asFragment, getByTestId } = render(
			<EntityDetail
				isOpen={true}
				transaction={{
					...TransactionFixture,
					isTransfer: () => false,
					isProductEntityResignation: () => true,
				}}
			/>,
		);

		expect(getByTestId("modal__inner")).toHaveTextContent(
			translations.TRANSACTION_TYPES.PRODUCT_ENTITY_RESIGNATION,
		);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render a modal product entity update", () => {
		const { asFragment, getByTestId } = render(
			<EntityDetail
				isOpen={true}
				transaction={{
					...TransactionFixture,
					isTransfer: () => false,
					isProductEntityUpdate: () => true,
				}}
			/>,
		);

		expect(getByTestId("modal__inner")).toHaveTextContent(translations.TRANSACTION_TYPES.PRODUCT_ENTITY_UPDATE);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render a modal plugin entity registration", () => {
		const { asFragment, getByTestId } = render(
			<EntityDetail
				isOpen={true}
				transaction={{
					...TransactionFixture,
					isTransfer: () => false,
					isPluginEntityRegistration: () => true,
				}}
			/>,
		);

		expect(getByTestId("modal__inner")).toHaveTextContent(
			translations.TRANSACTION_TYPES.PLUGIN_ENTITY_REGISTRATION,
		);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render a modal plugin entity resignation", () => {
		const { asFragment, getByTestId } = render(
			<EntityDetail
				isOpen={true}
				transaction={{
					...TransactionFixture,
					isTransfer: () => false,
					isPluginEntityResignation: () => true,
				}}
			/>,
		);

		expect(getByTestId("modal__inner")).toHaveTextContent(translations.TRANSACTION_TYPES.PLUGIN_ENTITY_RESIGNATION);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render a modal plugin entity update", () => {
		const { asFragment, getByTestId } = render(
			<EntityDetail
				isOpen={true}
				transaction={{
					...TransactionFixture,
					isTransfer: () => false,
					isPluginEntityUpdate: () => true,
				}}
			/>,
		);

		expect(getByTestId("modal__inner")).toHaveTextContent(translations.TRANSACTION_TYPES.PLUGIN_ENTITY_UPDATE);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render a modal module entity registration", () => {
		const { asFragment, getByTestId } = render(
			<EntityDetail
				isOpen={true}
				transaction={{
					...TransactionFixture,
					isTransfer: () => false,
					isModuleEntityRegistration: () => true,
				}}
			/>,
		);

		expect(getByTestId("modal__inner")).toHaveTextContent(
			translations.TRANSACTION_TYPES.MODULE_ENTITY_REGISTRATION,
		);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render a modal module entity resignation", () => {
		const { asFragment, getByTestId } = render(
			<EntityDetail
				isOpen={true}
				transaction={{
					...TransactionFixture,
					isTransfer: () => false,
					isModuleEntityResignation: () => true,
				}}
			/>,
		);

		expect(getByTestId("modal__inner")).toHaveTextContent(translations.TRANSACTION_TYPES.MODULE_ENTITY_RESIGNATION);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render a modal module entity update", () => {
		const { asFragment, getByTestId } = render(
			<EntityDetail
				isOpen={true}
				transaction={{
					...TransactionFixture,
					isTransfer: () => false,
					isModuleEntityUpdate: () => true,
				}}
			/>,
		);

		expect(getByTestId("modal__inner")).toHaveTextContent(translations.TRANSACTION_TYPES.MODULE_ENTITY_UPDATE);
		expect(asFragment()).toMatchSnapshot();
	});
});
