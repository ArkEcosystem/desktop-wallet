import { Contracts } from "@arkecosystem/platform-sdk";
import { ReadOnlyWallet } from "@arkecosystem/platform-sdk-profiles";
import { BigNumber } from "@arkecosystem/platform-sdk-support";
import { Avatar } from "app/components/Avatar";
import { Circle } from "app/components/Circle";
import { Icon } from "app/components/Icon";
import { Modal } from "app/components/Modal";
import { TransactionDetail } from "app/components/TransactionDetail";
import { TruncateMiddle } from "app/components/TruncateMiddle";
import { useActiveProfile } from "app/hooks/env";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Skeleton from "react-loading-skeleton";

type VoteDetailProps = {
	isOpen: boolean;
	transaction?: Contracts.TransactionDataType;
	ticker?: string;
	walletAlias?: string;
	onClose?: () => void;
};

const renderConfirmationStatus = (confirmations: BigNumber) => {
	if (confirmations?.toNumber() < 51) {
		return (
			<div className="flex">
				Not Confirmed
				<div className="flex w-6 h-6 ml-2 rounded-full bg-theme-danger-200 text-theme-danger-500">
					<div className="m-auto">
						<Icon name="CrossSlim" width={12} height={12} />
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="flex">
			Well Confirmed
			<div className="flex w-6 h-6 ml-2 rounded-full bg-theme-success-200 text-theme-success-500">
				<div className="m-auto">
					<Icon name="Checkmark" width={15} height={15} />
				</div>
			</div>
		</div>
	);
};

export const VoteDetail = ({ transaction, walletAlias, ticker, isOpen, onClose }: VoteDetailProps) => {
	const { t } = useTranslation();
	const activeProfile = useActiveProfile();
	const senderWallet = activeProfile.wallets().findByAddress(transaction!.sender());

	const [isLoadingDelegates, setIsLoadingDelegates] = useState(true);
	const [delegates, setDelegates] = useState<ReadOnlyWallet[]>([]);

	const getDelegates = React.useCallback(
		() => senderWallet?.mapDelegates((transaction as Contracts.VoteData).votes()),
		[senderWallet, transaction],
	);

	useEffect(() => {
		const syncDelegates = async () => {
			setIsLoadingDelegates(true);
			await senderWallet?.syncDelegates();
			const delegates = getDelegates();

			setDelegates(delegates || []);
			setIsLoadingDelegates(false);
		};

		syncDelegates();

		return () => {
			setIsLoadingDelegates(false);
			setDelegates([]);
		};
	}, [senderWallet, getDelegates]);

	const renderAccount = () => {
		if (walletAlias) {
			return (
				<TransactionDetail
					label={t("TRANSACTION.ACCOUNT")}
					extra={
						<div className="flex items-center">
							<Circle className="-mr-2 border-black">
								<Icon name="Delegate" width={25} height={25} />
							</Circle>
							<Avatar address={transaction!.sender()} />
						</div>
					}
				>
					{walletAlias}
					<TruncateMiddle text={transaction!.sender()} className="ml-2 text-theme-neutral" />
				</TransactionDetail>
			);
		}

		return (
			<TransactionDetail
				label={t("TRANSACTION.ACCOUNT")}
				extra={
					<div className="flex items-center">
						<Circle className="-mr-2 border-black">
							<Icon name="Delegate" width={25} height={25} />
						</Circle>
						<Avatar address={transaction!.sender()} />
					</div>
				}
			>
				<TruncateMiddle text={transaction!.sender()} className="text-theme-neutral" />
			</TransactionDetail>
		);
	};

	const renderDelegates = () => {
		if (isLoadingDelegates) {
			return (
				<TransactionDetail
					label={t("TRANSACTION.VOTER")}
					extra={<Skeleton circle width={40} height={40} className="mt-3" />}
				>
					<Skeleton height={6} width="90%" />
				</TransactionDetail>
			);
		}

		return delegates?.map((delegate: any) => {
			const username = delegate?.username();
			const address = delegate?.address();

			return (
				<TransactionDetail
					key={address}
					label={t("TRANSACTION.VOTER")}
					extra={
						<div className="flex">
							<Circle className="-mr-2 border-black">
								<Icon name="Voted" width={13} height={13} />
							</Circle>
							<Avatar address={address} />
						</div>
					}
				>
					{username}
					<TruncateMiddle text={address} className="ml-2 text-theme-neutral" />
				</TransactionDetail>
			);
		});
	};

	return (
		<Modal title={t("TRANSACTION.MODAL_VOTE_DETAIL.TITLE")} isOpen={isOpen} onClose={onClose}>
			{renderAccount()}

			{renderDelegates()}

			<TransactionDetail label={t("TRANSACTION.TRANSACTION_FEE")}>
				{`${transaction!.fee().toHuman()} ${ticker?.toUpperCase()}`}
			</TransactionDetail>

			<TransactionDetail label={t("TRANSACTION.TIMESTAMP")}>
				{transaction!.timestamp()!.format("DD.MM.YYYY HH:mm:ss")}
			</TransactionDetail>

			<TransactionDetail label={t("TRANSACTION.CONFIRMATIONS")}>
				{renderConfirmationStatus(transaction!.confirmations())}
			</TransactionDetail>

			<TransactionDetail label={t("TRANSACTION.ID")}>
				<TruncateMiddle text={transaction!.id()} className="text-theme-primary-dark" />

				<span className="inline-block ml-4 text-theme-primary-300">
					<Icon name="Copy" />
				</span>
			</TransactionDetail>

			{transaction!.blockId() && (
				<TransactionDetail label={t("TRANSACTION.BLOCK_ID")}>
					<TruncateMiddle text={transaction!.blockId()!} className="text-theme-primary-dark" />

					<span className="inline-block ml-4 text-theme-primary-300">
						<Icon name="Copy" />
					</span>
				</TransactionDetail>
			)}
		</Modal>
	);
};

VoteDetail.defaultProps = {
	isOpen: false,
};

VoteDetail.displayName = "VoteDetail";
