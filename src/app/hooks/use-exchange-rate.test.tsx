import { renderHook, RenderHookResult } from "@testing-library/react-hooks";
import React from "react";
import { env, WithProviders } from "utils/testing-library";

import { useExchangeRate } from "./use-exchange-rate";

describe("useExchangeRate", () => {
	const wrapper = ({ children }: React.PropsWithChildren<{}>) => <WithProviders>{children}</WithProviders>;

	it("should return a function to convert values based on exchange rates", () => {
		jest.spyOn(env.exchangeRates(), "exchange").mockReturnValueOnce(1);

		const { result } = renderHook(
			() =>
				useExchangeRate({
					exchangeTicker: "USD",
					ticker: "ARK",
				}),
			{
				wrapper,
			},
		);

		expect(typeof result.current.convert).toBe("function");

		const converted = result.current.convert(1);
		expect(converted).toEqual(1);
	});

	it("should default to 0 when ticker or exchangeTicker are not provided", () => {
		let hook: RenderHookResult<any, any>;

		hook = renderHook(
			() =>
				useExchangeRate({
					exchangeTicker: "USD",
				}),
			{
				wrapper,
			},
		);

		expect(hook.result.current.convert(1)).toEqual(0);

		hook = renderHook(
			() =>
				useExchangeRate({
					ticker: "ARK",
				}),
			{
				wrapper,
			},
		);

		expect(hook.result.current.convert(1)).toEqual(0);
	});

	it("should return 0 when value is undefined", () => {
		const {
			result: { current },
		} = renderHook(
			() =>
				useExchangeRate({
					exchangeTicker: "USD",
					ticker: "ARK",
				}),
			{
				wrapper,
			},
		);

		expect(current.convert(undefined)).toEqual(0);
	});
});
