import { FormField, FormHelperText, FormLabel } from "app/components/Form";
import { InputPassword } from "app/components/Input";
import React from "react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

export const ThirdStep = () => {
	const { register } = useFormContext();
	const { t } = useTranslation();

	return (
		<section data-testid="SendTransfer__step--third">
			<div>
				<h1 className="mb-0">{t("TRANSACTION.AUTHENTICATION_STEP.TITLE")}</h1>
				<div className="text-theme-neutral-dark">{t("TRANSACTION.AUTHENTICATION_STEP.DESCRIPTION")}</div>

				<div className="grid grid-flow-row">
					<FormField name="mnemonic" className="pt-8 pb-0">
						<FormLabel>{t("TRANSACTION.MNEMONIC")}</FormLabel>
						<InputPassword ref={register({ required: true })} />
						<FormHelperText />
					</FormField>
				</div>
			</div>
		</section>
	);
};
