/* eslint-disable @typescript-eslint/require-await */
import { render } from "@testing-library/react";
import { renderHook } from "@testing-library/react-hooks";
import React from "react";
import { FormContext, useForm } from "react-hook-form";

import { FirstStep } from "../VoteTransactionSend";

describe("VoteTransactionSend", () => {
	it("should render 1st step", async () => {
		const { result: form } = renderHook(() => useForm());
		const { getByTestId, asFragment } = render(
			<FormContext {...form.current}>
				<FirstStep />
			</FormContext>,
		);

		expect(getByTestId("VoteTransactionSend__step--first")).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});
});
