import LedgerTransport from "@ledgerhq/hw-transport-node-hid-singleton";
import React from "react";
import { act } from "react-dom/test-utils";
import { render } from "utils/testing-library";

import { LedgerListener } from "./LedgerListener";

describe("LedgerListener", () => {
	it("should sync devices", async () => {
		let onNext: any;
		const listenMock = jest.spyOn(LedgerTransport, "listen").mockImplementation(({ next }: any) => (onNext = next));
		const consoleMock = jest.spyOn(console, "log").mockImplementation(() => null);

		render(<LedgerListener />);

		await new Promise((resolve) => setTimeout(resolve, 200));

		const addParams = { type: "add", descriptor: "", deviceModel: { id: "1" } };
		act(() => {
			onNext(addParams);
		});
		expect(consoleMock).toHaveBeenCalledWith("[Ledger] add", addParams);

		const removeParams = { type: "remove", descriptor: "", deviceModel: {} };
		act(() => {
			onNext(removeParams);
		});
		expect(consoleMock).toHaveBeenCalledWith("[Ledger] remove", removeParams);

		listenMock.mockReset();
	});
});
