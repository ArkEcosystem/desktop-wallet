import { Contracts as ProfilesContracts } from "@arkecosystem/platform-sdk-profiles";
import { FormField, FormLabel } from "app/components/Form";
import { Header } from "app/components/Header";
import { Input } from "app/components/Input";
import { useValidation } from "app/hooks";
import cn from "classnames";
import React, { ChangeEvent, useCallback, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { TransactionFees } from "types";

import { InputFee } from "../InputFee";
import { AddParticipant, Participant } from "./components/AddParticipant/AddParticipant";

export const FormStep = ({
	profile,
	fees,
	wallet,
	step = 0.001,
}: {
	profile: ProfilesContracts.IProfile;
	fees: TransactionFees;
	wallet: ProfilesContracts.IReadWriteWallet;
	step?: number;
}) => {
	const { t } = useTranslation();
	const { errors, setValue, getValues, register, watch } = useFormContext();
	const { participants, fee, minParticipants } = getValues();

	const { common, multiSignatureRegistration } = useValidation();
	const { inputFeeViewType } = watch();

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

	const minParticipantsLimit = Math.max(2, participants?.length || 0);

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
				<Input
					data-testid="MultiSignatureRegistrationForm__min-participants"
					type="number"
					min={2}
					max={minParticipantsLimit}
					value={minParticipants ?? 0}
					onChange={handleInput}
					addons={{
						end: (
							<span
								className={cn("pointer-events-none font-semibold text-sm", {
									"text-theme-secondary-500 dark:text-theme-secondary-700": !errors?.minParticipants,
								})}
							>
								{t("TRANSACTION.MULTISIGNATURE.OUT_OF_LENGTH", {
									length: minParticipantsLimit,
								})}
							</span>
						),
					}}
				/>
			</FormField>

			<FormField name="fee">
				<FormLabel label={t("TRANSACTION.TRANSACTION_FEE")} />
				<InputFee
					min={fees?.min}
					avg={fees?.avg}
					max={fees?.max}
					loading={!fees}
					value={fee || 0}
					step={step}
					disabled={wallet.network().feeType() !== "dynamic"}
					onChange={(value) => setValue("fee", value, { shouldValidate: true, shouldDirty: true })}
					network={wallet.network()}
					profile={profile}
					viewType={inputFeeViewType}
					onChangeViewType={(value) => setValue("inputFeeViewType", value, { shouldDirty: true })}
				/>
			</FormField>
		</section>
	);
};
