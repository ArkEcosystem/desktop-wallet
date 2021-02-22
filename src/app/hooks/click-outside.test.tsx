import { act } from "@testing-library/react-hooks";
import { clickOutsideHandler } from "app/hooks/click-outside";
import { fireEvent } from "utils/testing-library";

describe("ClickOutside Hook", () => {
	it("should not call callback if clicked on target element", () => {
		const el = document;
		const ref = { current: el };
		const cb = jest.fn();
		clickOutsideHandler(ref, cb);

		act(() => {
			fireEvent.mouseDown(el);
		});
		expect(cb).not.toBeCalled();
	});

	it("should call callback if clicked outside target element", () => {
		const div = document.createElement("div");
		const ref = { current: div };

		const cb = jest.fn();
		clickOutsideHandler(ref, cb);

		act(() => {
			fireEvent.mouseDown(document);
		});
		expect(cb).toBeCalled();
	});

	it("should do nothing if callback is not provided", () => {
		const div = document.createElement("div");
		const ref = { current: div };

		clickOutsideHandler(ref, null);

		act(() => {
			fireEvent.mouseDown(document);
		});
	});

	it("should cover the removeEvent", () => {
		const div = document.createElement("div");
		const ref = { current: div };
		const handler = clickOutsideHandler(ref, () => "test")();
		expect(handler).toBeUndefined();
	});
});
