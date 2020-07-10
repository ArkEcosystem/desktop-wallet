import React from "react";
import { render } from "testing-library";

import { translations } from "../../i18n";
import { ProfileCreated } from "./ProfileCreated";

describe("ProfileCreated", () => {
	it("should not render if not open", () => {
		const { asFragment, getByTestId } = render(<ProfileCreated isOpen={false} onStart={() => void 0} />);

		expect(() => getByTestId("modal__inner")).toThrow(/Unable to find an element by/);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render a modal", () => {
		const { asFragment, getByTestId } = render(<ProfileCreated isOpen={true} onStart={() => void 0} />);

		expect(getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_PROFILE_CREATED.TITLE);
		expect(getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_PROFILE_CREATED.DESCRIPTION_1);
		expect(getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_PROFILE_CREATED.DESCRIPTION_2);
		expect(getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_PROFILE_CREATED.START_TUTORIAL);
		expect(getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_PROFILE_CREATED.SKIP_TUTORIAL);
		expect(asFragment()).toMatchSnapshot();
	});
});
