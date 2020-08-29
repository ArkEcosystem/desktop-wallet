import { BigNumber } from "@arkecosystem/platform-sdk-support";
import { Amount } from "app/components/Amount";
import { Circle } from "app/components/Circle";
import { Icon } from "app/components/Icon";
import { TransactionDetail } from "app/components/TransactionDetail";
import { TransactionSuccessful } from "domains/transaction/components/TransactionSuccessful";
import React from "react";
import { useTranslation } from "react-i18next";

import { StepProps } from "./ResignRegistration.models";

export const FourthStep = ({ delegate, fee }: StepProps) => {
	const { t } = useTranslation();

	return (
		<div data-testid="ResignRegistration__fourth-step">
			<TransactionSuccessful>
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
				<TransactionDetail label={t("TRANSACTION.DELEGATE_NAME")}>{delegate.username()}</TransactionDetail>
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
					<Amount ticker="ARK" value={BigNumber.make(fee.static)} />
				</TransactionDetail>
			</TransactionSuccessful>
		</div>
	);
};
