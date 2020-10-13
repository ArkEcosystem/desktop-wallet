import { Contracts } from "@arkecosystem/platform-sdk";
import { DateTime } from "@arkecosystem/platform-sdk-intl";
import { ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";
import { Clipboard } from "app/components/Clipboard";
import { Header } from "app/components/Header";
import { Icon } from "app/components/Icon";
import { TruncateMiddle } from "app/components/TruncateMiddle";
import {
	TransactionDetail,
	TransactionFee,
	TransactionSender,
	TransactionTimestamp,
} from "domains/transaction/components/TransactionDetail";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { Signatures } from "./Signatures";

export const SummaryStep = ({
	wallet,
	transaction,
}: {
	wallet: ReadWriteWallet;
	transaction: Contracts.SignedTransactionData;
}) => {
	const { t } = useTranslation();
	const [senderAddress, setSenderAddress] = useState("");

	useEffect(() => {
		const sync = async () => {
			const sender = await wallet.coin().identity().address().fromPublicKey(transaction.get("senderPublicKey"));
			setSenderAddress(sender);
		};
		sync();
	}, [wallet, transaction]);

	return (
		<section>
			<Header title={t("TRANSACTION.MODAL_MULTISIGNATURE_DETAIL.STEP_1.TITLE")} />

			<TransactionSender
				address={senderAddress}
				alias={wallet.alias()}
				isDelegate={wallet.isDelegate() && !wallet.isResignedDelegate()}
				border={false}
			/>

			<TransactionFee currency={wallet.currency()} value={transaction.fee()} />

			<TransactionTimestamp timestamp={DateTime.make("08.10.2020 20:00:48")} />

			<TransactionDetail label={t("TRANSACTION.CONFIRMATIONS")}>
				{t("TRANSACTION.MODAL_MULTISIGNATURE_DETAIL.WAITING_FOR_SIGNATURES")}
			</TransactionDetail>

			<TransactionDetail label={t("TRANSACTION.ID")}>
				<div className="flex items-center">
					<TruncateMiddle text={transaction.id()} maxChars={30} className="text-theme-text" />

					<span className="ml-5 text-theme-primary-300">
						<Clipboard data={transaction.id()}>
							<Icon name="Copy" />
						</Clipboard>
					</span>
				</div>
			</TransactionDetail>

			<div className="px-10 pt-6 mt-4 -mx-10 text-black border-t border-theme-neutral-light">
				<Signatures transaction={transaction} wallet={wallet} />
			</div>
		</section>
	);
};
