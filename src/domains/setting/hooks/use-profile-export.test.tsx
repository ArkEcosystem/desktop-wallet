import { Contracts, Helpers } from "@arkecosystem/platform-sdk-profiles";
import { renderHook } from "@testing-library/react-hooks";
import { useProfileExport } from "domains/setting/hooks/use-profile-export";
import { env, getDefaultProfileId } from "utils/testing-library";

describe("useProfileExport", () => {
	let profile: Contracts.IProfile;

	beforeAll(async () => {
		profile = env.profiles().findById(getDefaultProfileId());
		await profile.restore();
	});

	it("should export with all settings enabled", async () => {
		const { result } = renderHook(() => useProfileExport(profile));

		const exportedData = result.current.formatExportData({
			excludeEmptyWallets: true,
			excludeLedgerWallets: true,
		});

		const importedProfile = await env.profiles().import(exportedData);

		expect(importedProfile.settings().all()).toEqual(profile.settings().all());
	});

	it("should export with all settings disabled", async () => {
		const { result } = renderHook(() => useProfileExport(profile));

		const exportedData = result.current.formatExportData({
			excludeEmptyWallets: false,
			excludeLedgerWallets: false,
		});

		const importedProfile = await env.profiles().import(exportedData);

		expect(importedProfile.settings().all()).toEqual(profile.settings().all());
	});

	it("should export password protected profile", async () => {
		const passwordProtectedProfile = env.profiles().findById("cba050f1-880f-45f0-9af9-cfe48f406052");
		await passwordProtectedProfile.restore("password");
		const { result } = renderHook(() => useProfileExport(passwordProtectedProfile));

		const exportedData = result.current.formatExportData({
			excludeEmptyWallets: false,
			excludeLedgerWallets: false,
		});

		const importedProfile = await env.profiles().import(exportedData, "password");

		expect(importedProfile.settings().all()).toEqual(passwordProtectedProfile.settings().all());
	});
});
