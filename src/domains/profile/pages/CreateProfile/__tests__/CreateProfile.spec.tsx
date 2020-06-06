import React from "react";
import { IntlProvider } from "react-intl";
import { fireEvent, render, act } from "@testing-library/react";

import { CreateProfile } from "../";

describe("CreateProfile", () => {
	it("should render", () => {
		const { container, asFragment, getByTestId, getAllByTestId } = render(
			<IntlProvider locale="en-US">
				<CreateProfile />
			</IntlProvider>,
		);

		expect(container).toBeTruthy();
		expect(getByTestId("list-divided__items")).toBeTruthy();
		expect(getByTestId("create-profile__form")).toBeTruthy();
		expect(getAllByTestId("list-divided-item__inner-wrapper").length).toEqual(1);
		expect(asFragment()).toMatchSnapshot();
	});
});
