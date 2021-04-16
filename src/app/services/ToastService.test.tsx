import React from "react";
import { toast, ToastContainer, ToastOptions } from "react-toastify";
import { act, render, screen } from "utils/testing-library";

import { ToastService } from "./ToastService";
let subject: ToastService;
let options: ToastOptions;

beforeAll(() => {
	subject = new ToastService();
	options = subject.options();
});

beforeEach(() => {
	jest.useFakeTimers();
});

describe("ToastService", () => {
	it.each(["info", "success", "warning", "error"])("should call toast %s method", (method) => {
		const mock = jest.spyOn(toast, method);

		const { container } = render(<ToastContainer />);

		act(() => {
			subject[method](method);
			jest.runAllTimers();
		});

		expect(screen.queryByText(method)).toBeInTheDocument();
	});

	it.each(["info", "success", "warning", "error"])("should call toast %s method with options", (method) => {
		render(<ToastContainer />);

		act(() => {
			subject[method](method, { position: "top-right" });
			jest.runAllTimers();
		});

		expect(screen.queryByText(method)).toBeInTheDocument();
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
