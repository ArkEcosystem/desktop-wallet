import { useEnvironmentContext } from "app/contexts";
import {
	authentication,
	delegateRegistration,
	entityRegistration,
	sendTransfer,
} from "domains/transaction/validations";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

export const useValidation = () => {
	const { t } = useTranslation();
	const { env } = useEnvironmentContext();

	return useMemo(
		() => ({
			authentication: authentication(t),
			delegateRegistration: delegateRegistration(t),
			entityRegistration: entityRegistration(t),
			sendTransfer: sendTransfer(t, env),
		}),
		[t, env],
	);
};
