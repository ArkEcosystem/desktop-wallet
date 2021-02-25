import { act, renderHook } from "@testing-library/react-hooks";

import { useScroll } from "./use-scroll";

let eventMap: any;

describe("useScroll", () => {
	beforeEach(() => {
		eventMap = {};

		window.addEventListener = jest.fn((eventName, callback) => {
			eventMap[eventName] = callback;
		});
	});

	afterEach(() => {
		window.removeEventListener = jest.fn((eventName) => {
			delete eventMap[eventName];
		});
	});

	it("should return window scroll offset", () => {
		const { result } = renderHook(() => useScroll());

		act(() => {
			eventMap.scroll();
		});

		expect(result.current.valueOf()).toEqual(0);
	});
});
