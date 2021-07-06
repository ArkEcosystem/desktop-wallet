import { Header } from "app/components/Header";
import React, { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { MnemonicVerification } from "../../components/MnemonicVerification";

export const ConfirmPassphraseStep = () => {
	const { getValues, register, setValue, watch } = useFormContext();
	const isVerified: boolean = getValues("verification");
	const mnemonic = watch("mnemonic");

	const { t } = useTranslation();

	const handleComplete = () => {
		setValue("verification", true, { shouldDirty: true, shouldValidate: true });
	};

	useEffect(() => {
		if (!isVerified) {
			register("verification", { required: true });
		}
	}, [isVerified, register]);

	return (
		<section data-testid="CreateWallet__ConfirmPassphraseStep" className="space-y-6">
			<Header
				title={t("WALLETS.PAGE_CREATE_WALLET.PASSPHRASE_CONFIRMATION_STEP.TITLE")}
				subtitle={t("WALLETS.PAGE_CREATE_WALLET.PASSPHRASE_CONFIRMATION_STEP.SUBTITLE")}
			/>

			<MnemonicVerification
				mnemonic={mnemonic}
				optionsLimit={6}
				handleComplete={handleComplete}
				isCompleted={isVerified}
			/>
		</section>
	);
};
