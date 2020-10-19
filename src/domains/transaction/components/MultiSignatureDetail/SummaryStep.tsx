import { Contracts } from "@arkecosystem/platform-sdk";
import { DateTime } from "@arkecosystem/platform-sdk-intl";
import { DelegateMapper, ReadOnlyWallet, ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";
import { BigNumber } from "@arkecosystem/platform-sdk-support";
import { Circle } from "app/components/Circle";
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
	TransactionTimestamp,
	TransactionVotes,
} from "domains/transaction/components/TransactionDetail";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { Signatures } from "./Signatures";

const getType = (transaction: Contracts.SignedTransactionData): string => {
	const type = transaction.get<number>("type");
	const typeGroup = transaction.get<number>("typeGroup");
	const asset = transaction.get<Record<string, any>>("asset");

	if (type === 4 && typeGroup === 1) {
		return "multiSignature";
	}

	if (type === 6) {
		return "multiPayment";
	}

	if (type === 3 && asset?.votes?.[0].startsWith("-")) {
		return "unvote";
	}

	if (type === 3) {
		return "vote";
	}

	if (type === 5) {
		return "ipfs";
	}

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

	const [delegates, setDelegates] = useState<{ votes: ReadOnlyWallet[]; unvotes: ReadOnlyWallet[] }>({
		votes: [],
		unvotes: [],
	});

	const type = getType(transaction);
	const titles: Record<string, string> = {
		transfer: "TRANSACTION.TRANSACTION_TYPES.TRANSFER",
		multiSignature: "TRANSACTION.TRANSACTION_TYPES.MULTI_SIGNATURE",
		multiPayment: "TRANSACTION.TRANSACTION_TYPES.MULTI_PAYMENT",
		vote: "TRANSACTION.TRANSACTION_TYPES.VOTE",
		unvote: "TRANSACTION.TRANSACTION_TYPES.UNVOTE",
		ipfs: "TRANSACTION.TRANSACTION_TYPES.IPFS",
	};

	useEffect(() => {
		const setAddress = async () => {
			const sender = await wallet.coin().identity().address().fromPublicKey(transaction.get("senderPublicKey"));
			setSenderAddress(sender);
		};

		const findVoteDelegates = () => {
			if (["vote", "unvote"].includes(type)) {
				const asset = transaction.get<{ votes: string[] }>("asset");
				const votes = asset.votes.filter((vote) => vote.startsWith("+")).map((s) => s.substring(1));
				const unvotes = asset.votes.filter((vote) => vote.startsWith("-")).map((s) => s.substring(1));

				setDelegates({
					votes: DelegateMapper.execute(wallet, votes),
					unvotes: DelegateMapper.execute(wallet, unvotes),
				});
			}
		};

		setAddress();
		findVoteDelegates();
	}, [wallet, transaction, type]);

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

			{(type === "vote" || type === "unvote") && <TransactionVotes {...delegates} />}

			{type === "ipfs" && (
				<TransactionDetail
					label={t("TRANSACTION.IPFS_HASH")}
					extra={
						<Circle className="border-theme-text" size="lg">
							<Icon name="Ipfs" width={21} height={23} />
						</Circle>
					}
				>
					{transaction.get<{ hash: string }>("asset").hash}
				</TransactionDetail>
			)}

			<TransactionFee currency={wallet.currency()} value={transaction.fee()} />

			<TransactionTimestamp timestamp={DateTime.fromUnix(1596213281)} />

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
				<Signatures transactionId={transaction.id()} publicKeys={participants} wallet={wallet} />
			</div>
		</section>
	);
};
