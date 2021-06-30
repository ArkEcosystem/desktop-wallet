import "@testing-library/jest-dom/extend-expect";
import "mutationobserver-shim";

Object.defineProperty(window, "matchMedia", {
	value: jest.fn().mockImplementation((query) => ({
		// deprecated
		addEventListener: jest.fn(),

		addListener: jest.fn(),

		dispatchEvent: jest.fn(),

		matches: false,

		media: query,

		onchange: null,

		removeEventListener: jest.fn(),
		// deprecated
		removeListener: jest.fn(),
	})),
	writable: true,
});

global.fetch = require("jest-fetch-mock");
