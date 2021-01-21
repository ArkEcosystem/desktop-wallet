import { PluginHooks } from "./plugin-hooks";

describe("Plugin Hooks", () => {
	let subject: PluginHooks;

	beforeEach(() => {
		subject = new PluginHooks();
	});

	it("should execute a command", () => {
		let result = 0;
		subject.registerCommand("test.plus", () => (result = result + 1));
		subject.executeCommand("test.plus");
		expect(result).toBe(1);
	});

	it("should has command by key", () => {
		subject.registerCommand("test.plus", () => console.log("test"));
		expect(subject.hasCommand("test.plus")).toBe(true);
	}),
		it("should execute a command with args", () => {
			let result = 0;
			subject.registerCommand("test.plus", (value: number) => (result = result + value));
			subject.executeCommand("test.plus", 5);
			expect(result).toBe(5);
		});

	it("should fail to register an invalid command", () => {
		expect(() => subject.registerCommand("test.plus", 1)).toThrowError();
	});

	it("should fail to register a duplicate handler", () => {
		subject.registerCommand("test.log", (value) => console.log(value));
		expect(() => subject.registerCommand("test.log", () => void 0)).toThrowError(
			"Command test.log already registered",
		);
	});

	it("should apply multiple filters", () => {
		subject.addFilter("test", "log", (value: string) => value + "[1]");
		subject.addFilter("test", "log", (value: string) => value + "[2]");
		const result = subject.applyFilter("test", "log", "testing");
		expect(result).toBe("testing[1][2]");
	});

	it("should fail to add an invalid filter", () => {
		expect(() => subject.addFilter("test", "log", 1)).toThrowError();
	});

	it("should return undefined if no filter is applied", () => {
		expect(subject.applyFilter("test", "log", "testing")).toBeUndefined();
	});

	it("should clear all", () => {
		subject.addFilter("test", "log", (value: string) => value + "[1]");
		subject.registerCommand("test.plus", (value: number) => console.log(value));

		subject.clearAll();

		expect(() => subject.executeCommand("test.plus")).toThrowError("Command test.plus not found");
	});
});
