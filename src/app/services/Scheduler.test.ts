import { Scheduler } from "./Scheduler";

describe("Scheduler test", () => {
	jest.useFakeTimers();

	it("should run an action after an determined interval", () => {
		const action = jest.fn();
		Scheduler(100).schedule([action]);
		jest.advanceTimersByTime(100);
		expect(action).toHaveBeenCalled();
	});

	it("should run an action using the default interval", () => {
		const action = jest.fn();
		Scheduler().schedule([action]);
		jest.advanceTimersByTime(300000);
		expect(action).toHaveBeenCalled();
	});

	it("should run actions and the done callback", () => {
		const action = jest.fn();
		const done = jest.fn();
		Scheduler().schedule([action], done);

		jest.advanceTimersByTime(300500);
		expect(action).toHaveBeenCalled();
		expect(done).toHaveBeenCalled();
	});
});
