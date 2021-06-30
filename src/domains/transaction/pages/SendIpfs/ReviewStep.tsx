import { Contracts } from "@arkecosystem/platform-sdk-profiles";
import { Header } from "app/components/Header";
import { TotalAmountBox } from "domains/transaction/components/TotalAmountBox";
import {
	TransactionDetail,
	TransactionNetwork,
	TransactionSender,
} from "domains/transaction/components/TransactionDetail";
import React, { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

export const ReviewStep = ({ wallet }: { wallet: Contracts.IReadWriteWallet }) => {
	const { t } = useTranslation();

	const { unregister, watch } = useFormContext();
	const { fee, hash } = watch();

	useEffect(() => {
		unregister("mnemonic");
	}, [unregister]);

	return (
		<section data-testid="SendIpfs__review-step">
			<Header
				title={t("TRANSACTION.PAGE_IPFS.SECOND_STEP.TITLE")}
				subtitle={t("TRANSACTION.PAGE_IPFS.SECOND_STEP.DESCRIPTION")}
			/>

			<TransactionNetwork network={wallet.network()} border={false} />

			<TransactionSender address={wallet.address()} alias={wallet.alias()} />

			<TransactionDetail label={t("TRANSACTION.IPFS_HASH")}>
				<span className="break-all">{hash}</span>
			</TransactionDetail>

			<div className="mt-2">
				<TotalAmountBox amount={0} fee={fee} ticker={wallet.currency()} />
			</div>
		</section>
	);
};
