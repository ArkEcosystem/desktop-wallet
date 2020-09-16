import { ReadOnlyWallet } from "@arkecosystem/platform-sdk-profiles";
import { BigNumber } from "@arkecosystem/platform-sdk-support";
import { Amount } from "app/components/Amount";
import { Circle } from "app/components/Circle";
import { Icon } from "app/components/Icon";
import { TransactionDetail } from "app/components/TransactionDetail";
import { useEnvironmentContext } from "app/contexts";
import { TransactionSuccessful } from "domains/transaction/components/TransactionSuccessful";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { StepProps } from "./SendEntityResignation.models";

export const FourthStep = ({ fees, transaction, senderWallet }: StepProps) => {
	const { t } = useTranslation();
	const { env } = useEnvironmentContext();
	const [delegate, setDelegate] = useState<ReadOnlyWallet>();

	useEffect(() => {
		setDelegate(
			env.delegates().findByAddress(senderWallet.coinId(), senderWallet.networkId(), senderWallet.address()),
		);
	}, [env, senderWallet]);

	return (
		<div data-testid="SendEntityResignation__fourth-step">
			<TransactionSuccessful transaction={transaction} senderWallet={senderWallet}>
				<TransactionDetail
					label={t("TRANSACTION.TRANSACTION_TYPE")}
					extra={
						<Circle className="border-black" size="lg">
							<Icon name="Delegate" width={20} height={20} />
						</Circle>
					}
				>
					{t("TRANSACTION.PAGE_RESIGN_REGISTRATION.FOURTH_STEP.TITLE")}
				</TransactionDetail>
				<TransactionDetail label={t("TRANSACTION.DELEGATE_NAME")}>{delegate?.username()}</TransactionDetail>
				<TransactionDetail
					label={t("TRANSACTION.AMOUNT")}
					extra={
						<div className="ml-1 text-theme-danger">
							<Circle className="bg-theme-background border-theme-danger-light" size="lg">
								<Icon name="Sent" width={22} height={22} />
							</Circle>
						</div>
					}
				>
					<Amount ticker="ARK" value={BigNumber.make(fees.static)} />
				</TransactionDetail>
			</TransactionSuccessful>
		</div>
	);
};
