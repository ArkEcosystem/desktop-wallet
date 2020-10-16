import React, { useEffect } from "react";
import { act, fireEvent, render, screen, waitFor } from "utils/testing-library";

import { useSynchronizer } from "./use-synchronizer";

describe("Synchronizer Hook", () => {
	let onCall = jest.fn();
	const job1 = jest.fn(() => Promise.resolve(onCall(1)));
	const job2 = jest.fn(() => Promise.resolve(onCall(2)));
	const jobs = [
		{
			callback: job1,
			interval: 100,
		},
		{
			callback: job2,
			interval: 50,
		},
	];

	beforeEach(() => {
		jest.useFakeTimers();
		onCall = jest.fn();
	});

	it("should run periodically", async () => {
		const Component = () => {
			const { start } = useSynchronizer(jobs);

			useEffect(() => {
				start();
			}, [start]);

			return <h1>Test</h1>;
		};

		const { unmount } = render(<Component />);

		jest.advanceTimersByTime(200);

		await waitFor(() => expect(onCall).toHaveBeenCalledTimes(6));

		unmount();

		await waitFor(() => expect(clearInterval).toHaveBeenCalledTimes(2));
	});

	it("should stop jobs", async () => {
		const Component = () => {
			const { start, stop } = useSynchronizer(jobs);

			useEffect(() => {
				start();
			}, [start]);

			return <button onClick={stop}>Stop</button>;
		};

		render(<Component />);

		jest.advanceTimersByTime(200);

		await waitFor(() => expect(onCall).toHaveBeenCalledTimes(6));

		act(() => {
			fireEvent.click(screen.getByRole("button"));
		});

		await waitFor(() => expect(clearInterval).toHaveBeenCalledTimes(2));
	});
});
