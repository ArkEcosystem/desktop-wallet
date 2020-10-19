import { Contracts } from "@arkecosystem/platform-sdk";
import { ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";
import { BigNumber } from "@arkecosystem/platform-sdk-support";
import { Clipboard } from "app/components/Clipboard";
import { Header } from "app/components/Header";
import { Icon } from "app/components/Icon";
import { TruncateMiddle } from "app/components/TruncateMiddle";
import {
	TransactionAmount,
	TransactionDetail,
	TransactionFee,
	TransactionRecipients,
	TransactionSender,
} from "domains/transaction/components/TransactionDetail";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { Signatures } from "./Signatures";

const getType = (transaction: Contracts.SignedTransactionData): string => {
	const type = transaction.get<number>("type");
	const typeGroup = transaction.get<number>("typeGroup");

	if (type === 4 && typeGroup === 1) {
		return "multiSignature";
	}

	if (type === 6) {
		console.log("multiPayment");
		return "multiPayment";
	}

	console.log("transfer");
	return "transfer";
};

export const SummaryStep = ({
	wallet,
	transaction,
}: {
	wallet: ReadWriteWallet;
	transaction: Contracts.SignedTransactionData;
}) => {
	const { t } = useTranslation();
	const [senderAddress, setSenderAddress] = useState("");

	// TODO: Move this helpers to SignedData on platform-sdk
	const participants = transaction
		.get<{ publicKeys: string[] }>("multiSignature")
		.publicKeys.filter((pubKey) => pubKey !== wallet.publicKey());

	const recipient = transaction.get<string>("recipientId");
	const recipients = transaction
		.get<{ payments: Record<string, string>[] }>("asset")
		?.payments?.map((item) => ({ address: item.recipientId, amount: BigNumber.make(item.amount) }));

	const type = getType(transaction);
	const titles: Record<string, string> = {
		transfer: "TRANSACTION.TRANSACTION_TYPES.TRANSFER",
		multiSignature: "TRANSACTION.TRANSACTION_TYPES.MULTI_SIGNATURE",
		multiPayment: "TRANSACTION.TRANSACTION_TYPES.MULTI_PAYMENT",
	};

	useEffect(() => {
		const sync = async () => {
			const sender = await wallet.coin().identity().address().fromPublicKey(transaction.get("senderPublicKey"));
			setSenderAddress(sender);
		};
		sync();
	}, [wallet, transaction]);

	return (
		<section>
			<Header title={t(titles[type])} />

			<TransactionSender address={senderAddress} alias={wallet.alias()} border={false} />

			{(recipients || recipient) && (
				<TransactionRecipients
					currency={wallet.currency()}
					recipient={{ address: recipient }}
					recipients={recipients}
				/>
			)}

			{!transaction.amount().isZero() && (
				<TransactionAmount amount={transaction.amount()} currency={wallet.currency()} isSent={true} />
			)}

			<TransactionFee currency={wallet.currency()} value={transaction.fee()} />

			{/* @TODO
				<TransactionTimestamp timestamp={DateTime.make("08.10.2020 20:00:48")} />
			*/}

			<TransactionDetail label={t("TRANSACTION.CONFIRMATIONS")}>
				{t("TRANSACTION.MODAL_MULTISIGNATURE_DETAIL.WAITING_FOR_SIGNATURES")}
			</TransactionDetail>

			<TransactionDetail label={t("TRANSACTION.ID")}>
				<div className="flex items-center space-x-3">
					<TruncateMiddle text={transaction.id()} maxChars={30} className="text-theme-text" />

					<span className="flex text-theme-primary-300 dark:text-theme-neutral-600">
						<Clipboard data={transaction.id()}>
							<Icon name="Copy" />
						</Clipboard>
					</span>
				</div>
			</TransactionDetail>

			<div className="px-10 pt-6 mt-4 -mx-10 text-black border-t border-theme-neutral-300 dark:border-theme-neutral-800">
				<Signatures transactionId={transaction.id()} publicKeys={participants} wallet={wallet} />
			</div>
		</section>
	);
};
