import { BigNumber } from "@arkecosystem/platform-sdk-support";
import { renderHook } from "@testing-library/react-hooks";
import { EnvironmentProvider } from "app/contexts";
import React from "react";
import { env } from "utils/testing-library";

import { useValidation } from "./use-validation";

const defaultFees = {
	min: "1",
	max: "5",
	avg: "2",
	static: "2",
};
const mockNetwork = {
	coin: jest.fn,
};

describe("useValidation hook", () => {
	describe("Common#fee", () => {
		it("should ignore fee validation if network not provided", () => {
			const wrapper = ({ children }: any) => <EnvironmentProvider env={env}>{children} </EnvironmentProvider>;
			const {
				result: { current },
			} = renderHook(() => useValidation(), { wrapper });
			const balance = BigNumber.make(5);
			const validation = current.common.fee(balance);
			const isValid = validation.validate.valid(2);

			expect(isValid).toBe(true);
		});

		it("should error for zero balance", () => {
			const wrapper = ({ children }: any) => <EnvironmentProvider env={env}>{children} </EnvironmentProvider>;
			const {
				result: { current },
			} = renderHook(() => useValidation(), { wrapper });
			const balance = BigNumber.ZERO;
			const validation = current.common.fee(balance, mockNetwork);
			const isValid = validation.validate.valid(2);

			expect(isValid).not.toBe(true);
		});

		it("should error for negative balance", () => {
			const wrapper = ({ children }: any) => <EnvironmentProvider env={env}>{children} </EnvironmentProvider>;
			const {
				result: { current },
			} = renderHook(() => useValidation(), { wrapper });
			const balance = BigNumber.make(-5);
			const validation = current.common.fee(balance, mockNetwork);
			const isValid = validation.validate.valid(2);

			expect(isValid).not.toBe(true);
		});

		it("should error for lower than fee balance", () => {
			const wrapper = ({ children }: any) => <EnvironmentProvider env={env}>{children} </EnvironmentProvider>;
			const {
				result: { current },
			} = renderHook(() => useValidation(), { wrapper });
			const balance = BigNumber.make(1);
			const validation = current.common.fee(balance, mockNetwork);
			const isValid = validation.validate.valid(2);

			expect(isValid).not.toBe(true);
		});
	});
});
