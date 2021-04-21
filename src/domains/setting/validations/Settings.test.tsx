/* eslint-disable @typescript-eslint/require-await */
import { renderHook } from "@testing-library/react-hooks";
import { useTranslation } from "react-i18next";

import { settings } from "./Settings";

describe("Settings", () => {
	it("should require a password of 6 characters minimum", () => {
		const { result } = renderHook(() => useTranslation());
		const { t } = result.current;

		const settingsValidation = settings(t);
		expect(settingsValidation.password("password")).toEqual({
			minLength: {
				message: t("COMMON.VALIDATION.MIN_LENGTH", {
					field: t("SETTINGS.GENERAL.PERSONAL.PASSWORD"),
					minLength: 6,
				}),
				value: 6,
			},
		});

		expect(settingsValidation.password()).toEqual({
			minLength: {
				message: t("COMMON.VALIDATION.MIN_LENGTH", {
					field: t("SETTINGS.GENERAL.PERSONAL.PASSWORD"),
					minLength: 6,
				}),
				value: 6,
			},
		});
	});

	it("should match password and confirm password", () => {
		const { result } = renderHook(() => useTranslation());
		const { t } = result.current;

		const settingsValidation = settings(t);
		const confirmPassword = settingsValidation.confirmPassword("password");
		expect(confirmPassword.validate("password")).toEqual(true);
	});

	it("should fail on password and confirm password mismatch", () => {
		const { result } = renderHook(() => useTranslation());
		const { t } = result.current;

		const settingsValidation = settings(t);
		const confirmPassword = settingsValidation.confirmPassword("password");
		expect(confirmPassword.validate("password2")).toEqual(t("COMMON.VALIDATION.PASSWORD_MISMATCH"));
	});

	it("should require password to be entered before confirm password", () => {
		const { result } = renderHook(() => useTranslation());
		const { t } = result.current;

		const settingsValidation = settings(t);
		const confirmPassword = settingsValidation.confirmPassword();
		expect(confirmPassword.validate("password2")).toEqual(
			t("COMMON.VALIDATION.FIELD_REQUIRED", {
				field: t("SETTINGS.GENERAL.PERSONAL.PASSWORD"),
			}).toString(),
		);
	});
});
