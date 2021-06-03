import { renderHook } from "@testing-library/react-hooks";

import { useImportOptions } from "./use-import-options";

describe("useImportOptions", () => {
	it("should return options and default option", () => {
		const {
			result: { current },
		} = renderHook(() =>
			useImportOptions({
				address: {
					default: true,
					permissions: [],
				},
				privateKey: {
					default: false,
					permissions: [],
				},
			}),
		);

		expect(current.options).toHaveLength(2);
		expect(current.options[0].value).toBe("address");
		expect(current.defaultOption).toBe("address");
	});

	it("should return options from the available options", () => {
		const {
			result: { current },
		} = renderHook(() =>
			useImportOptions({
				address: {
					default: true,
					permissions: [],
				},
				secret: {
					default: false,
					permissions: [],
				},
			}),
		);

		expect(current.options).toHaveLength(1);
		expect(current.options[0].value).toBe("address");
	});

	it("should convert method name", () => {
		const {
			result: { current },
		} = renderHook(() =>
			useImportOptions({
				bip38: {
					default: true,
					permissions: [],
				},
				bip39: {
					default: false,
					permissions: [],
				},
			}),
		);

		expect(current.options).toHaveLength(2);
		expect(current.options[0].value).toBe("mnemonic");
		expect(current.options[1].value).toBe("encryptedWif");
	});

	it("should return default option if exist in the available options", () => {
		const {
			result: { current },
		} = renderHook(() =>
			useImportOptions({
				address: {
					default: false,
					permissions: [],
				},
				secret: {
					default: true,
					permissions: [],
				},
			}),
		);

		expect(current.defaultOption).not.toBe("secret");
	});

	it("should return first option as default if doesn't have default option in network", () => {
		const {
			result: { current },
		} = renderHook(() =>
			useImportOptions({
				bip39: {
					default: false,
					permissions: [],
				},
				address: {
					default: false,
					permissions: [],
				},
			}),
		);

		expect(current.defaultOption).toBe("mnemonic");
	});
});
