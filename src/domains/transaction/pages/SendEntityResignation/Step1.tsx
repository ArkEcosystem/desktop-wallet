import { ReadOnlyWallet } from "@arkecosystem/platform-sdk-profiles";
import { Address } from "app/components/Address";
import { Alert } from "app/components/Alert";
import { Avatar } from "app/components/Avatar";
import { FormField, FormLabel } from "app/components/Form";
import { Label } from "app/components/Label";
import { Loader } from "app/components/Loader";
import { useEnvironmentContext } from "app/contexts";
import { useActiveWallet } from "app/hooks/env";
import { InputFee } from "domains/transaction/components/InputFee";
import { TransactionDetail } from "domains/transaction/components/TransactionDetail";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { StepProps } from "./SendEntityResignation.models";

export const FirstStep = ({ senderWallet, fees }: StepProps) => {
	const { t } = useTranslation();
	const activeWallet = useActiveWallet();
	const { env } = useEnvironmentContext();
	const [delegate, setDelegate] = useState<ReadOnlyWallet>();

	useEffect(() => {
		setDelegate(
			env.delegates().findByAddress(activeWallet.coinId(), activeWallet.networkId(), activeWallet.address()),
		);
	}, [env, activeWallet]);

	return (
		<div data-testid="SendEntityResignation__first-step">
			{!delegate && <Loader />}
			<h1 className="mb-0">{t("TRANSACTION.PAGE_RESIGN_REGISTRATION.FIRST_STEP.DELEGATE.TITLE")}</h1>
			<div className="text-theme-neutral-dark">
				{t("TRANSACTION.PAGE_RESIGN_REGISTRATION.FIRST_STEP.DELEGATE.DESCRIPTION")}
			</div>

			<div className="mt-6">
				<Alert size="lg">{t("TRANSACTION.PAGE_RESIGN_REGISTRATION.FIRST_STEP.DELEGATE.WARNING")}</Alert>
			</div>

			<div>
				<TransactionDetail extra={<Avatar size="lg" address={activeWallet.address()} />} border={false}>
					<div className="mb-2 text-sm font-semibold text-theme-neutral">
						<span className="mr-1">{t("TRANSACTION.SENDER")}</span>
						<Label color="warning">
							<span className="text-sm">{t("TRANSACTION.YOUR_ADDRESS")}</span>
						</Label>
					</div>
					<Address address={activeWallet.address()} walletName={activeWallet.alias()} />
				</TransactionDetail>

				<TransactionDetail label={t("TRANSACTION.DELEGATE_NAME")}>{delegate?.username()}</TransactionDetail>

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
