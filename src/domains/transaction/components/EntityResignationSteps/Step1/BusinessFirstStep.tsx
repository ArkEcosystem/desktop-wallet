import { Address } from "app/components/Address";
import { Alert } from "app/components/Alert";
import { Avatar } from "app/components/Avatar";
import { FormField, FormLabel } from "app/components/Form";
import { Label } from "app/components/Label";
import { TransactionDetail } from "app/components/TransactionDetail";
import { InputFee } from "domains/transaction/components/InputFee";
import React from "react";
import { useTranslation } from "react-i18next";

type BusinessFirstStepProps = {
	entity: any;
	fee: any;
};

export const BusinessFirstStep = ({ entity, fee }: BusinessFirstStepProps) => {
	const { t } = useTranslation();
	const { data }: any = entity?.asset();
	console.log({ entity });

	return (
		<div data-testid="SendEntityResignation__first-step">
			<h1 className="mb-0">{t(`TRANSACTION.PAGE_RESIGN_REGISTRATION.FIRST_STEP.BUSINESS.TITLE`)}</h1>
			<div className="text-theme-neutral-dark">
				{t(`TRANSACTION.PAGE_RESIGN_REGISTRATION.FIRST_STEP.BUSINESS.DESCRIPTION`)}
			</div>

			<div className="mt-6">
				<Alert size="lg">{t(`TRANSACTION.PAGE_RESIGN_REGISTRATION.FIRST_STEP.BUSINESS.WARNING`)}</Alert>
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

				<TransactionDetail label={t("TRANSACTION.PAGE_RESIGN_REGISTRATION.BUSINESS_NAME")}>
					{data?.name}
				</TransactionDetail>

				<TransactionDetail className="pt-6 pb-0">
					<FormField name="name" className="font-normal">
						<FormLabel>{t("TRANSACTION.TRANSACTION_FEE")}</FormLabel>
						<InputFee
							value={fee.static}
							defaultValue={fee.static}
							average={fee.avg}
							min={fee.min}
							max={fee.max}
							step={0.01}
						/>
					</FormField>
				</TransactionDetail>
			</div>
		</div>
	);
};
