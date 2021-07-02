import { Contracts } from "@arkecosystem/platform-sdk-profiles";
import { renderHook } from "@testing-library/react-hooks";
import { env, getDefaultProfileId } from "utils/testing-library";

import { useScreenshotProtection } from "./use-screenshot-protection";

let profile: Contracts.IProfile;

describe("useScreenshotProtection", () => {
	beforeEach(async () => {
		profile = env.profiles().findById(getDefaultProfileId());
		await env.profiles().restore(profile);
	});

	it("should set screenshot protection", () => {
		const profileSettingMock = jest.spyOn(profile.settings(), "get").mockReturnValue(true);

		const { result } = renderHook(() => useScreenshotProtection());
		result.current.setScreenshotProtection(profile);

		expect(profileSettingMock).toHaveBeenCalled();

		profileSettingMock.mockRestore();
	});

	it("should not set screenshot protection", () => {
		const profileSettingMock = jest.spyOn(profile.settings(), "get").mockReturnValue(false);

		const { result } = renderHook(() => useScreenshotProtection());
		result.current.setScreenshotProtection(profile);

		expect(profileSettingMock).toHaveBeenCalled();

		profileSettingMock.mockRestore();
	});
});
