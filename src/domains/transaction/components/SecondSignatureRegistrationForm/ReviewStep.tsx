import { ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";
import { Circle } from "app/components/Circle";
import { Header } from "app/components/Header";
import { Icon } from "app/components/Icon";
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

export const ReviewStep = ({ wallet }: { wallet: ReadWriteWallet }) => {
	const { t } = useTranslation();
	const { getValues, unregister } = useFormContext();
	const { fee } = getValues();

	useEffect(() => {
		unregister("mnemonic");
	}, [unregister]);

	return (
		<section data-testid="SecondSignature__review-step">
			<Header
				title={t("TRANSACTION.PAGE_SECOND_SIGNATURE.REVIEW_STEP.TITLE")}
				subtitle={t("TRANSACTION.PAGE_SECOND_SIGNATURE.REVIEW_STEP.DESCRIPTION")}
			/>

			<TransactionNetwork network={wallet.network()} border={false} paddingPosition="bottom" className="mt-8" />

			<TransactionSender address={wallet.address()} alias={wallet.alias()} />

			<TransactionDetail
				label={t("TRANSACTION.TRANSACTION_TYPE")}
				extra={
					<Circle className="border-theme-text" size="lg">
						<Icon name="Key" width={20} height={20} />
					</Circle>
				}
			>
				{t("TRANSACTION.TRANSACTION_TYPES.SECOND_SIGNATURE")}
			</TransactionDetail>

			<div className="mt-2">
				<TotalAmountBox fee={evaluateFee(fee)} ticker={wallet.currency()} />
			</div>
		</section>
	);
};
