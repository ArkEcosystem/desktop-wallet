import { Contracts } from "@arkecosystem/platform-sdk-profiles";
import { Header } from "app/components/Header";
import {
	TransactionDetail,
	TransactionNetwork,
	TransactionSender,
} from "domains/transaction/components/TransactionDetail";
import React, { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { RecipientList } from "../RecipientList";
import { TotalAmountBox } from "../TotalAmountBox";

export const ReviewStep = ({ wallet }: { wallet: Contracts.IReadWriteWallet }) => {
	const { t } = useTranslation();
	const { unregister, watch } = useFormContext();
	const { fee, participants, minParticipants } = watch();

	useEffect(() => {
		unregister("mnemonic");
	}, [unregister]);

	return (
		<section data-testid="MultiSignature__review-step">
			<Header title={t("TRANSACTION.REVIEW_STEP.TITLE")} subtitle={t("TRANSACTION.REVIEW_STEP.DESCRIPTION")} />

			<TransactionNetwork network={wallet.network()} border={false} />

			<TransactionSender address={wallet.address()} alias={wallet.alias()} />

			<TransactionDetail label={t("TRANSACTION.MULTISIGNATURE.PARTICIPANTS")}>
				<RecipientList showAmount={false} variant="condensed" recipients={participants} isEditable={false} />
			</TransactionDetail>

			<TransactionDetail label={t("TRANSACTION.MULTISIGNATURE.MIN_SIGNATURES")} className="-mt-4">
				<div className="flex items-center space-x-1 font-semibold">
					<span>{minParticipants}</span>
					<span className="text-theme-secondary-500">
						{t("TRANSACTION.MULTISIGNATURE.OUT_OF_LENGTH", { length: participants.length })}
					</span>
				</div>
			</TransactionDetail>

			<div className="mt-2">
				<TotalAmountBox amount={0} fee={fee} ticker={wallet.currency()} />
			</div>
		</section>
	);
};
