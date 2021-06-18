import { Contracts } from "@arkecosystem/platform-sdk";
import { Contracts as ProfileContracts, DTO } from "@arkecosystem/platform-sdk-profiles";
import { BigNumber } from "@arkecosystem/platform-sdk-support";
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
	wallet: ProfileContracts.IReadWriteWallet;
	transaction: DTO.ExtendedSignedTransactionData;
}) => {
	const { env } = useEnvironmentContext();
	const { t } = useTranslation();
	const [senderAddress, setSenderAddress] = useState("");

	const type = transaction.type();

	const isTransferType = () => ["transfer", "multiPayment"].includes(type);

	// TODO: Move this helpers to SignedData on platform-sdk
	const participants = transaction
		.get<{ publicKeys: string[] }>("multiSignature")
		.publicKeys.filter((pubKey) => pubKey !== wallet.publicKey());

	let recipients: any;
	let transactionAmount: number;

	if (isTransferType()) {
		recipients = transaction
			.get<{ payments: Record<string, string>[] }>("asset")
			?.payments?.map((item) => ({ address: item.recipientId, amount: +item.amount })) || [
			{ address: transaction.get<string>("recipientId"), amount: transaction.amount() },
		];

		transactionAmount = recipients.reduce(
			(sum: BigNumber, recipient: Contracts.MultiPaymentRecipient) => sum.plus(recipient.amount),
			BigNumber.ZERO,
		);
	}

	const [delegates, setDelegates] = useState<{
		votes: ProfileContracts.IReadOnlyWallet[];
		unvotes: ProfileContracts.IReadOnlyWallet[];
	}>({
		votes: [],
		unvotes: [],
	});

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
			const { address } = await wallet.coin().address().fromPublicKey(transaction.get("senderPublicKey"));
			setSenderAddress(address);
		};

		const findVoteDelegates = () => {
			if (["vote", "unvote"].includes(type)) {
				const asset = transaction.get<{ votes: string[] }>("asset");
				const votes = asset.votes.filter((vote) => vote.startsWith("+")).map((s) => s.slice(1));
				const unvotes = asset.votes.filter((vote) => vote.startsWith("-")).map((s) => s.slice(1));

				setDelegates({
					votes: env.delegates().map(wallet, votes),
					unvotes: env.delegates().map(wallet, unvotes),
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

			{isTransferType() && (
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

			<div className="px-10 pt-6 mt-4 -mx-10 border-t border-theme-secondary-300 dark:border-theme-secondary-800">
				<Signatures transactionId={transaction.id()} publicKeys={participants} wallet={wallet} />
			</div>
		</section>
	);
};
