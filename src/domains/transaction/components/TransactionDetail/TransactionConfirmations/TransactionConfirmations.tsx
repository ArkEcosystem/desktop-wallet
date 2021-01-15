import { BigNumber } from "@arkecosystem/platform-sdk-support";
import { Icon } from "app/components/Icon";
import { Tooltip } from "app/components/Tooltip";
import React from "react";
import { useTranslation } from "react-i18next";

import { TransactionDetail } from "../TransactionDetail";

type TransactionConfirmationsProps = {
	isConfirmed: boolean;
	confirmations: BigNumber;
};

export const TransactionConfirmations = ({ isConfirmed, confirmations }: TransactionConfirmationsProps) => {
	const { t } = useTranslation();

	const renderConfirmationStatus = (isConfirmed: boolean, confirmations: BigNumber) => {
		const confirmationStatusStyle = isConfirmed ? "text-theme-success-600" : "text-theme-warning-600";

		if (isConfirmed) {
			return (
				<div className="flex space-x-3">
					<span>{t("TRANSACTION.WELL_CONFIRMED")}</span>
					<Tooltip content={t("TRANSACTION.CONFIRMATIONS_COUNT", { count: confirmations.toNumber() })}>
						<span>
							<Icon name="StatusOk" className={confirmationStatusStyle} width={22} height={22} />
						</span>
					</Tooltip>
				</div>
			);
		}

		return (
			<div className="flex space-x-3">
				<span>{t("TRANSACTION.NOT_CONFIRMED")}</span>
				<Icon name="StatusPending" className={confirmationStatusStyle} width={22} height={22} />
			</div>
		);
	};

	return (
		<TransactionDetail label={t("TRANSACTION.CONFIRMATIONS")}>
			{renderConfirmationStatus(isConfirmed, confirmations)}
		</TransactionDetail>
	);
};
