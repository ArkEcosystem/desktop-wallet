/* eslint-disable @typescript-eslint/require-await */
import { Coins } from "@arkecosystem/platform-sdk";
import { BigNumber } from "@arkecosystem/platform-sdk-support";
import { renderHook } from "@testing-library/react-hooks";
import { useTranslation } from "react-i18next";
import { env } from "utils/testing-library";

import { common } from "./Common";

let t: any;
let network: Coins.Network;

describe("Common", () => {
	beforeAll(() => {
		network = env.profiles().first().wallets().first().network();

		const { result } = renderHook(() => useTranslation());
		t = result.current.t;
	});

	it("should validate low balance", () => {
		const commonValidation = common(t).fee(BigNumber.make(1), network);
		expect(commonValidation.validate.valid("1234")).toBe(
			t("TRANSACTION.VALIDATION.LOW_BALANCE", {
				balance: "0.00000001",
				coinId: network.coin(),
			}),
		);
	});

	it("should validate zero balance", () => {
		const error = t("TRANSACTION.VALIDATION.LOW_BALANCE", {
			balance: "0",
			coinId: network.coin(),
		});

		let commonValidation = common(t).fee(BigNumber.make(0), network);
		expect(commonValidation.validate.valid("1234")).toBe(error);

		commonValidation = common(t).fee(BigNumber.make(-1), network);
		expect(commonValidation.validate.valid("1234")).toBe(error);
	});

	it("should fail to validate negative fee", () => {
		const commonValidation = common(t).fee(BigNumber.make(1), network);
		expect(commonValidation.validate.valid("-1")).toBe(t("TRANSACTION.VALIDATION.FEE_NEGATIVE"));
	});
});
