import { authentication, delegateRegistration, entityRegistration } from "domains/transaction/validations";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

export const useValidation = () => {
	const { t } = useTranslation();

	return useMemo(
		() => ({
			authentication: authentication(t),
			delegateRegistration: delegateRegistration(t),
			entityRegistration: entityRegistration(t),
		}),
		[t],
	);
};
