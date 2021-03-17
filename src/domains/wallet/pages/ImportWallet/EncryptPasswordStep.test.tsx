import { renderHook } from "@testing-library/react-hooks";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { render } from "utils/testing-library";

import { EncryptPasswordStep } from "./EncryptPasswordStep";

describe("ImportWallet - Password Encryption Step", () => {
	it("should render", () => {
		const { result: form } = renderHook(() => useForm());
		const { getByTestId, asFragment } = render(
			<FormProvider {...form.current}>
				<EncryptPasswordStep />
			</FormProvider>,
		);

		expect(getByTestId("EncryptPassword")).toBeInTheDocument();
		expect(asFragment).toMatchSnapshot();
	});
});
