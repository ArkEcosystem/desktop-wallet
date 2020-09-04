import { FormField, FormHelperText, FormLabel } from "app/components/Form";
import { InputPassword } from "app/components/Input";
import React from "react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

export const SecondStep = () => {
	const { t } = useTranslation();
	const { register } = useFormContext();

	return (
		<section data-testid="MultiSignatureDetail__second-step">
			<FormField name="passphrase">
				<FormLabel label={t("COMMON.YOUR_PASSPHRASE")} />
				<InputPassword data-testid="import-wallet__passphrase-input" ref={register({ required: true })} />
				<FormHelperText />
			</FormField>
		</section>
	);
};
