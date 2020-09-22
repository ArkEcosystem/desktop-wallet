import { Contracts } from "@arkecosystem/platform-sdk";
import { Profile, ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";
import { FormField, FormLabel } from "app/components/Form";
import { Input, InputAddonEnd, InputGroup } from "app/components/Input";
import React, { ChangeEvent, useCallback, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { InputFee } from "../InputFee";
import { AddParticipant, Participant } from "./components/AddParticipant/AddParticipant";

export const FormStep = ({
	profile,
	fees,
	wallet,
}: {
	profile: Profile;
	fees: Contracts.TransactionFee;
	wallet: ReadWriteWallet;
}) => {
	const { t } = useTranslation();
	const { setValue, getValues, register } = useFormContext();
	const { participants, fee, minParticipants } = getValues();

	useEffect(() => {
		register("participants", { required: true, minLength: 2 });
		register("minParticipants", { required: true, min: 2, max: Math.max(2, participants?.length) });
	}, [register, participants]);

	const handleParticipant = useCallback(
		(values: Participant[]) => {
			setValue("participants", values, { shouldValidate: true });
		},
		[setValue],
	);

	const handleInput = (evt: ChangeEvent<HTMLInputElement>) => {
		setValue(evt.target.name, evt.target.value, { shouldValidate: true, shouldDirty: true });
	};

	return (
		<section data-testid="MultiSignatureRegistrationForm--form-step">
			<AddParticipant
				profile={profile}
				wallet={wallet}
				onChange={handleParticipant}
				defaultParticipants={participants}
			/>

			<FormField name="minParticipants" className="mt-8">
				<FormLabel>{t("TRANSACTION.MULTISIGNATURE.MIN_SIGNATURES")}</FormLabel>
				<InputGroup>
					<Input type="number" min={2} value={minParticipants} onChange={handleInput} />
					<InputAddonEnd className="pointer-events-none text-theme-neutral-light pr-4">
						{t("TRANSACTION.MULTISIGNATURE.OUT_OF_LENGTH", {
							length: Math.max(2, participants?.length || 0),
						})}
					</InputAddonEnd>
				</InputGroup>
			</FormField>

			<FormField name="fee" className="mt-8">
				<FormLabel label={t("TRANSACTION.TRANSACTION_FEE")} />
				<InputFee
					min={fees.min}
					avg={fees.avg}
					max={fees.max}
					defaultValue={fee || 0}
					step={0.01}
					onChange={(value) => setValue("fee", value, { shouldValidate: true, shouldDirty: true })}
				/>
			</FormField>
		</section>
	);
};
