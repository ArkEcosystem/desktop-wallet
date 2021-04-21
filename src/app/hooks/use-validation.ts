import { useEnvironmentContext } from "app/contexts";
import { password } from "app/validations/password";
import { createProfile } from "domains/profile/validations";
import { settings } from "domains/setting/validations";
import {
	authentication,
	common,
	delegateRegistration,
	multiSignatureRegistration,
	sendIpfs,
	sendTransfer,
	sendVote,
} from "domains/transaction/validations";
import { receiveFunds, verifyMessage } from "domains/wallet/validations";
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
			sendTransfer: sendTransfer(t, env),
			sendIpfs: sendIpfs(t),
			sendVote: sendVote(t),
			multiSignatureRegistration: multiSignatureRegistration(t),
			receiveFunds: receiveFunds(t),
			verifyMessage: verifyMessage(t),
			createProfile: createProfile(t, env),
			settings: settings(t, env),
			password: password(t),
		}),
		[t, env],
	);
};
