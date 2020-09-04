import { Circle } from "app/components/Circle";
import { Icon } from "app/components/Icon";
import { TransactionDetail } from "app/components/TransactionDetail";
import { TransactionSuccessful } from "domains/transaction/components/TransactionSuccessful";
import React from "react";
import { useTranslation } from "react-i18next";

export const FourthStep = () => {
	const { t } = useTranslation();

	return (
		<TransactionSuccessful>
			<TransactionDetail
				label={t("TRANSACTION.TRANSACTION_TYPE")}
				extra={
					<Circle className="border-black" size="lg">
						<Icon name="Business" width={20} height={20} />
					</Circle>
				}
			>
				Update Business
			</TransactionDetail>
			<TransactionDetail label={t("TRANSACTION.NAME")}>ROBank Eco</TransactionDetail>
			<TransactionDetail label={t("TRANSACTION.DESCRIPTION")}>Not a trustworthy bank</TransactionDetail>
			<TransactionDetail label={t("TRANSACTION.WEBSITE")}>
				<a href="http://robank.com" target="_blank" rel="noopener noreferrer" className="link">
					http://robank.com
				</a>
			</TransactionDetail>
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
				1.09660435 ARK
			</TransactionDetail>
		</TransactionSuccessful>
	);
};
