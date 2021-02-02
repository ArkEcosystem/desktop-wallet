import { ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";
import { BigNumber } from "@arkecosystem/platform-sdk-support";
import { Circle } from "app/components/Circle";
import { Header } from "app/components/Header";
import { Icon } from "app/components/Icon";
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

export const ReviewStep = ({ wallet }: { wallet: ReadWriteWallet }) => {
	const { t } = useTranslation();
	const { unregister, watch } = useFormContext();
	const { fee, participants, minParticipants } = watch();

	useEffect(() => {
		unregister("mnemonic");
	}, [unregister]);

	return (
		<section data-testid="MultiSignature__review-step">
			<Header
				title={t("TRANSACTION.PAGE_MULTISIGNATURE.REVIEW_STEP.TITLE")}
				subtitle={t("TRANSACTION.PAGE_MULTISIGNATURE.REVIEW_STEP.DESCRIPTION")}
			/>

			<TransactionNetwork network={wallet.network()} border={false} paddingPosition="bottom" className="mt-8" />

			<TransactionSender address={wallet.address()} alias={wallet.alias()} />

			<TransactionDetail label={t("TRANSACTION.MULTISIGNATURE.PARTICIPANTS")}>
				<RecipientList showAmount={false} variant="condensed" recipients={participants} isEditable={false} />
			</TransactionDetail>

			<TransactionDetail label={t("TRANSACTION.MULTISIGNATURE.MIN_SIGNATURES")}>
				<div className="flex items-center space-x-1 font-semibold">
					<span>{minParticipants}</span>
					<span className="text-theme-secondary-500">
						{t("TRANSACTION.MULTISIGNATURE.OUT_OF_LENGTH", { length: participants.length })}
					</span>
				</div>
			</TransactionDetail>

			<TransactionDetail
				label={t("TRANSACTION.TYPE")}
				extra={
					<div>
						<Circle className="border-black bg-theme-background" size="lg">
							<Icon name="Multisig" width={20} height={20} />
						</Circle>
					</div>
				}
			>
				{t("TRANSACTION.PAGE_MULTISIGNATURE.REVIEW_STEP.TYPE")}
			</TransactionDetail>

			<div className="mt-2">
				<TotalAmountBox amount={BigNumber.ZERO} fee={BigNumber.make(fee)} ticker={wallet.currency()} />
			</div>
		</section>
	);
};
