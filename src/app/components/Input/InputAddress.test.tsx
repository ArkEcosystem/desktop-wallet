/* eslint-disable @typescript-eslint/require-await */
import { Contracts } from "@arkecosystem/platform-sdk-profiles";
import { act, renderHook } from "@testing-library/react-hooks";
import { EnvironmentProvider } from "app/contexts";
import { translations as commonTranslations } from "app/i18n/common/i18n";
import React from "react";
import { useForm } from "react-hook-form";
import { env, fireEvent, getDefaultProfileId, render } from "utils/testing-library";

import { InputAddress, InputAddressProperties } from "./InputAddress";

let profile: Contracts.IProfile;

describe("InputAddress", () => {
	beforeAll(() => {
		profile = env.profiles().findById(getDefaultProfileId());
	});

	const TestInputAddress = (properties: InputAddressProperties) => (
		<EnvironmentProvider env={env}>
			<InputAddress name="address" {...properties} />
		</EnvironmentProvider>
	);

	it("should render", () => {
		const { getByTestId, asFragment } = render(
			<TestInputAddress coin="ARK" network="ark.devnet" profile={profile} />,
		);

		expect(getByTestId("InputAddress__input")).toBeInTheDocument();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should validate a wrong address", async () => {
		const { result, waitForNextUpdate } = renderHook(() => useForm({ mode: "onChange" }));
		const { register, errors } = result.current;

		const { getByTestId } = render(
			<TestInputAddress coin="ARK" network="ark.devnet" registerRef={register} profile={profile} />,
		);

		act(() => {
			fireEvent.input(getByTestId("InputAddress__input"), { target: { value: "Abc" } });
		});

		await waitForNextUpdate();

		expect(errors.address?.message).toBe(commonTranslations.INPUT_ADDRESS.VALIDATION.NOT_VALID);
	});

	it("should validate a valid address and emit event", async () => {
		const onValidAddress = jest.fn();
		const { result, waitForNextUpdate } = renderHook(() => useForm({ mode: "onChange" }));
		const { register, errors } = result.current;
		const validAddress = "DT11QcbKqTXJ59jrUTpcMyggTcwmyFYRTM";

		const { getByTestId } = render(
			<TestInputAddress
				coin="ARK"
				network="ark.devnet"
				registerRef={register}
				onValidAddress={onValidAddress}
				profile={profile}
			/>,
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
			<TestInputAddress
				profile={profile}
				coin="ARK"
				network="ark.devnet"
				registerRef={register}
				additionalRules={{ minLength: 10 }}
			/>,
		);

		act(() => {
			fireEvent.input(getByTestId("InputAddress__input"), { target: { value: "Abc" } });
		});

		await waitForNextUpdate();

		expect(errors.address?.type).toBe("minLength");
	});

	it("should not use default validation", async () => {
		const { result } = renderHook(() => useForm({ mode: "onChange" }));
		const { register } = result.current;

		const { asFragment } = render(
			<TestInputAddress useDefaultRules={false} registerRef={register} profile={profile} />,
		);

		expect(asFragment()).toMatchSnapshot();
	});
});
