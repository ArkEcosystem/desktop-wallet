import { Divider } from "app/components/Divider";
import { Image } from "app/components/Image";
import { Spinner } from "app/components/Spinner";
import React from "react";
import { useTranslation } from "react-i18next";

type LedgerConfirmationProps = {
	children?: React.ReactNode;
	detailsHeading?: any;
};

export const LedgerConfirmation = ({ children, detailsHeading }: LedgerConfirmationProps) => {
	const { t } = useTranslation();

	return (
		<>
			<Image name="ConfirmTransactionLedgerBanner" domain="transaction" className="my-8" />

			<div className="mt-8 text-theme-secondary-text" data-testid="LedgerConfirmation-description">
				{t("TRANSACTION.LEDGER_CONFIRMATION.DESCRIPTION")}
			</div>

			<div className="inline-flex items-center mt-8 space-x-3 w-full">
				<Spinner />
				<span
					className="font-semibold text-theme-secondary-900 dark:text-theme-secondary-600"
					data-testid="LedgerConfirmation-loading_message"
				>
					{t("TRANSACTION.LEDGER_CONFIRMATION.LOADING_MESSAGE")}
				</span>
			</div>

			{children && (
				<>
					<Divider />

					<section data-testid="LedgerReview__details">
						{detailsHeading !== null && (
							<h2 className="text-2xl font-bold mb-0">
								{detailsHeading || t("TRANSACTION.TRANSACTION_DETAILS")}
							</h2>
						)}
						{children}
					</section>
				</>
			)}
		</>
	);
};
