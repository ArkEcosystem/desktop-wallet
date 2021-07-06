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
	const { errors, setValue, getValues, register } = useFormContext();
	const { participants, fee, minParticipants } = getValues();

	const inputFeeSettings = getValues("inputFeeSettings") ?? {};

	const { common, multiSignatureRegistration } = useValidation();

	useEffect(() => {
		register("fee", common.fee(wallet.balance(), wallet.network()));
		register("participants", multiSignatureRegistration.participants());
		register("minParticipants", multiSignatureRegistration.minParticipants(participants));
	}, [register, participants, common, fees, multiSignatureRegistration, wallet]);

	useEffect(() => {
		if (minParticipants === undefined) {
			setValue("minParticipants", 2, { shouldDirty: true, shouldValidate: true });
		}
	}, [setValue, minParticipants]);

	const handleParticipants = useCallback(
		(values: Participant[]) => {
			setValue("participants", values, { shouldDirty: true, shouldValidate: true });
		},
		[setValue],
	);

	const handleInput = (event_: ChangeEvent<HTMLInputElement>) => {
		setValue(event_.target.name, event_.target.value, { shouldDirty: true, shouldValidate: true });
	};

	const minParticipantsLimit = Math.max(2, participants?.length || 0);

	return (
		<section data-testid="MultiSignatureRegistrationForm--form-step">
			<Header
				title={t("TRANSACTION.PAGE_MULTISIGNATURE.FORM_STEP.TITLE")}
				subtitle={t("TRANSACTION.PAGE_MULTISIGNATURE.FORM_STEP.DESCRIPTION")}
			/>

			<div className="pt-6 space-y-6">
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
						value={fee}
						step={step}
						disabled={wallet.network().feeType() !== "dynamic"}
						onChange={(value) => setValue("fee", value, { shouldDirty: true, shouldValidate: true })}
						network={wallet.network()}
						profile={profile}
						viewType={inputFeeSettings.viewType}
						onChangeViewType={(viewType) => {
							setValue(
								"inputFeeSettings",
								{ ...inputFeeSettings, viewType },
								{ shouldDirty: true, shouldValidate: true },
							);
						}}
						simpleValue={inputFeeSettings.simpleValue}
						onChangeSimpleValue={(simpleValue) => {
							setValue(
								"inputFeeSettings",
								{ ...inputFeeSettings, simpleValue },
								{ shouldDirty: true, shouldValidate: true },
							);
						}}
					/>
				</FormField>
			</div>
		</section>
	);
};
