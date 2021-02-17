import { act as hookAct, renderHook } from "@testing-library/react-hooks";
import { ConfigurationProvider, EnvironmentProvider } from "app/contexts";
import React, { useEffect } from "react";
import { act, env, fireEvent, render, screen, waitFor } from "utils/testing-library";

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

	it("should stop jobs and clear timers", async () => {
		const Component = () => {
			const { start, stop } = useSynchronizer(jobs);

			useEffect(() => {
				start();
			}, [start]);

			return <button onClick={() => stop({ clearTimers: true })}>Stop</button>;
		};

		render(<Component />);

		jest.advanceTimersByTime(200);

		await waitFor(() => expect(onCall).toHaveBeenCalledTimes(6));

		act(() => {
			fireEvent.click(screen.getByRole("button"));
		});

		await waitFor(() => expect(clearInterval).toHaveBeenCalledTimes(2));
	});

	it("should catch and return errors from jobs", async () => {
		const erroringJob = jest.fn(() => Promise.reject("Some error"));

		const jobsWithErrors = [
			{
				callback: erroringJob,
				interval: 50,
			},
		];

		const wrapper = ({ children }: any) => (
			<EnvironmentProvider env={env}>
				<ConfigurationProvider>{children}</ConfigurationProvider>
			</EnvironmentProvider>
		);

		const { result } = renderHook(() => useSynchronizer(jobsWithErrors), { wrapper });

		await hookAct(async () => {
			result.current.runAll();
			await waitFor(() =>
				expect(result.current.error).toEqual({ error: "Some error", timestamp: expect.any(Number) }),
			);
		});
	});

	it("should clear errors", async () => {
		const erroringJob = jest.fn(() => Promise.reject("Some error"));

		const jobsWithErrors = [
			{
				callback: erroringJob,
				interval: 50,
			},
		];

		const wrapper = ({ children }: any) => (
			<EnvironmentProvider env={env}>
				<ConfigurationProvider>{children}</ConfigurationProvider>
			</EnvironmentProvider>
		);

		const { result } = renderHook(() => useSynchronizer(jobsWithErrors), { wrapper });

		await hookAct(async () => {
			result.current.runAll();
			await waitFor(() =>
				expect(result.current.error).toEqual({ error: "Some error", timestamp: expect.any(Number) }),
			);

			result.current.clearError();

			await waitFor(() => expect(result.current.error).toBeUndefined());
		});
	});
});
