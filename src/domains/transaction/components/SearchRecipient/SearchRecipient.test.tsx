import { Profile } from "@arkecosystem/platform-sdk-profiles";
import React from "react";
import { env, getDefaultProfileId, render } from "testing-library";

import { translations } from "../../i18n";
import { SearchRecipient } from "./SearchRecipient";

let profile: Profile;

describe("SearchRecipient", () => {
	beforeAll(() => {
		profile = env.profiles().findById(getDefaultProfileId());
	});

	it("should not render if not open", () => {
		const { asFragment, getByTestId } = render(<SearchRecipient isOpen={false} profile={profile} />);

		expect(() => getByTestId("modal__inner")).toThrow(/Unable to find an element by/);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render a modal", () => {
		const { asFragment, getByTestId } = render(<SearchRecipient isOpen={true} profile={profile} />);

		expect(getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_SEARCH_RECIPIENT.TITLE);
		expect(getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_SEARCH_RECIPIENT.DESCRIPTION);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render a modal with custom title and description", () => {
		const title = "Modal title";
		const description = "Modal description";
		const { asFragment, getByTestId } = render(
			<SearchRecipient isOpen={true} profile={profile} title={title} description={description} />,
		);

		expect(getByTestId("modal__inner")).toHaveTextContent("Modal title");
		expect(getByTestId("modal__inner")).toHaveTextContent("Modal description");
		expect(asFragment()).toMatchSnapshot();
	});
});
