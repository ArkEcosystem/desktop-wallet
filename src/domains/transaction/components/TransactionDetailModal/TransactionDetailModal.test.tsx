import React from "react";
import { render } from "testing-library";

// i18n
import { translations } from "../../i18n";
import { TransactionDetailModal } from "./TransactionDetailModal";

describe("TransactionDetailModal", () => {
	it("should not render if not open", () => {
		const { asFragment, getByTestId } = render(<TransactionDetailModal isOpen={false} />);

		expect(() => getByTestId("modal__inner")).toThrow(/Unable to find an element by/);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render a transfer modal", () => {
		const { asFragment, getByTestId } = render(
			<TransactionDetailModal isOpen={true} transactionItem={{ type: () => "transfer" }} />,
		);

		expect(getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_TRANSFER_DETAIL.TITLE);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render as null if unknow type", () => {
		const { asFragment, getByTestId } = render(
			<TransactionDetailModal isOpen={true} transactionItem={{ type: () => "unknow" }} />,
		);

		expect(() => getByTestId("modal__inner")).toThrow(/Unable to find an element by/);
		expect(asFragment()).toMatchSnapshot();
	});
});
