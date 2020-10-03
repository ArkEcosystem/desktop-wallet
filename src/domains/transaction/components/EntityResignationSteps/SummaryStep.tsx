
import { Circle } from "app/components/Circle";
import { Icon } from "app/components/Icon";
import { TransactionDetail, TransactionFee } from "domains/transaction/components/TransactionDetail";
import { TransactionSuccessful } from "domains/transaction/components/TransactionSuccessful";
import React from "react";
import { useTranslation } from "react-i18next";

import { EntityResignationStepProps } from "./EntityResignationSteps.models";

export const SummaryStep = ({ entity, transaction, fees }: EntityResignationStepProps) => {
	const { t } = useTranslation();

	const { data }: any = entity.data().asset();

	return (
		<div data-testid="SendEntityResignation__summary-step">
			<TransactionSuccessful transaction={transaction} senderWallet={entity.wallet()}>
				<TransactionDetail
					label={t("TRANSACTION.TRANSACTION_TYPE")}
					extra={
						<Circle className="border-theme-text" size="lg">
							<Icon name="Entity" width={19} height={20} />
						</Circle>
					}
				>
					{t("TRANSACTION.TRANSACTION_TYPES.ENTITY_RESIGNATION")}
				</TransactionDetail>

				<TransactionDetail label={t("TRANSACTION.PAGE_RESIGN_REGISTRATION.ENTITY_NAME")}>
					{data.name}
				</TransactionDetail>

				<TransactionFee
					currency={entity.wallet().currency()}
					value={transaction!.fee()}
					paddingPosition="top"
				/>
			</TransactionSuccessful>
		</div>
	);
};
