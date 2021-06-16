import { Networks } from "@arkecosystem/platform-sdk";
import { FormField, FormHelperText, FormLabel } from "app/components/Form";
import { InputCounter, InputCurrency } from "app/components/Input";
import { useValidation } from "app/hooks";
import React, { useEffect, useMemo } from "react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

export const ReceiveFundsForm = ({ network }: { network?: Networks.Network }) => {
	const { t } = useTranslation();

	const form = useFormContext();
	const { getValues, setValue, register } = form;
	const { receiveFunds } = useValidation();
	const { memo } = form.watch();
	const maxLength = receiveFunds.memo().maxLength?.value;

	useEffect(() => {
		register("amount");
	}, [register]);

	const isMemoUsedInNetwork = useMemo(() => network?.usesMemo(), [network]);

	return (
		<div data-testid="ReceiveFundsForm">
			<div className="mt-8 space-y-5">
				<FormField name="amount">
					<FormLabel label={t("COMMON.AMOUNT")} optional />
					<InputCurrency
						data-testid="ReceiveFundsForm__amount"
						placeholder={t("COMMON.AMOUNT")}
						className="pr-20"
						value={getValues("amount")}
						onChange={(amount) => setValue("amount", amount)}
					/>
					<FormHelperText />
				</FormField>

				{isMemoUsedInNetwork && (
					<FormField name="memo">
						<FormLabel label={t("COMMON.MEMO")} optional />
						<InputCounter
							ref={register(receiveFunds.memo())}
							data-testid="ReceiveFundsForm__memo"
							defaultValue={memo}
							maxLengthLabel={maxLength.toString()}
						/>
					</FormField>
				)}
			</div>
		</div>
	);
};
