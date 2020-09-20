import { Profile, ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";
import { FormField, FormLabel } from "app/components/Form";
import { Input, InputAddonEnd, InputGroup } from "app/components/Input";
import { useEnvironmentContext } from "app/contexts";
import { SendTransactionForm } from "domains/transaction/components/SendTransactionForm";
import React, { useCallback, useEffect, useMemo } from "react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { AddParticipant, Participant } from "./components/AddParticipant/AddParticipant";

export const FormStep = ({ profile, activeWallet }: { profile: Profile; activeWallet: ReadWriteWallet }) => {
	const { t } = useTranslation();
	const { env } = useEnvironmentContext();
	const { setValue, register, watch } = useFormContext();
	const participants = watch("participants");

	const networks = useMemo(() => env.availableNetworks(), [env]);

	useEffect(() => {
		register("network", { required: true });
		register("senderAddress", { required: true });
		register("fee", { required: true });
		register("participants", { required: true });

		setValue("senderAddress", activeWallet.address(), { shouldValidate: true, shouldDirty: true });

		for (const network of networks) {
			if (network.coin() === activeWallet.coinId() && network.id() === activeWallet.networkId()) {
				setValue("network", network, { shouldValidate: true, shouldDirty: true });

				break;
			}
		}
	}, [activeWallet, networks, register, setValue]);

	const handleParticipant = useCallback(
		(participants: Participant[]) => {
			setValue("participants", participants, { shouldValidate: true });
		},
		[setValue],
	);

	return (
		<div data-testid="SendMultiSignature--form-step">
			<SendTransactionForm profile={profile} networks={networks}>
				<AddParticipant profile={profile} wallet={activeWallet} onChange={handleParticipant} />

				<FormField name="minParticipants">
					<FormLabel>{t("TRANSACTION.PAGE_MULTISIGNATURE.MIN_SIGNATURES")}</FormLabel>
					<InputGroup>
						<Input
							type="number"
							defaultValue={2}
							ref={register({
								max: Math.max(2, participants?.length || 0),
								min: 2,
							})}
						/>
						<InputAddonEnd>out of {participants?.length || 2}</InputAddonEnd>
					</InputGroup>
				</FormField>
			</SendTransactionForm>
		</div>
	);
};
