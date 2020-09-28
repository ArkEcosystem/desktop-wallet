import { Avatar } from "app/components/Avatar";
import { Circle } from "app/components/Circle";
import { Icon } from "app/components/Icon";
import { Label } from "app/components/Label";
import { TransactionDetail } from "domains/transaction/components/TransactionDetail";
import React from "react";
import { useTranslation } from "react-i18next";

import { Signatures } from "./Signatures";

export const FirstStep = () => {
	const { t } = useTranslation();

	return (
		<section data-testid="MultiSignatureDetail__first-step">
			<TransactionDetail label={t("TRANSACTION.SENDER")} extra={<Avatar address="test" />} border={false}>
				<div className="mt-2 font-semibold">ADDRESS</div>
			</TransactionDetail>

			<TransactionDetail label={t("TRANSACTION.RECIPIENT")} extra={<Avatar address="test" />}>
				Bank
				<span className="ml-2 text-theme-neutral">ADDR...ESSS</span>
			</TransactionDetail>

			<TransactionDetail
				label={t("TRANSACTION.AMOUNT")}
				extra={
					<Circle className="border-theme-danger-contrast text-theme-danger-400">
						<Icon name="Sent" width={16} height={16} />
					</Circle>
				}
			>
				<Label color="danger">2,088.84557 ARK</Label>

				<span className="ml-2 text-theme-neutral">23,000.00 USD</span>
			</TransactionDetail>

			<TransactionDetail label={t("TRANSACTION.TRANSACTION_FEE")}>0.09812015 ARK</TransactionDetail>

			<TransactionDetail label={t("TRANSACTION.SMARTBRIDGE")}>
				<div className="flex justify-between">
					Hello!
					<Icon name="Smartbridge" width={20} height={20} />
				</div>
			</TransactionDetail>

			<TransactionDetail label={t("TRANSACTION.TIMESTAMP")}>14.04.2020 21:42:40</TransactionDetail>

			<TransactionDetail label={t("TRANSACTION.CONFIRMATIONS")} className="pb-0">
				{t("TRANSACTION.MODAL_MULTISIGNATURE_DETAIL.WAITING_FOR_SIGNATURES")}
			</TransactionDetail>

			<div className="px-10 pt-8 mt-8 -mx-10 text-black border-t border-gray-500">
				<Signatures />
			</div>
		</section>
	);
};
