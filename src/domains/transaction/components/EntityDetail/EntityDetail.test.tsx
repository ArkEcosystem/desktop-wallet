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

	it("should render a business entity resignation modal", () => {
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

	it("should render a business entity update modal", () => {
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

	it("should render a product entity registration modal", () => {
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

	it("should render a product entity resignation modal", () => {
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

	it("should render a product entity update modal", () => {
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

	it("should render a plugin entity registration modal", () => {
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

	it("should render a plugin entity resignation modal", () => {
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

	it("should render a plugin entity update modal", () => {
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

	it("should render a module entity registration modal", () => {
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

	it("should render a module entity resignation modal", () => {
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

	it("should render a module entity update modal", () => {
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
