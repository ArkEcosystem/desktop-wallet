import React from "react";
import { render, fireEvent } from "@testing-library/react";
import { I18nextProvider } from "react-i18next";

import { i18n } from "app/i18n";
import { translations as COMMON } from "app/i18n/common/i18n";

import { WalletUpdate } from "../";

import { translations as WALLETS } from "../../../i18n";

describe("WalletUpdate", () => {
	it("should not render if not open", () => {
		const { asFragment, getByTestId } = render(
			<I18nextProvider i18n={i18n}>
				<WalletUpdate isOpen={false} onUpdate={() => void 0} />
			</I18nextProvider>,
		);

		expect(() => getByTestId("modal__inner")).toThrow(/Unable to find an element by/);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render a modal", () => {
		const { asFragment, getByTestId } = render(
			<I18nextProvider i18n={i18n}>
				<WalletUpdate isOpen={true} onUpdate={() => void 0} />
			</I18nextProvider>,
		);

		expect(getByTestId("modal__inner")).toHaveTextContent(WALLETS.MODAL_WALLET_UPDATE.DESCRIPTION_1);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should handle update action", () => {
		const handleUpdate = jest.fn();

		const { getByTestId } = render(
			<I18nextProvider i18n={i18n}>
				<WalletUpdate isOpen={true} onUpdate={handleUpdate} />
			</I18nextProvider>,
		);

		fireEvent.click(getByTestId("wallet-update__update-button"));
		expect(handleUpdate).toHaveBeenCalled();
	});

	it("should handle cancel action", () => {
		const handleCancel = jest.fn();

		const { getByTestId } = render(<WalletUpdate isOpen={true} onUpdate={() => void 0} onCancel={handleCancel} />);

		fireEvent.click(getByTestId("wallet-update__cancel-button"));
		expect(handleCancel).toHaveBeenCalled();
	});

	it("should render download step", () => {
		const { getByTestId } = render(
			<I18nextProvider i18n={i18n}>
				<WalletUpdate isOpen={true} isUpdate={true} onUpdate={() => void 0} />
			</I18nextProvider>,
		);

		expect(getByTestId("modal__inner")).toHaveTextContent(COMMON.DOWNLOADED);
	});

	it("should handle install action", () => {
		const handleInstall = jest.fn();

		const { getByTestId } = render(
			<I18nextProvider i18n={i18n}>
				<WalletUpdate
					isOpen={true}
					isUpdate={false}
					isReady={true}
					onUpdate={() => void 0}
					onInstall={handleInstall}
				/>
				,
			</I18nextProvider>,
		);

		fireEvent.click(getByTestId("wallet-update__install-button"));
		expect(getByTestId("modal__inner")).toHaveTextContent(WALLETS.MODAL_WALLET_UPDATE.DESCRIPTION_2);
		expect(handleInstall).toHaveBeenCalled();
	});

	it("should handle close action", () => {
		const handleClose = jest.fn();

		const { getByTestId } = render(<WalletUpdate isOpen={true} onUpdate={() => void 0} onClose={handleClose} />);

		fireEvent.click(getByTestId("modal__close-btn"));
		expect(handleClose).toHaveBeenCalled();
	});
});
