import { ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";
import { Header } from "app/components/Header";
import { TotalAmountBox } from "domains/transaction/components/TotalAmountBox";
import {
	TransactionDetail,
	TransactionNetwork,
	TransactionSender,
} from "domains/transaction/components/TransactionDetail";
import { evaluateFee } from "domains/transaction/utils";
import React, { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

export const ReviewStep = ({ senderWallet }: { senderWallet: ReadWriteWallet }) => {
	const { t } = useTranslation();

	const { getValues, unregister } = useFormContext();

	useEffect(() => {
		unregister("mnemonic");
	}, [unregister]);

	return (
		<section data-testid="SendDelegateResignation__review-step">
			<Header
				title={t("TRANSACTION.PAGE_RESIGN_REGISTRATION.REVIEW_STEP.TITLE")}
				subtitle={t("TRANSACTION.PAGE_RESIGN_REGISTRATION.REVIEW_STEP.DESCRIPTION")}
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
				<TotalAmountBox fee={evaluateFee(getValues("fee"))} ticker={senderWallet.currency()} />
			</div>
		</section>
	);
};
