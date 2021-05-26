import { Coins } from "@arkecosystem/platform-sdk";
import { FormField, FormHelperText, FormLabel } from "app/components/Form";
import { InputCounter, InputCurrency } from "app/components/Input";
import { useValidation } from "app/hooks";
import React, { useEffect, useMemo } from "react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

export const ReceiveFundsForm = ({ network }: { network?: Coins.Network }) => {
	const { t } = useTranslation();

	const form = useFormContext();
	const { getValues, setValue, register } = form;
	const { receiveFunds } = useValidation();
	const { smartbridge } = form.watch();
	const maxLength = receiveFunds.smartbridge().maxLength?.value;

	useEffect(() => {
		register("amount");
	}, [register]);

	const isSmartbridgeUsedInNetwork = useMemo(() => network?.allows(Coins.FeatureFlag.MiscellaneousMemo), [network]);

	return (
		<div data-testid="ReceiveFundsForm">
			<div className="mt-8 space-y-8">
				<FormField name="amount">
					<FormLabel label={t("COMMON.AMOUNT")} required={false} />
					<InputCurrency
						data-testid="ReceiveFundsForm__amount"
						placeholder={t("COMMON.AMOUNT")}
						className="pr-20"
						value={getValues("amount")}
						onChange={(amount) => setValue("amount", amount)}
					/>
					<FormHelperText />
				</FormField>

				{isSmartbridgeUsedInNetwork && (
					<FormField name="smartbridge">
						<FormLabel label={t("COMMON.SMARTBRIDGE")} required={false} optional={true} />
						<InputCounter
							ref={register(receiveFunds.smartbridge())}
							data-testid="ReceiveFundsForm__smartbridge"
							defaultValue={smartbridge}
							maxLengthLabel={maxLength.toString()}
						/>
					</FormField>
				)}
			</div>
		</div>
	);
};
