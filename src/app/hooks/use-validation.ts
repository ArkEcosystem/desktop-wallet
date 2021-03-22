import { useEnvironmentContext } from "app/contexts";
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
import { encryptPassword, receiveFunds, verifyMessage } from "domains/wallet/validations";
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
			encryptPassword: encryptPassword(t),
		}),
		[t, env],
	);
};
