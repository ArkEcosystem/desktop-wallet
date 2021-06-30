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
			authentication: authentication(t),
			common: common(t),
			createProfile: createProfile(t, env),
			delegateRegistration: delegateRegistration(t),
			multiSignatureRegistration: multiSignatureRegistration(t),
			password: password(t),
			receiveFunds: receiveFunds(t),
			sendIpfs: sendIpfs(t),
			sendTransfer: sendTransfer(t),
			sendVote: sendVote(t),
			settings: settings(t, env),
			verifyMessage: verifyMessage(t),
		}),
		[t, env],
	);
};
