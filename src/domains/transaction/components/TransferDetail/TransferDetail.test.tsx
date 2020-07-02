import React from "react";
import { render } from "testing-library";

// i18n
import { translations } from "../../i18n";
import { TransferDetail } from "./TransferDetail";

describe("TransferDetail", () => {
	it("should not render if not open", () => {
		const { asFragment, getByTestId } = render(
			<TransferDetail isOpen={false} onClose={() => console.log("onClose")} />,
		);

		expect(() => getByTestId("modal__inner")).toThrow(/Unable to find an element by/);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render a modal", () => {
		const { asFragment, getByTestId } = render(
			<TransferDetail isOpen={true} onClose={() => console.log("onClose")} />,
		);

		expect(getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_TRANSFER_DETAIL.TITLE);
		expect(asFragment()).toMatchSnapshot();
	});
});
