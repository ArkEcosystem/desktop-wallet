import { Address } from "app/components/Address";
import { Alert } from "app/components/Alert";
import { Avatar } from "app/components/Avatar";
import { FormField, FormLabel } from "app/components/Form";
import { Label } from "app/components/Label";
import { InputFee } from "domains/transaction/components/InputFee";
import { TransactionDetail } from "domains/transaction/components/TransactionDetail";
import React from "react";
import { useTranslation } from "react-i18next";

import { EntityResignationStepProps } from "../EntityResignationSteps.models";

export const EntityFirstStep = ({ entity, fees }: EntityResignationStepProps) => {
	const { t } = useTranslation();
	const { data }: any = entity.data().asset();

	return (
		<div data-testid="SendEntityResignation__first-step">
			<h1 className="mb-0">{t(`TRANSACTION.PAGE_RESIGN_REGISTRATION.FIRST_STEP.ENTITY.TITLE`)}</h1>
			<div className="text-theme-neutral-dark">
				{t(`TRANSACTION.PAGE_RESIGN_REGISTRATION.FIRST_STEP.ENTITY.DESCRIPTION`)}
			</div>

			<div className="mt-6">
				<Alert size="lg">{t(`TRANSACTION.PAGE_RESIGN_REGISTRATION.FIRST_STEP.ENTITY.WARNING`)}</Alert>
			</div>

			<div>
				<TransactionDetail extra={<Avatar size="lg" address={entity.sender()} />} border={false}>
					<div className="mb-2 text-sm font-semibold text-theme-neutral">
						<span className="mr-1">{t("TRANSACTION.SENDER")}</span>
						<Label color="warning">
							<span className="text-sm">{t("TRANSACTION.YOUR_ADDRESS")}</span>
						</Label>
					</div>
					<Address address={entity.sender()} walletName={entity.wallet().alias()} />
				</TransactionDetail>

				<TransactionDetail label={t("TRANSACTION.PAGE_RESIGN_REGISTRATION.ENTITY_NAME")}>
					{data.name}
				</TransactionDetail>

				<TransactionDetail className="pt-6 pb-0">
					<FormField name="name" className="font-normal">
						<FormLabel>{t("TRANSACTION.TRANSACTION_FEE")}</FormLabel>
						<InputFee
							value={fees.static}
							defaultValue={fees.static}
							min={fees.min}
							avg={fees.avg}
							max={fees.max}
							step={0.01}
						/>
					</FormField>
				</TransactionDetail>
			</div>
		</div>
	);
};
