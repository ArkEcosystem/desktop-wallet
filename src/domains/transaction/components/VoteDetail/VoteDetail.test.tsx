import React from "react";
import { render } from "testing-library";

// i18n
import { translations } from "../../i18n";
import { VoteDetail } from "./VoteDetail";

describe("VoteDetail", () => {
	it("should not render if not open", () => {
		const { asFragment, getByTestId } = render(<VoteDetail isOpen={false} />);

		expect(() => getByTestId("modal__inner")).toThrow(/Unable to find an element by/);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render a modal", () => {
		const { asFragment, getByTestId } = render(<VoteDetail isOpen={true} />);

		expect(getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_VOTE_DETAIL.TITLE);
		expect(asFragment()).toMatchSnapshot();
	});
});
