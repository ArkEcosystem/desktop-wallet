import { Contracts } from "@arkecosystem/platform-sdk-profiles";
import { renderHook } from "@testing-library/react-hooks";
import { createMemoryHistory } from "history";
import { when } from "jest-when";
import React from "react";
import { Router } from "react-router-dom";
import { env, getDefaultProfileId, WithProviders } from "utils/testing-library";

import { useTimeFormat } from "./use-time-format";

const history = createMemoryHistory();
const dashboardURL = `/profiles/${getDefaultProfileId()}/dashboard`;

describe("useTimeFormat", () => {
	it("should return format without profile route", () => {
		const wrapper = ({ children }: any) => <WithProviders>{children}</WithProviders>;
		const { result } = renderHook(() => useTimeFormat(), { wrapper });

		expect(result.current).toBe("DD.MM.YYYY HH:mm");
	});

	it("should return format from profile", () => {
		history.push(dashboardURL);

		const profile = env.profiles().findById(getDefaultProfileId());

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
		history.push(dashboardURL);

		const profile = env.profiles().findById(getDefaultProfileId());

		const settingsSpy = jest.spyOn(profile.settings(), "get");
		when(settingsSpy).calledWith(Contracts.ProfileSetting.TimeFormat).mockReturnValueOnce();

		const wrapper = ({ children }: any) => (
			<WithProviders>
				<Router history={history}>{children}</Router>
			</WithProviders>
		);
		const { result } = renderHook(() => useTimeFormat(), { wrapper });

		expect(result.current).toBe("DD.MM.YYYY HH:mm");
	});
});
