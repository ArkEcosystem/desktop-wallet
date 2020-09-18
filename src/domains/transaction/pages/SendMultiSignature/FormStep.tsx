import { Profile, ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";
import { FormField, FormLabel } from "app/components/Form";
import { Input, InputAddonEnd, InputGroup } from "app/components/Input";
import { TransactionDetail } from "app/components/TransactionDetail";
import { useEnvironmentContext } from "app/contexts";
import { InputFee } from "domains/transaction/components/InputFee";
import React, { useEffect, useMemo, useState } from "react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

export const FormStep = ({ profile, activeWallet }: { profile: Profile; activeWallet: ReadWriteWallet }) => {
	const { t } = useTranslation();
	const { env } = useEnvironmentContext();
	const { setValue, getValues, register, watch } = useFormContext();
	const { fee } = getValues();
	const participants = watch("participants");

	const [fees, setFees] = useState({
		static: "5",
		min: "0",
		avg: "1",
		max: "2",
	});
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

	return (
		<div data-testid="SendMultiSignature--form-step">
			<TransactionDetail className="pt-6 pb-0">
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

				<FormField name="fee">
					<FormLabel>{t("TRANSACTION.TRANSACTION_FEE")}</FormLabel>
					<InputFee
						min={fees.min}
						avg={fees.avg}
						max={fees.max}
						defaultValue={fee || 0}
						value={fee || 0}
						step={0.01}
						onChange={(value: any) => setValue("fee", value, { shouldValidate: true, shouldDirty: true })}
					/>
				</FormField>
			</TransactionDetail>
		</div>
	);
};
