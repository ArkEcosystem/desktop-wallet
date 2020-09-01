import { Scheduler } from "./Scheduler";

describe("Scheduler test", () => {
	jest.useFakeTimers();

	it("should run an action after an determined interval", () => {
		const job = jest.fn();
		const scheduler = new Scheduler(100);
		scheduler.schedule([job]);
		jest.advanceTimersByTime(100);
		expect(job).toHaveBeenCalled();
	});

	it("should run an action using the default interval", () => {
		const job = jest.fn();
		const scheduler = new Scheduler();
		scheduler.schedule([action]);
		jest.advanceTimersByTime(300000);
		expect(job).toHaveBeenCalled();
	});

	it("should run actions and the done callback", () => {
		const job = jest.fn();
		const doneCallback = jest.fn();
		const scheduler = new Scheduler();
		scheduler.schedule([job], doneCallback);

		jest.advanceTimersByTime(300500);
		expect(job).toHaveBeenCalled();
		expect(doneCallback).toHaveBeenCalled();
	});
});
