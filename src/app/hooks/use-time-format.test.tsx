import { Contracts } from "@arkecosystem/platform-sdk-profiles";
import { renderHook } from "@testing-library/react-hooks";
import { createMemoryHistory } from "history";
import { when } from "jest-when";
import React from "react";
import { Router } from "react-router-dom";
import { env, getDefaultProfileId, WithProviders } from "utils/testing-library";

import { useTimeFormat } from "./use-time-format";

let profile: Contracts.IProfile;

const history = createMemoryHistory();
const dashboardURL = `/profiles/${getDefaultProfileId()}/dashboard`;

describe("useTimeFormat", () => {
	beforeAll(() => {
		history.push(dashboardURL);
		profile = env.profiles().findById(getDefaultProfileId());
	});

	it("should return format without profile route", () => {
		const wrapper = ({ children }: any) => <WithProviders>{children}</WithProviders>;
		const { result } = renderHook(() => useTimeFormat(), { wrapper });

		expect(result.current).toBe("DD.MM.YYYY h:mm A");
	});

	it("should return format from profile", () => {
		const settingsSpy = jest.spyOn(profile.settings(), "get");
		when(settingsSpy).calledWith(Contracts.ProfileSetting.TimeFormat).mockReturnValueOnce("format");

		const wrapper = ({ children }: any) => (
			<WithProviders>
				<Router history={history}>{children}</Router>
			</WithProviders>
		);
		const { result } = renderHook(() => useTimeFormat(), { wrapper });

		expect(result.current).toBe("DD.MM.YYYY format");
	});

	it("should return default format if profile has not setting", () => {
		const settingsSpy = jest.spyOn(profile.settings(), "get");
		when(settingsSpy).calledWith(Contracts.ProfileSetting.TimeFormat).mockReturnValueOnce();

		const wrapper = ({ children }: any) => (
			<WithProviders>
				<Router history={history}>{children}</Router>
			</WithProviders>
		);
		const { result } = renderHook(() => useTimeFormat(), { wrapper });

		expect(result.current).toBe("DD.MM.YYYY h:mm A");
	});
});
