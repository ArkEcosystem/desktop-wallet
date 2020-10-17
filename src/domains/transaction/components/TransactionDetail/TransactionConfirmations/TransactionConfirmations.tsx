import { BigNumber } from "@arkecosystem/platform-sdk-support";
import Tippy from "@tippyjs/react";
import { Icon } from "app/components/Icon";
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
		const confirmationStatusStyle = isConfirmed ? "text-theme-success" : "text-theme-warning";

		if (isConfirmed) {
			return (
				<div className="flex space-x-3">
					<span>{t("TRANSACTION.WELL_CONFIRMED")}</span>
					<Tippy content={t("TRANSACTION.CONFIRMATIONS_COUNT", { count: confirmations.toNumber() })}>
						<span>
							<Icon name="StatusOk" className={confirmationStatusStyle} width={22} height={22} />
						</span>
					</Tippy>
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
