import { act, renderHook } from "@testing-library/react-hooks";
import { EnvironmentProvider } from "app/contexts";
import React from "react";
import { useForm } from "react-hook-form";
import { env, fireEvent, render } from "utils/testing-library";

import { InputAddress, InputAddressProps } from "./InputAddress";

describe("InputAddress", () => {
	const TestInputAddress = (props: InputAddressProps) => (
		<EnvironmentProvider env={env}>
			<InputAddress name="address" {...props} />
		</EnvironmentProvider>
	);

	it("should render", () => {
		const { getByTestId, asFragment } = render(<TestInputAddress coin="ARK" network="devnet" />);
		expect(getByTestId("InputAddress__input")).toBeInTheDocument();
		expect(getByTestId("InputAddress__qr-button")).toBeInTheDocument();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should emit event whe clicking on qr button", () => {
		const onQRButtonClick = jest.fn();
		const { getByTestId } = render(
			<TestInputAddress coin="ARK" network="devnet" onQRCodeClick={onQRButtonClick} />,
		);
		fireEvent.click(getByTestId("InputAddress__qr-button"));
		expect(onQRButtonClick).toHaveBeenCalled();
	});

	it("should validate a wrong address", async () => {
		const { result, waitForNextUpdate } = renderHook(() => useForm({ mode: "onChange" }));
		const { register, errors } = result.current;

		const { getByTestId } = render(<TestInputAddress coin="ARK" network="devnet" registerRef={register} />);

		act(() => {
			fireEvent.input(getByTestId("InputAddress__input"), { target: { value: "Abc" } });
		});

		await waitForNextUpdate();
		expect(errors.address?.message).toBe("The address is not valid");
	});

	it("should validate a valid address and emit event", async () => {
		const onValidAddress = jest.fn();
		const { result, waitForNextUpdate } = renderHook(() => useForm({ mode: "onChange" }));
		const { register, errors } = result.current;
		const validAddress = "DT11QcbKqTXJ59jrUTpcMyggTcwmyFYRTM";

		const { getByTestId } = render(
			<TestInputAddress coin="ARK" network="devnet" registerRef={register} onValidAddress={onValidAddress} />,
		);

		act(() => {
			fireEvent.input(getByTestId("InputAddress__input"), {
				target: { value: validAddress },
			});
		});

		await waitForNextUpdate();
		expect(errors.address?.message).toBe(undefined);
		expect(onValidAddress).toHaveBeenCalledWith(validAddress);
	});

	it("should validate with additional rules", async () => {
		const { result, waitForNextUpdate } = renderHook(() => useForm({ mode: "onChange" }));
		const { register, errors } = result.current;

		const { getByTestId } = render(
			<TestInputAddress coin="ARK" network="devnet" registerRef={register} additionalRules={{ minLength: 10 }} />,
		);

		act(() => {
			fireEvent.input(getByTestId("InputAddress__input"), { target: { value: "Abc" } });
		});

		await waitForNextUpdate();
		expect(errors.address?.type).toBe("minLength");
	});
});
