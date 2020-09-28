import { WalletData } from "@arkecosystem/platform-sdk-profiles";
import Tippy from "@tippyjs/react";
import { Address } from "app/components/Address";
import { Amount } from "app/components/Amount";
import { Avatar } from "app/components/Avatar";
import { Circle } from "app/components/Circle";
import { Clipboard } from "app/components/Clipboard";
import { Icon } from "app/components/Icon";
import { Label } from "app/components/Label";
import { Link } from "app/components/Link";
import { Modal } from "app/components/Modal";
import { TruncateMiddle } from "app/components/TruncateMiddle";
import { TransactionDetail } from "domains/transaction/components/TransactionDetail";
import React from "react";
import { useTranslation } from "react-i18next";

type TransferDetailProps = {
	isOpen: boolean;
	ticker?: string;
	transaction: any;
	walletAlias?: string;
	recipientWalletAlias?: string;
	onClose?: any;
};

export const TransferDetail = ({
	isOpen,
	ticker,
	transaction,
	walletAlias,
	recipientWalletAlias,
	onClose,
}: TransferDetailProps) => {
	const { t } = useTranslation();

	const renderModeIcon = (isSent: boolean) => {
		const modeIconName = isSent ? "Sent" : "Received";
		const tooltipContent = t(`TRANSACTION.${modeIconName.toUpperCase()}`);

		const modeCircleStyle = isSent
			? "border-theme-danger-contrast text-theme-danger"
			: "border-theme-success-300 text-theme-success";

		return (
			<Tippy content={tooltipContent}>
				<Circle className={modeCircleStyle} size="lg">
					<Icon name={modeIconName} width={15} height={21} />
				</Circle>
			</Tippy>
		);
	};

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

	const currency = React.useMemo(() => transaction.wallet()?.currency() || "", [transaction]);
	const exchangeCurrency = React.useMemo(() => transaction.wallet()?.exchangeCurrency() || "", [transaction]);

	return (
		<Modal title={t("TRANSACTION.MODAL_TRANSFER_DETAIL.TITLE")} isOpen={isOpen} onClose={onClose}>
			<TransactionDetail
				label={t("TRANSACTION.SENDER")}
				extra={<Avatar address={transaction.sender()} size="lg" />}
				border={false}
			>
				<Address
					address={transaction.sender()}
					maxChars={!walletAlias ? 0 : undefined}
					walletName={walletAlias}
					className="mt-2"
				/>
			</TransactionDetail>

			<TransactionDetail
				label={t("TRANSACTION.RECIPIENT")}
				extra={<Avatar address="transaction.recipient()" size="lg" />}
			>
				<Address
					address={transaction.recipient()}
					maxChars={!recipientWalletAlias ? 0 : undefined}
					walletName={recipientWalletAlias}
					className="mt-2"
				/>
			</TransactionDetail>

			<TransactionDetail label={t("TRANSACTION.AMOUNT")} extra={renderModeIcon(transaction.isSent())}>
				<div className="mt-2 font-semibold">
					<Label color={transaction.isSent() ? "danger" : "success"}>
						<Amount ticker={currency} value={transaction.amount()} />
					</Label>
					{exchangeCurrency && (
						<Amount
							ticker={exchangeCurrency}
							value={transaction.amount().times(transaction.wallet().data().get(WalletData.ExchangeRate))}
							className="ml-1 text-theme-neutral-light"
						/>
					)}
				</div>
			</TransactionDetail>

			<TransactionDetail label={t("TRANSACTION.TRANSACTION_FEE")}>
				<Amount ticker={currency} value={transaction.fee()} />
			</TransactionDetail>

			{transaction.memo() && (
				<TransactionDetail
					label={t("TRANSACTION.SMARTBRIDGE")}
					extra={<Icon name="Smartbridge" width={20} height={20} />}
				>
					{transaction.memo()}
				</TransactionDetail>
			)}

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

TransferDetail.defaultProps = {
	isOpen: false,
};

TransferDetail.displayName = "TransferDetail";
