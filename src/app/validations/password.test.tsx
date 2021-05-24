/* eslint-disable @typescript-eslint/require-await */
import { renderHook } from "@testing-library/react-hooks";
import passwordPwnd from "password-pwnd";
import { useTranslation } from "react-i18next";

import { password } from "./password";

describe("Password Validation", () => {
	let pwnd: jest.SpyInstance;

	beforeEach(() => {
		pwnd = jest.spyOn(passwordPwnd, "pwnd").mockImplementation(() => Promise.resolve(0));
	});

	it("should require at least 1 lowercase character", async () => {
		const { result } = renderHook(() => useTranslation());
		const { t } = result.current;
		const passwordValidation = password(t);

		expect(await passwordValidation.password().validate("NO_LOWER")).toEqual(t("COMMON.VALIDATION.PASSWORD_WEAK"));
		expect(pwnd).not.toHaveBeenCalled();
	});

	it("should require at least 1 uppercase character", async () => {
		const { result } = renderHook(() => useTranslation());
		const { t } = result.current;
		const passwordValidation = password(t);

		expect(await passwordValidation.password().validate("no_upper")).toEqual(t("COMMON.VALIDATION.PASSWORD_WEAK"));
		expect(pwnd).not.toHaveBeenCalled();
	});

	it("should require at least 1 numeric character", async () => {
		const { result } = renderHook(() => useTranslation());
		const { t } = result.current;
		const passwordValidation = password(t);

		expect(await passwordValidation.password().validate("NoNumeric")).toEqual(t("COMMON.VALIDATION.PASSWORD_WEAK"));
		expect(pwnd).not.toHaveBeenCalled();
	});

	it("should require at least 1 special character", async () => {
		const { result } = renderHook(() => useTranslation());
		const { t } = result.current;
		const passwordValidation = password(t);

		expect(await passwordValidation.password().validate("N0SpecialChar5")).toEqual(
			t("COMMON.VALIDATION.PASSWORD_WEAK"),
		);
		expect(pwnd).not.toHaveBeenCalled();
	});

	it("should be at least 8 characters long", async () => {
		const { result } = renderHook(() => useTranslation());
		const { t } = result.current;
		const passwordValidation = password(t);

		expect(await passwordValidation.password().validate("shortpw")).toEqual(t("COMMON.VALIDATION.PASSWORD_WEAK"));
		expect(pwnd).not.toHaveBeenCalled();
	});

	it("should require the password not to have been pwned", async () => {
		const { result } = renderHook(() => useTranslation());
		const { t } = result.current;
		const passwordValidation = password(t);

		pwnd.mockImplementation(() => Promise.resolve(1));
		expect(await passwordValidation.password().validate("S3cUr3!Pas#w0rd")).toEqual(
			t("COMMON.VALIDATION.PASSWORD_PWNED"),
		);
		expect(pwnd).toHaveBeenCalledWith("S3cUr3!Pas#w0rd");

		pwnd.mockImplementation(() => Promise.resolve(0));
		expect(await passwordValidation.password().validate("S3cUr3!Pas#w0rd")).toEqual(true);
		expect(pwnd).toHaveBeenCalledWith("S3cUr3!Pas#w0rd");
	});

	it("should ignore pwned validation if haveibeenpwned API is unreachable", async () => {
		const { result } = renderHook(() => useTranslation());
		const { t } = result.current;
		const passwordValidation = password(t);

		pwnd.mockImplementation(() => Promise.reject());
		expect(await passwordValidation.password().validate("S3cUr3!Pas#w0rd")).toEqual(true);
	});

	it("should require different password than the old password", async () => {
		const { result } = renderHook(() => useTranslation());
		const { t } = result.current;

		const passwordRule = password(t).password("S3cUr3!Pas#w0rd");

		expect(await passwordRule.validate("S3cUr3!Pas#w0rd")).toEqual(t("COMMON.VALIDATION.PASSWORD_SAME_AS_OLD"));
		expect(await passwordRule.validate("S3cUr3!Pas#w0rd2different")).toEqual(true);
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
