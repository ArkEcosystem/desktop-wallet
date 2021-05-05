import { Contracts } from "@arkecosystem/platform-sdk-profiles";
import { renderHook } from "@testing-library/react-hooks";
import { useProfileExport } from "domains/setting/hooks/use-profile-export";
import { env, getDefaultPassword, getDefaultProfileId, getPasswordProtectedProfileId } from "utils/testing-library";

describe("useProfileExport", () => {
	let profile: Contracts.IProfile;
	let passwordProtectedProfile: Contracts.IProfile;

	beforeAll(async () => {
		profile = env.profiles().findById(getDefaultProfileId());
		passwordProtectedProfile = env.profiles().findById(getPasswordProtectedProfileId());

		await env.profiles().restore(profile);
	});

	it("should export with all settings enabled", async () => {
		const { result } = renderHook(() => useProfileExport({ profile, env }));

		const exportedData = result.current.formatExportData({
			excludeEmptyWallets: true,
			excludeLedgerWallets: true,
		});

		const importedProfile = await env.profiles().import(exportedData);

		expect(importedProfile.settings().all()).toEqual(profile.settings().all());
	});

	it("should export with all settings disabled", async () => {
		const { result } = renderHook(() => useProfileExport({ profile, env }));

		const exportedData = result.current.formatExportData({
			excludeEmptyWallets: false,
			excludeLedgerWallets: false,
		});

		const importedProfile = await env.profiles().import(exportedData);

		expect(importedProfile.settings().all()).toEqual(profile.settings().all());
	});

	it("should export password protected profile", async () => {
		await env.profiles().restore(passwordProtectedProfile, getDefaultPassword());
		await passwordProtectedProfile.sync();

		const { result } = renderHook(() => useProfileExport({ profile: passwordProtectedProfile, env }));

		passwordProtectedProfile.password().set(getDefaultPassword());

		const exportedData = result.current.formatExportData({
			excludeEmptyWallets: false,
			excludeLedgerWallets: false,
		});

		const importedProfile = await env.profiles().import(exportedData, getDefaultPassword());

		expect(importedProfile.settings().all()).toEqual(passwordProtectedProfile.settings().all());
	});
});
