import Tippy from "@tippyjs/react";
import { Icon } from "app/components/Icon";
import React from "react";
import { useTranslation } from "react-i18next";

import { TransactionDetail } from "../TransactionDetail";

type TransactionConfirmationsProps = {
	isConfirmed: boolean;
	confirmations: number;
};

export const TransactionConfirmations = ({ isConfirmed, confirmations }: TransactionConfirmationsProps) => {
	const { t } = useTranslation();

	const renderConfirmationStatus = (isConfirmed: boolean, confirmations: number) => {
		const confirmationStatusStyle = isConfirmed
			? "bg-theme-success-200 text-theme-success-500"
			: "bg-theme-danger-200 text-theme-danger-500";

		if (isConfirmed) {
			return (
				<div className="flex">
					<span>{t("TRANSACTION.WELL_CONFIRMED")}</span>
					<Tippy content={t("TRANSACTION.CONFIRMATIONS_COUNT", { count: confirmations })}>
						<div className={`flex w-6 h-6 ml-2 rounded-full ${confirmationStatusStyle}`}>
							<div className="m-auto">
								<Icon name="Checkmark" width={15} height={15} />
							</div>
						</div>
					</Tippy>
				</div>
			);
		}

		return (
			<div className="flex">
				<span>{t("TRANSACTION.NOT_CONFIRMED")}</span>
				<div className={`flex w-6 h-6 ml-2 rounded-full ${confirmationStatusStyle}`}>
					<div className="m-auto">
						<Icon name="CrossSlim" width={12} height={12} />
					</div>
				</div>
			</div>
		);
	};

	return (
		<TransactionDetail label={t("TRANSACTION.CONFIRMATIONS")}>
			{renderConfirmationStatus(isConfirmed, confirmations)}
		</TransactionDetail>
	);
};
