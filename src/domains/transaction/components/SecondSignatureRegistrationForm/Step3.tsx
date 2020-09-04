import { Divider } from "app/components/Divider";
import { Header } from "app/components/Header";
import { MnemonicVerification } from "domains/wallet/components/MnemonicVerification";
import React, { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

export const VerificationStep = () => {
	const { getValues, register, setValue } = useFormContext();
	const mnemonic = getValues("secondMnemonic");
	const isVerified: boolean = getValues("verification");

	const { t } = useTranslation();

	const handleComplete = () => {
		setValue("verification", true, true);
	};

	useEffect(() => {
		register("verification", { required: true });
	}, [register]);

	return (
		<section data-testid="SecondSignature__confirmation-step">
			<div className="my-8">
				<Header
					title={t("TRANSACTION.PAGE_SECOND_SIGNATURE.PASSPHRASE_CONFIRMATION_STEP.TITLE")}
					subtitle={t("TRANSACTION.PAGE_SECOND_SIGNATURE.PASSPHRASE_CONFIRMATION_STEP.SUBTITLE")}
				/>
			</div>

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
