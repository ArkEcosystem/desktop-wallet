import { Contracts } from "@arkecosystem/platform-sdk-profiles";
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
import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

interface VoteDetailProperties {
	isOpen: boolean;
	transaction: any;
	onClose?: () => void;
}

export const VoteDetail = ({ transaction, isOpen, onClose }: VoteDetailProperties) => {
	const { t } = useTranslation();
	const { env } = useEnvironmentContext();

	const wallet = useMemo(() => transaction.wallet(), [transaction]);

	const [isLoadingDelegates, setIsLoadingDelegates] = useState(true);
	const [delegates, setDelegates] = useState<{
		votes: Contracts.IReadOnlyWallet[];
		unvotes: Contracts.IReadOnlyWallet[];
	}>({
		unvotes: [],
		votes: [],
	});

	useEffect(() => {
		const syncDelegates = () => {
			setIsLoadingDelegates(true);

			setDelegates({
				unvotes: env.delegates().map(wallet, transaction.unvotes()),
				votes: env.delegates().map(wallet, transaction.votes()),
			});

			setIsLoadingDelegates(false);
		};

		syncDelegates();

		return () => {
			setIsLoadingDelegates(false);
			setDelegates({ unvotes: [], votes: [] });
		};
	}, [env, wallet, transaction, isOpen]);

	return (
		<Modal title={t("TRANSACTION.MODAL_VOTE_DETAIL.TITLE")} isOpen={isOpen} onClose={onClose}>
			<TransactionSender
				address={transaction.sender()}
				alias={wallet.alias()}
				isDelegate={wallet.isDelegate() && !wallet.isResignedDelegate()}
				border={false}
			/>

			<TransactionVotes isLoading={isLoadingDelegates} {...delegates} />

			<TransactionFee currency={wallet.currency()} value={transaction.fee()} />

			<TransactionTimestamp timestamp={transaction.timestamp()} />

			<TransactionConfirmations transaction={transaction} />

			<TransactionExplorerLink id={transaction.id()} link={transaction.explorerLink()} />
		</Modal>
	);
};

VoteDetail.defaultProps = {
	isOpen: false,
};

VoteDetail.displayName = "VoteDetail";
