import { createTransportReplayer } from "@ledgerhq/hw-transport-mocker";
import React from "react";
import { act, render } from "utils/testing-library";

import { LedgerListener } from "./LedgerListener";

describe("LedgerListener", () => {
	let mocker: typeof createTransportReplayer;

	beforeEach(() => {
		mocker = createTransportReplayer();
	});

	it("should handle next", () => {
		const onDevice = jest.fn();

		let onNext: Function;

		const listenMock = jest.spyOn(mocker, "listen").mockImplementation(({ next }: any) => (onNext = next));

		render(<LedgerListener transport={mocker} onDevice={onDevice} />);

		act(() => {
			const addParams = { type: "add", descriptor: "", deviceModel: { id: "1" } };
			onNext(addParams);
		});

		expect(onDevice).toHaveBeenCalledTimes(2);

		act(() => {
			const removeParams = { type: "remove", descriptor: "", deviceModel: {} };
			onNext(removeParams);
		});

		expect(onDevice).toHaveBeenCalledTimes(3);

		listenMock.mockReset();
	});
});
