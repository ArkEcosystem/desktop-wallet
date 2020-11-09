import { Divider } from "app/components/Divider";
import { Header } from "app/components/Header";
import { MnemonicVerification } from "domains/wallet/components/MnemonicVerification";
import React, { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

export const VerificationStep = () => {
	const { getValues, register, setValue, watch } = useFormContext();
	const isVerified: boolean = getValues("verification");

	// getValues does not get the value of `defaultValues` on first render
	const [defaultMnemonic] = useState(() => watch("secondMnemonic"));
	const mnemonic = getValues("secondMnemonic") || defaultMnemonic;

	const { t } = useTranslation();

	const handleComplete = () => {
		setValue("verification", true, { shouldValidate: true, shouldDirty: true });
	};

	useEffect(() => {
		register("verification", { required: true });
	}, [register]);

	return (
		<section data-testid="SecondSignature__confirmation-step" className="space-y-8">
			<Header
				title={t("TRANSACTION.PAGE_SECOND_SIGNATURE.PASSPHRASE_CONFIRMATION_STEP.TITLE")}
				subtitle={t("TRANSACTION.PAGE_SECOND_SIGNATURE.PASSPHRASE_CONFIRMATION_STEP.SUBTITLE")}
			/>

			<MnemonicVerification
				mnemonic={mnemonic}
				optionsLimit={6}
				handleComplete={handleComplete}
				isCompleted={isVerified}
			/>

			<Divider dashed />
		</section>
	);
};
