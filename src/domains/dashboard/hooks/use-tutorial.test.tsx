import { Contracts } from "@arkecosystem/platform-sdk-profiles";
import { renderHook } from "@testing-library/react-hooks";
import React from "react";
import { act } from "react-test-renderer";
import { env, getDefaultProfileId, waitFor } from "utils/testing-library";

import { ConfigurationProvider } from "../../../app/contexts";
import { useTutorial } from "./use-tutorial";

let profile: Contracts.IProfile;

const wrapper = ({ children }: any) => (
	<ConfigurationProvider defaultConfiguration={{ profileIsSyncing: false }}>{children}</ConfigurationProvider>
);

describe("useTutorial", () => {
	beforeAll(() => {
		profile = env.profiles().findById(getDefaultProfileId());
	});
	afterEach(() => {
		profile.flush();
	});

	it("should show tutorial for the new profile", () => {
		const { result } = renderHook(() => useTutorial(profile), { wrapper });

		expect(result.current.showTutorial).toBeTruthy();
	});

	it("should able to skip tutorial", () => {
		const { result } = renderHook(() => useTutorial(profile), { wrapper });

		expect(result.current.showTutorial).toBeTruthy();

		act(() => {
			result.current.skipTutorial();
		});

		expect(result.current.showTutorial).toBeFalsy();
	});

	it("should wait for profile syncing", async () => {
		const wrapper = ({ children }: any) => (
			<ConfigurationProvider defaultConfiguration={{ profileIsSyncing: true }}>{children}</ConfigurationProvider>
		);

		const { result } = renderHook(() => useTutorial(profile), { wrapper });

		await waitFor(() => expect(result.current.showTutorial).toBeFalsy(), { timeout: 4000 });
	});
});
