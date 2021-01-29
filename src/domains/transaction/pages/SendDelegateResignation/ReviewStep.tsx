import { BigNumber } from "@arkecosystem/platform-sdk-support";
import { Header } from "app/components/Header";
import { TotalAmountBox } from "domains/transaction/components/TotalAmountBox";
import {
	TransactionDetail,
	TransactionNetwork,
	TransactionSender,
} from "domains/transaction/components/TransactionDetail";
import { StepProps } from "domains/transaction/pages/SendDelegateResignation/SendDelegateResignation.models";
import React from "react";
import { useTranslation } from "react-i18next";

export const ReviewStep = ({ fees, senderWallet }: StepProps) => {
	const { t } = useTranslation();

	return (
		<section data-testid="SendDelegateResignation__review-step">
			<Header
				title={t("TRANSACTION.PAGE_RESIGN_REGISTRATION.SECOND_STEP.TITLE")}
				subtitle={t("TRANSACTION.PAGE_RESIGN_REGISTRATION.SECOND_STEP.DESCRIPTION")}
			/>

			<TransactionNetwork
				network={senderWallet.network()}
				border={false}
				paddingPosition="bottom"
				className="mt-8"
			/>

			<TransactionSender address={senderWallet.address()} alias={senderWallet.alias()} />

			<TransactionDetail label={t("TRANSACTION.DELEGATE_NAME")}>{senderWallet.username()}</TransactionDetail>

			<div className="mt-2">
				<TotalAmountBox fee={BigNumber.make(fees.static)} ticker={senderWallet.currency()} />
			</div>
		</section>
	);
};
