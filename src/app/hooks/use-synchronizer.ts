import { DateTime } from "@arkecosystem/platform-sdk-intl";
import { useEnvironmentContext } from "app/contexts";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type Callback = () => Promise<void | any>;

type Job = {
	callback: Callback;
	interval: number;
};

type JobError = {
	timestamp: number;
	error: any;
};

export const useSynchronizer = (jobs: Job[]) => {
	const timers = useRef<number[]>([]);
	const { persist } = useEnvironmentContext();
	const [error, setError] = useState<JobError>();

	const run = useCallback(
		async (callback: Callback) => {
			try {
				await callback();
				await persist();
			} catch (error) {
				setError({ timestamp: DateTime.make().toUNIX(), error });
			}
		},
		[persist, setError],
	);

	const stop = useCallback((props?: { clearTimers: boolean }) => {
		setError(undefined);

		for (const timer of timers.current) {
			clearInterval(timer);
		}

		if (props?.clearTimers) {
			timers.current = [];
		}
	}, []);

	const start = useCallback(() => {
		stop(); // Stop previous jobs in progress
		for (const job of jobs) {
			timers.current.push(setInterval(() => run(job.callback), job.interval));
		}
	}, [run, jobs, stop]);

	const runAll = useCallback(() => Promise.allSettled(jobs.map((job) => run(job.callback))), [run, jobs]);

	useEffect(() => {
		const current = timers.current;
		return () => {
			for (const timer of current) {
				clearInterval(timer);
			}
		};
	}, [timers]);

	return useMemo(() => ({ start, stop, runAll, error, clearError: () => setError(undefined) }), [
		error,
		setError,
		start,
		stop,
		runAll,
	]);
};
