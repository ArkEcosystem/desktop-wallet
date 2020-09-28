import Tippy from "@tippyjs/react";
import { Amount } from "app/components/Amount";
import { Avatar } from "app/components/Avatar";
import { Circle } from "app/components/Circle";
import { Clipboard } from "app/components/Clipboard";
import { Icon } from "app/components/Icon";
import { Link } from "app/components/Link";
import { Modal } from "app/components/Modal";
import { TruncateMiddle } from "app/components/TruncateMiddle";
import { TransactionDetail } from "domains/transaction/components/TransactionDetail";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";

type EntityDetailProps = {
	isOpen: boolean;
	ticker?: string;
	transaction: any;
	walletAlias?: string;
	onClose?: any;
};

export const EntityDetail = ({ isOpen, ticker, transaction, walletAlias, onClose }: EntityDetailProps) => {
	const { t } = useTranslation();

	const renderConfirmationStatus = (isConfirmed: boolean, confirmations: number) => {
		const confirmationStatusStyle = isConfirmed
			? "bg-theme-success-200 text-theme-success-500"
			: "bg-theme-danger-200 text-theme-danger-500";

		if (isConfirmed) {
			return (
				<div className="flex">
					<span>{t("TRANSACTION.WELL_CONFIRMED")}</span>
					<Tippy content={t("TRANSACTION.CONFIRMATIONS_COUNT", { count: confirmations })}>
						<div className={`flex w-6 h-6 ml-2 rounded-full ${confirmationStatusStyle}`}>
							<div className="m-auto">
								<Icon name="Checkmark" width={15} height={15} />
							</div>
						</div>
					</Tippy>
				</div>
			);
		}

		return (
			<div className="flex">
				<span>{t("TRANSACTION.NOT_CONFIRMED")}</span>
				<div className={`flex w-6 h-6 ml-2 rounded-full ${confirmationStatusStyle}`}>
					<div className="m-auto">
						<Icon name="CrossSlim" width={12} height={12} />
					</div>
				</div>
			</div>
		);
	};

	const renderSender = () => {
		if (walletAlias) {
			return (
				<TransactionDetail
					label={t("TRANSACTION.SENDER")}
					extra={
						<div className="flex items-center">
							<Circle className="-mr-2 border-black">
								<Icon name="Key" width={20} height={20} />
							</Circle>
							<Avatar address={transaction.sender()} />
						</div>
					}
					border={false}
				>
					{walletAlias}
					<TruncateMiddle text={transaction.sender()} className="ml-2 text-theme-neutral" />
				</TransactionDetail>
			);
		}

		return (
			<TransactionDetail
				label={t("TRANSACTION.SENDER")}
				extra={
					<div className="flex items-center">
						<Circle className="-mr-2 border-black">
							<Icon name="Key" width={20} height={20} />
						</Circle>
						<Avatar address={transaction.sender()} />
					</div>
				}
				border={false}
			>
				<TruncateMiddle text={transaction.sender()} className="text-theme-neutral" />
			</TransactionDetail>
		);
	};

	const currency = useMemo(() => transaction.wallet()?.currency() || "", [transaction]);

	return (
		<Modal title={t("TRANSACTION.MODAL_ENTITY_DETAIL.TITLE")} isOpen={isOpen} onClose={onClose}>
			{renderSender()}

			<TransactionDetail label={t("TRANSACTION.TRANSACTION_FEE")}>
				<Amount ticker={currency} value={transaction.fee()} />
			</TransactionDetail>

			<TransactionDetail label={t("TRANSACTION.TIMESTAMP")}>
				{transaction.timestamp()!.format("DD.MM.YYYY HH:mm:ss")}
			</TransactionDetail>

			<TransactionDetail label={t("TRANSACTION.CONFIRMATIONS")}>
				{renderConfirmationStatus(transaction.isConfirmed(), transaction.confirmations().toNumber())}
			</TransactionDetail>

			<TransactionDetail label={t("TRANSACTION.ID")}>
				<Link to={transaction.explorerLink()} isExternal showExternalIcon={false}>
					<TruncateMiddle text={transaction.id()} maxChars={30} className="text-theme-primary-dark" />
				</Link>

				<span className="inline-block ml-4 text-theme-primary-300">
					<Clipboard data={transaction.id()}>
						<Icon name="Copy" />
					</Clipboard>
				</span>
			</TransactionDetail>

			{!!transaction.blockId() && (
				<TransactionDetail label={t("TRANSACTION.BLOCK_ID")}>
					<Link
						to={transaction.coin()?.link().block(transaction.blockId())}
						isExternal
						showExternalIcon={false}
					>
						<TruncateMiddle
							text={transaction.blockId()}
							maxChars={30}
							className="text-theme-primary-dark"
						/>
					</Link>

					<span className="inline-block ml-4 text-theme-primary-300">
						<Clipboard data={transaction.blockId()}>
							<Icon name="Copy" />
						</Clipboard>
					</span>
				</TransactionDetail>
			)}
		</Modal>
	);
};

EntityDetail.defaultProps = {
	isOpen: false,
};
