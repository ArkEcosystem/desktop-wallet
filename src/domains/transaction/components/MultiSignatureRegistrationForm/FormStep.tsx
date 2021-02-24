import { Coins, Contracts } from "@arkecosystem/platform-sdk";
import { Profile, ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";
import { FormField, FormLabel } from "app/components/Form";
import { Header } from "app/components/Header";
import { Input, InputAddonEnd, InputGroup } from "app/components/Input";
import { useValidation } from "app/hooks";
import React, { ChangeEvent, useCallback, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { InputFee } from "../InputFee";
import { AddParticipant, Participant } from "./components/AddParticipant/AddParticipant";

export const FormStep = ({
	profile,
	fees,
	wallet,
	step = 0.001,
}: {
	profile: Profile;
	fees: Contracts.TransactionFee;
	wallet: ReadWriteWallet;
	step?: number;
}) => {
	const { t } = useTranslation();
	const { setValue, getValues, register } = useFormContext();
	const { participants, fee, minParticipants } = getValues();

	const { common, multiSignatureRegistration } = useValidation();

	useEffect(() => {
		register("fee", common.fee(wallet.balance(), wallet.network()));
		register("participants", multiSignatureRegistration.participants());
		register("minParticipants", multiSignatureRegistration.minParticipants(participants));
	}, [register, participants, common, fees, multiSignatureRegistration, wallet]);

	useEffect(() => {
		if (minParticipants === undefined) {
			setValue("minParticipants", 2, { shouldValidate: true, shouldDirty: true });
		}
	}, [setValue, minParticipants]);

	const handleParticipants = useCallback(
		(values: Participant[]) => {
			setValue("participants", values, { shouldValidate: true, shouldDirty: true });
		},
		[setValue],
	);

	const handleInput = (evt: ChangeEvent<HTMLInputElement>) => {
		setValue(evt.target.name, evt.target.value, { shouldValidate: true, shouldDirty: true });
	};

	return (
		<section data-testid="MultiSignatureRegistrationForm--form-step" className="space-y-8">
			<Header
				title={t("TRANSACTION.PAGE_MULTISIGNATURE.FORM_STEP.TITLE")}
				subtitle={t("TRANSACTION.PAGE_MULTISIGNATURE.FORM_STEP.DESCRIPTION")}
			/>

			<AddParticipant
				profile={profile}
				wallet={wallet}
				onChange={handleParticipants}
				defaultParticipants={participants}
			/>

			<FormField name="minParticipants">
				<FormLabel>{t("TRANSACTION.MULTISIGNATURE.MIN_SIGNATURES")}</FormLabel>
				<InputGroup>
					<Input
						data-testid="MultiSignatureRegistrationForm__min-participants"
						type="number"
						value={minParticipants ?? 0}
						onChange={handleInput}
						errorClassName="mr-20"
					/>
					<InputAddonEnd className="pr-4 pointer-events-none text-theme-secondary-400">
						{t("TRANSACTION.MULTISIGNATURE.OUT_OF_LENGTH", {
							length: Math.max(2, participants?.length || 0),
						})}
					</InputAddonEnd>
				</InputGroup>
			</FormField>

			<FormField name="fee">
				<FormLabel label={t("TRANSACTION.TRANSACTION_FEE")} />
				<InputFee
					min={fees.min}
					avg={fees.avg}
					max={fees.max}
					defaultValue={fee || 0}
					value={fee || 0}
					step={step}
					showFeeOptions={wallet.network().can(Coins.FeatureFlag.MiscellaneousDynamicFees)}
					onChange={(currency) =>
						setValue("fee", currency.value, { shouldValidate: true, shouldDirty: true })
					}
				/>
			</FormField>
		</section>
	);
};
