import { DelegateMapper, ReadOnlyWallet, ReadWriteWallet, VoteData } from "@arkecosystem/platform-sdk-profiles";
import { Modal } from "app/components/Modal";
import { useEnvironmentContext } from "app/contexts";
import {
	TransactionConfirmations,
	TransactionExplorerLink,
	TransactionFee,
	TransactionSender,
	TransactionTimestamp,
	TransactionVotes,
} from "domains/transaction/components/TransactionDetail";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

type VoteDetailProps = {
	isOpen: boolean;
	senderWallet?: ReadWriteWallet;
	transaction: any;
	wallet: any;
	onClose?: () => void;
};

export const VoteDetail = ({
	isOpen,
	senderWallet,
	transaction,
	wallet,
	onClose,
}: VoteDetailProps) => {
	const { t } = useTranslation();
	const { env } = useEnvironmentContext();

	const [isLoadingDelegates, setIsLoadingDelegates] = useState(true);
	const [delegates, setDelegates] = useState<{ votes: ReadOnlyWallet[]; unvotes: ReadOnlyWallet[] }>({
		votes: [],
		unvotes: [],
	});

	useEffect(() => {
		const syncDelegates = () => {
			setIsLoadingDelegates(true);

			setDelegates({
				votes: DelegateMapper.execute(wallet, (transaction as VoteData).votes()),
				unvotes: DelegateMapper.execute(wallet, (transaction as VoteData).unvotes()),
			});

			setIsLoadingDelegates(false);
		};

		syncDelegates();

		return () => {
			setIsLoadingDelegates(false);
			setDelegates({ votes: [], unvotes: [] });
		};
	}, [env, wallet, transaction, isOpen]);

	return (
		<Modal title={t("TRANSACTION.MODAL_VOTE_DETAIL.TITLE")} isOpen={isOpen} onClose={onClose}>
			<TransactionSender
				address={transaction.sender()}
				wallet={senderWallet}
				border={false}
			/>

			<TransactionVotes isLoading={isLoadingDelegates} {...delegates} />

			<TransactionFee currency={wallet.currency()} value={transaction.fee()} />

			<TransactionTimestamp timestamp={transaction.timestamp()} />

			<TransactionConfirmations
				isConfirmed={transaction.isConfirmed()}
				confirmations={transaction.confirmations()}
			/>

			<TransactionExplorerLink id={transaction.id()} link={transaction.explorerLink()} />

			{transaction.blockId() && (
				<TransactionExplorerLink
					id={transaction.blockId()}
					link={transaction.explorerLinkForBlock()}
					variant="block"
				/>
			)}
		</Modal>
	);
};

VoteDetail.defaultProps = {
	isOpen: false,
};

VoteDetail.displayName = "VoteDetail";
