import Transport, { Observer } from "@ledgerhq/hw-transport";
import { createTransportReplayer, RecordStore } from "@ledgerhq/hw-transport-mocker";
import { LedgerProvider } from "app/contexts/Ledger/Ledger";
import React from "react";
import { act, fireEvent, render, screen } from "utils/testing-library";

import { LedgerWaitingDevice } from "./LedgerWaitingDevice";

const transport: typeof Transport = createTransportReplayer(RecordStore.fromString(""));

describe("LedgerWaitingDevice", () => {
	it("should emit false when closed by button", () => {
		const onClose = jest.fn();
		const { asFragment } = render(
			<LedgerProvider transport={transport}>
				<LedgerWaitingDevice isOpen={true} onClose={onClose} />
			</LedgerProvider>,
		);

		expect(asFragment()).toMatchSnapshot();

		act(() => {
			fireEvent.click(screen.getByTestId("modal__close-btn"));
		});

		expect(onClose).toHaveBeenCalledWith(false);
	});

	it("should emit true when closed by context", () => {
		const onClose = jest.fn();
		const unsubscribe = jest.fn();
		let observer: Observer<any>;

		const listenSpy = jest.spyOn(transport, "listen").mockImplementationOnce((obv) => {
			observer = obv;
			return { unsubscribe };
		});

		render(
			<LedgerProvider transport={transport}>
				<LedgerWaitingDevice isOpen={true} onClose={onClose} />
			</LedgerProvider>,
		);

		act(() => {
			observer!.next({ type: "add", descriptor: "" });
		});

		expect(onClose).toHaveBeenCalledWith(true);

		listenSpy.mockReset();
	});
});
