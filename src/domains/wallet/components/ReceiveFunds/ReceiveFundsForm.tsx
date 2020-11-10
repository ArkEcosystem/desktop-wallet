import { FormField, FormLabel } from "app/components/Form";
import { InputCounter, InputCurrency } from "app/components/Input";
import React, { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

export const ReceiveFundsForm = () => {
	const { t } = useTranslation();

	const form = useFormContext();
	const { getValues, setValue, register } = form;

	useEffect(() => {
		register("displayAmount");
	}, [register]);

	return (
		<div data-testid="ReceiveFundsForm">
			<div className="space-y-8 mt-8">
				<FormField name="amount">
					<FormLabel label={t("COMMON.AMOUNT")} required={false} />
					<InputCurrency
						data-testid="ReceiveFunds__amount"
						placeholder={t("COMMON.AMOUNT")}
						className="pr-20"
						value={getValues("displayAmount")}
						onChange={(currency) => setValue("displayAmount", currency.display)}
					/>
				</FormField>
				<FormField name="smartbridge" className="relative">
					<FormLabel label={t("COMMON.SMARTBRIDGE")} required={false} optional={true} />
					<InputCounter
						ref={register}
						data-testid="ReceiveFunds__smartbridge"
						type="text"
						placeholder=" "
						className="pr-24"
						maxLengthLabel="255 Max"
					/>
				</FormField>
			</div>
		</div>
	);
};
