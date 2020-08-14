import { ProfilePluginService } from "./profile.service";

let subject: ProfilePluginService;

beforeEach(() => {
	subject = new ProfilePluginService();
});

it("should call callback on profile change", () => {
	const callback = jest.fn();
	subject.onDidProfileChange(callback);
	subject.emitProfileChange({ a: 1 });
	expect(callback).toHaveBeenCalledWith({ a: 1 });
});
