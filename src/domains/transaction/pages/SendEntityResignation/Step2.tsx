import { ReadOnlyWallet } from "@arkecosystem/platform-sdk-profiles";
import { BigNumber } from "@arkecosystem/platform-sdk-support";
import { Address } from "app/components/Address";
import { Avatar } from "app/components/Avatar";
import { Circle } from "app/components/Circle";
import { Icon } from "app/components/Icon";
import { Label } from "app/components/Label";
import { TransactionDetail } from "app/components/TransactionDetail";
import { useEnvironmentContext } from "app/contexts";
import { TotalAmountBox } from "domains/transaction/components/TotalAmountBox";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { StepProps } from "./SendEntityResignation.models";

export const SecondStep = ({ senderWallet, fees }: StepProps) => {
	const { t } = useTranslation();
	const { env } = useEnvironmentContext();

	const coinName = senderWallet.manifest().get<string>("name");
	const network = `${coinName} ${senderWallet.network().name()}`;
	const [delegate, setDelegate] = useState<ReadOnlyWallet>();

	useEffect(() => {
		setDelegate(
			env.delegates().findByAddress(senderWallet.coinId(), senderWallet.networkId(), senderWallet.address()),
		);
	}, [env, senderWallet]);

	return (
		<div data-testid="SendEntityResignation__second-step">
			<div>
				<h1 className="mb-0">{t("TRANSACTION.PAGE_RESIGN_REGISTRATION.SECOND_STEP.TITLE")}</h1>
				<p className="text-theme-neutral-dark">
					{t("TRANSACTION.PAGE_RESIGN_REGISTRATION.SECOND_STEP.DESCRIPTION")}
				</p>
			</div>
			<div className="grid grid-flow-row gap-2 mt-4">
				<TransactionDetail
					border={false}
					label={t("TRANSACTION.NETWORK")}
					extra={
						<div className="ml-1 text-theme-danger">
							<Circle className="bg-theme-background border-theme-danger-light" size="lg">
								{coinName && <Icon name={coinName} width={20} height={20} />}
							</Circle>
						</div>
					}
				>
					<div className="flex-auto font-semibold truncate text-md text-theme-neutral-800 max-w-24">
						{network}
					</div>
				</TransactionDetail>

				<TransactionDetail extra={<Avatar size="lg" address={senderWallet.address()} />}>
					<div className="mb-2 text-sm font-semibold text-theme-neutral">
						<span className="mr-1">{t("TRANSACTION.SENDER")}</span>
						<Label color="warning">
							<span className="text-sm">{t("TRANSACTION.YOUR_ADDRESS")}</span>
						</Label>
					</div>
					<Address address={senderWallet.address()} walletName={senderWallet.alias()} />
				</TransactionDetail>

				<TransactionDetail label={t("TRANSACTION.DELEGATE_NAME")}>{delegate?.username()}</TransactionDetail>

				<div className="my-4">
					<TotalAmountBox fee={BigNumber.make(fees.static)} ticker={senderWallet.currency()} />
				</div>
			</div>
		</div>
	);
};
