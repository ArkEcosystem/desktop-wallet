import { useEnvironmentContext } from "app/contexts";
import { useCallback, useEffect, useRef } from "react";

type Callback = () => Promise<void | any>;

type Job = {
	callback: Callback;
	interval: number;
};

export const useSynchronizer = (jobs: Job[]) => {
	const timers = useRef<number[]>([]);
	const { persist } = useEnvironmentContext();

	const run = useCallback(
		async (callback: Callback) => {
			await callback();
			await persist();
		},
		[persist],
	);

	const stop = useCallback((props?: { clearTimers: boolean }) => {
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

	return { start, stop, runAll };
};
