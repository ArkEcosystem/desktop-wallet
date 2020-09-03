import { toast, ToastOptions } from "react-toastify";

import { ToastService } from "./ToastService";

let subject: ToastService;
let options: ToastOptions;

beforeAll(() => {
	subject = new ToastService();
	options = subject.options();
});

describe("ToastService", () => {
	it.each(["info", "success", "warning", "error"])("should call toast %s method", (method) => {
		const mock = jest.spyOn(toast, method);

		expect(subject[method](method)).toBeTruthy();

		expect(mock).toHaveBeenCalledWith(method, options);
	});

	it.each(["info", "success", "warning", "error"])("should call toast %s method with options", (method) => {
		const mock = jest.spyOn(toast, method);

		expect(subject[method](method, { position: "top-right" })).toBeTruthy();

		expect(mock).toHaveBeenCalledWith(method, { ...options, position: "top-right" });
	});

	it("should call the toast dismiss method", () => {
		const mock = jest.spyOn(toast, "dismiss").mockImplementation();

		subject.dismiss();

		expect(mock).toHaveBeenCalledWith(undefined);
	});

	it("should call the toast dismiss method with toast id", () => {
		const mock = jest.spyOn(toast, "dismiss").mockImplementation();

		subject.dismiss(123);

		expect(mock).toHaveBeenCalledWith(123);
	});
});
