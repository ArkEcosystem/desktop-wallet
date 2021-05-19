/* eslint-disable @typescript-eslint/require-await */
import { renderHook } from "@testing-library/react-hooks";
import { useTranslation } from "react-i18next";

import { password } from "./password";

describe("Password Validation", () => {
	it("should require a password of 6 characters minimum", () => {
		const { result } = renderHook(() => useTranslation());
		const { t } = result.current;

		const passwordRule = password(t);
		expect(passwordRule.password("password").minLength).toEqual({
			message: t("COMMON.VALIDATION.MIN_LENGTH", {
				field: t("SETTINGS.GENERAL.PERSONAL.PASSWORD"),
				minLength: 6,
			}),
			value: 6,
		});
	});

	it("should require different password than the old password", () => {
		const { result } = renderHook(() => useTranslation());
		const { t } = result.current;

		const passwordRule = password(t);
		const passwordValidation = passwordRule.password("password");
		expect(passwordValidation.validate("password")).toEqual(t("COMMON.VALIDATION.PASSWORD_SAME_AS_OLD"));
		expect(passwordValidation.validate("new password")).toEqual(true);
	});

	it("should match password and confirm password", () => {
		const { result } = renderHook(() => useTranslation());
		const { t } = result.current;

		const passwordValidation = password(t);
		const confirmPassword = passwordValidation.confirmPassword("password");
		expect(confirmPassword.validate("password")).toEqual(true);
	});

	it("should fail on password and confirm password mismatch", () => {
		const { result } = renderHook(() => useTranslation());
		const { t } = result.current;

		const passwordValidation = password(t);
		const confirmPassword = passwordValidation.confirmPassword("password");
		expect(confirmPassword.validate("password2")).toEqual(t("COMMON.VALIDATION.PASSWORD_MISMATCH"));
	});

	it("should require password to be entered before confirm password", () => {
		const { result } = renderHook(() => useTranslation());
		const { t } = result.current;

		const passwordValidation = password(t);
		const confirmPassword = passwordValidation.confirmPassword();
		expect(confirmPassword.validate("password2")).toEqual(
			t("COMMON.VALIDATION.FIELD_REQUIRED", {
				field: t("SETTINGS.GENERAL.PERSONAL.PASSWORD"),
			}).toString(),
		);
	});

	it("should confirm optional password", () => {
		const { result } = renderHook(() => useTranslation());
		const { t } = result.current;

		const passwordValidation = password(t);
		const confirmPassword = passwordValidation.confirmOptionalPassword();
		expect(confirmPassword.validate()).toEqual(true);
		expect(confirmPassword.validate("test")).toEqual(true);
	});

	it("should fail validation if optional password is set", () => {
		const { result } = renderHook(() => useTranslation());
		const { t } = result.current;

		const passwordValidation = password(t);
		const confirmPassword = passwordValidation.confirmOptionalPassword("test");
		expect(confirmPassword.validate()).toEqual(t("COMMON.VALIDATION.PASSWORD_MISMATCH"));
		expect(confirmPassword.validate("test2")).toEqual(t("COMMON.VALIDATION.PASSWORD_MISMATCH"));
	});
});
