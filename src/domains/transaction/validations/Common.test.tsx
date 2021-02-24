/* eslint-disable @typescript-eslint/require-await */
import { BigNumber } from "@arkecosystem/platform-sdk-support";
import { renderHook } from "@testing-library/react-hooks";
import { useTranslation } from "react-i18next";
import { env } from "utils/testing-library";

import { common } from "./Common";

describe("Common", () => {
	it("should validate low balance", () => {
		const { result } = renderHook(() => useTranslation());
		const { t } = result.current;
		const network = env.profiles().first().wallets().first().network();
		const comm = common(t).fee(BigNumber.make(1), network);
		expect(comm.validate.valid("1234")).toBeTruthy();
	});
});
