import React from "react";
import { render } from "test-utils";

// i18n
import { translations } from "../../i18n";
import { IpfsDetail } from "./IpfsDetail";

describe("IpfsDetail", () => {
	it("should not render if not open", () => {
		const { asFragment, getByTestId } = render(<IpfsDetail isOpen={false} />);

		expect(() => getByTestId("modal__inner")).toThrow(/Unable to find an element by/);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render a modal", () => {
		const { asFragment, getByTestId } = render(<IpfsDetail isOpen={true} />);

		expect(getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_IPFS_DETAIL.TITLE);
		expect(asFragment()).toMatchSnapshot();
	});
});
