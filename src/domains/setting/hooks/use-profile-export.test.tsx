import { MemoryPassword, Profile } from "@arkecosystem/platform-sdk-profiles";
import { renderHook } from "@testing-library/react-hooks";
import { useProfileExport } from "domains/setting/hooks/use-profile-export";
import { env, getDefaultProfileId } from "utils/testing-library";

describe("useProfileExport", () => {
	let profile: Profile;

	beforeAll(() => {
		profile = env.profiles().findById(getDefaultProfileId());
	});

	it("should export with all settings enabled", async () => {
		const { result } = renderHook(() => useProfileExport(profile));

		const exportedData = result.current.formatExportData({
			excludeEmptyWallets: true,
			excludeWalletsWithoutName: true,
			excludeLedgerWallets: true,
		});

		const importedProfile = await env.profiles().import(exportedData);

		expect(importedProfile.settings().all()).toEqual(profile.settings().all());
	});

	it("should export with all settings disabled", async () => {
		const { result } = renderHook(() => useProfileExport(profile));

		const exportedData = result.current.formatExportData({
			excludeEmptyWallets: false,
			excludeWalletsWithoutName: false,
			excludeLedgerWallets: false,
		});

		const importedProfile = await env.profiles().import(exportedData);

		expect(importedProfile.settings().all()).toEqual(profile.settings().all());
	});

	it("should export password protected profile", async () => {
		const passwordProtectedProfile = env.profiles().findById("cba050f1-880f-45f0-9af9-cfe48f406052");
		const { result } = renderHook(() => useProfileExport(passwordProtectedProfile));

		const exportedData = result.current.formatExportData({
			excludeEmptyWallets: false,
			excludeWalletsWithoutName: false,
			excludeLedgerWallets: false,
		});

		const importedProfile = await env.profiles().import(exportedData, MemoryPassword.get(passwordProtectedProfile));

		expect(importedProfile.settings().all()).toEqual(passwordProtectedProfile.settings().all());
	});
});
