import { Contracts, DTO } from "@arkecosystem/platform-sdk-profiles";
import { Circle } from "app/components/Circle";
import { Clipboard } from "app/components/Clipboard";
import { Header } from "app/components/Header";
import { Icon } from "app/components/Icon";
import { TruncateMiddle } from "app/components/TruncateMiddle";
import { useEnvironmentContext } from "app/contexts";
import {
	TransactionAmount,
	TransactionDetail,
	TransactionFee,
	TransactionRecipients,
	TransactionSender,
	TransactionVotes,
} from "domains/transaction/components/TransactionDetail";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { Signatures } from "./Signatures";

export const SummaryStep = ({
	wallet,
	transaction,
}: {
	wallet: Contracts.IReadWriteWallet;
	transaction: DTO.ExtendedSignedTransactionData;
}) => {
	const { env } = useEnvironmentContext();
	const { t } = useTranslation();
	const [senderAddress, setSenderAddress] = useState("");

	const type = transaction.type();

	// TODO: Move this helpers to SignedData on platform-sdk
	const participants = transaction
		.get<{ publicKeys: string[] }>("multiSignature")
		.publicKeys.filter((pubKey) => pubKey !== wallet.publicKey());

	let recipients: any;
	let transactionAmount: number;

	if (transaction.isTransfer() || transaction.isMultiPayment()) {
		recipients = transaction.recipients();
		transactionAmount = transaction.amount();
	}

	const [delegates, setDelegates] = useState<{
		votes: Contracts.IReadOnlyWallet[];
		unvotes: Contracts.IReadOnlyWallet[];
	}>({
		unvotes: [],
		votes: [],
	});

	const titles: Record<string, string> = {
		ipfs: "TRANSACTION.TRANSACTION_TYPES.IPFS",
		multiPayment: "TRANSACTION.TRANSACTION_TYPES.MULTI_PAYMENT",
		multiSignature: "TRANSACTION.TRANSACTION_TYPES.MULTI_SIGNATURE",
		transfer: "TRANSACTION.TRANSACTION_TYPES.TRANSFER",
		unvote: "TRANSACTION.TRANSACTION_TYPES.UNVOTE",
		vote: "TRANSACTION.TRANSACTION_TYPES.VOTE",
	};

	useEffect(() => {
		const setAddress = async () => {
			const { address } = await wallet.coin().address().fromPublicKey(transaction.get("senderPublicKey"));
			setSenderAddress(address);
		};

		const findVoteDelegates = () => {
			if (["vote", "unvote"].includes(type)) {
				const asset = transaction.get<{ votes: string[] }>("asset");
				const votes = asset.votes.filter((vote) => vote.startsWith("+")).map((s) => s.slice(1));
				const unvotes = asset.votes.filter((vote) => vote.startsWith("-")).map((s) => s.slice(1));

				setDelegates({
					unvotes: env.delegates().map(wallet, unvotes),
					votes: env.delegates().map(wallet, votes),
				});
			}
		};

		setAddress();
		findVoteDelegates();
	}, [env, wallet, transaction, type]);

	return (
		<section>
			<Header title={t(titles[type])} />

			<TransactionSender address={senderAddress} alias={wallet.alias()} border={false} />

			{recipients && <TransactionRecipients currency={wallet.currency()} recipients={recipients} />}

			{(transaction.isTransfer() || transaction.isMultiPayment()) && (
				<TransactionAmount
					amount={transactionAmount!}
					currency={wallet.currency()}
					isMultiPayment={recipients.length > 1}
					isSent={true}
				/>
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

			{/* @TODO
				<TransactionTimestamp timestamp={DateTime.make("08.10.2020 20:00:48")} />
			*/}

			<TransactionDetail label={t("TRANSACTION.CONFIRMATIONS")}>
				{t("TRANSACTION.MODAL_MULTISIGNATURE_DETAIL.WAITING_FOR_SIGNATURES")}
			</TransactionDetail>

			<TransactionDetail label={t("TRANSACTION.ID")}>
				<div className="flex items-center space-x-3">
					<TruncateMiddle text={transaction.id()} maxChars={30} className="text-theme-text" />

					<span className="flex text-theme-primary-300 dark:text-theme-secondary-600">
						<Clipboard variant="icon" data={transaction.id()}>
							<Icon name="Copy" />
						</Clipboard>
					</span>
				</div>
			</TransactionDetail>

			<div className="px-10 pt-6 -mx-10 mt-4 border-t border-theme-secondary-300 dark:border-theme-secondary-800">
				<Signatures transactionId={transaction.id()} publicKeys={participants} wallet={wallet} />
			</div>
		</section>
	);
};
