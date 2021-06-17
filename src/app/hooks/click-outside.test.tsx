import { act } from "@testing-library/react-hooks";
import { clickOutsideHandler } from "app/hooks/click-outside";
import { fireEvent } from "utils/testing-library";

describe("ClickOutside Hook", () => {
	it("should not call callback if clicked on target element", () => {
		const element = document;
		const reference = { current: element };
		const callback = jest.fn();
		clickOutsideHandler(reference, callback);

		act(() => {
			fireEvent.mouseDown(element);
		});
		expect(callback).not.toBeCalled();
	});

	it("should call callback if clicked outside target element", () => {
		const div = document.createElement("div");
		const reference = { current: div };

		const callback = jest.fn();
		clickOutsideHandler(reference, callback);

		act(() => {
			fireEvent.mouseDown(document);
		});
		expect(callback).toBeCalled();
	});

	it("should do nothing if callback is not provided", () => {
		const div = document.createElement("div");
		const reference = { current: div };

		clickOutsideHandler(reference, null);

		act(() => {
			fireEvent.mouseDown(document);
		});
	});

	it("should cover the removeEvent", () => {
		const div = document.createElement("div");
		const reference = { current: div };
		const handler = clickOutsideHandler(reference, () => "test")();
		expect(handler).toBeUndefined();
	});
});
