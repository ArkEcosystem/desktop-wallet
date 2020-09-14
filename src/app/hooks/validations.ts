import { authentication,sendEntityUpdate } from "domains/transaction/validations";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

export const useValidation = () => {
	const { t } = useTranslation();

	return useMemo(
		() => ({
			sendEntityUpdate: sendEntityUpdate(t),
			authentication: authentication(t),
		}),
		[t],
	);
};
