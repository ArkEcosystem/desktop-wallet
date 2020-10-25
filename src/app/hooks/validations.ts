import { useEnvironmentContext } from "app/contexts";
import {
	authentication,
	common,
	delegateRegistration,
	entityRegistration,
	multiSignatureRegistration,
	sendIpfs,
	sendTransfer,
	sendVote,
} from "domains/transaction/validations";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

export const useValidation = () => {
	const { t } = useTranslation();
	const { env } = useEnvironmentContext();

	return useMemo(
		() => ({
			common: common(t),
			authentication: authentication(t),
			delegateRegistration: delegateRegistration(t),
			entityRegistration: entityRegistration(t),
			sendTransfer: sendTransfer(t, env),
			sendIpfs: sendIpfs(t),
			sendVote: sendVote(t),
			multiSignatureRegistration: multiSignatureRegistration(t),
		}),
		[t, env],
	);
};
