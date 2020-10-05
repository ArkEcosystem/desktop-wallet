import Transport, { Observer } from "@ledgerhq/hw-transport";
import { createTransportReplayer, RecordStore } from "@ledgerhq/hw-transport-mocker";
import React from "react";
import { act, render, screen, waitFor } from "utils/testing-library";

import { useLedger } from "./use-ledger";

describe("Use Ledger", () => {
	let transport: typeof Transport;

	beforeEach(() => {
		transport = createTransportReplayer(RecordStore.fromString(""));
	});

	it("should listen for device", async () => {
		const Component = () => {
			const { hasDeviceAvailable, error } = useLedger(transport);
			return (
				<div>
					{error && <span>{error}</span>}
					<span>{hasDeviceAvailable ? "On" : "Off"}</span>
				</div>
			);
		};

		const unsubscribe = jest.fn();
		let observer: Observer<any>;

		const listenSpy = jest.spyOn(transport, "listen").mockImplementationOnce((obv) => {
			observer = obv;
			return { unsubscribe };
		});

		render(<Component />);

		act(() => {
			observer!.next({ type: "add", descriptor: "" });
		});

		await waitFor(() => expect(screen.queryByText("On")).toBeInTheDocument());

		act(() => {
			observer!.next({ type: "remove", descriptor: "" });
		});

		await waitFor(() => expect(screen.queryByText("Off")).toBeInTheDocument());

		act(() => {
			observer!.next({ type: "add", descriptor: "", deviceModel: { id: "nanoX" } });
		});

		await waitFor(() => expect(screen.queryByText("On")).toBeInTheDocument());

		act(() => {
			observer.error(new Error("Test Error"));
			observer.complete();
		});

		await waitFor(() => expect(screen.queryByText("Test Error")).toBeInTheDocument());

		listenSpy.mockReset();
	});
});
