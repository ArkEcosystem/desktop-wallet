import { Address } from "app/components/Address";
import { Alert } from "app/components/Alert";
import { Avatar } from "app/components/Avatar";
import { Button } from "app/components/Button";
import { Clipboard } from "app/components/Clipboard";
import { Form } from "app/components/Form";
import { Icon } from "app/components/Icon";
import { Modal } from "app/components/Modal";
import { NetworkIcon } from "domains/network/components/NetworkIcon";
import { TransactionDetail } from "domains/transaction/components/TransactionDetail";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { ReceiveFundsForm, useQRCode } from "./";

type ReceiveFundsProps = {
	address: string;
	icon: string;
	name?: string;
	network: string;
	isOpen: boolean;
	onClose?: () => void;
};

export const ReceiveFunds = ({ address, icon, name, network, isOpen, onClose }: ReceiveFundsProps) => {
	const [isFormOpen, setIsFormOpen] = useState<boolean>(false);

	const maxLength = 255;

	const { t } = useTranslation();
	const form = useForm({ mode: "onChange" });
	const { amount, smartbridge } = form.watch();

	const { qrCodeData } = useQRCode({
		amount,
		smartbridge: smartbridge?.slice(0, maxLength),
		network,
		address,
	});

	const { uri, image } = qrCodeData || {};

	return (
		<Modal
			size="lg"
			title={t("WALLETS.MODAL_RECEIVE_FUNDS.TITLE")}
			description={t("COMMON.RECEIVE_FUNDS_SUBTITLE")}
			isOpen={isOpen}
			onClose={onClose}
		>
			{name && (
				<div data-testid="ReceiveFunds__info">
					<TransactionDetail
						borderPosition="bottom"
						label={t("COMMON.NAME")}
						extra={<NetworkIcon size="lg" coin={icon} network={network} />}
					>
						{name}
					</TransactionDetail>
				</div>
			)}

			<div data-testid="ReceiveFunds__info">
				<TransactionDetail
					label={t("COMMON.ADDRESS")}
					borderPosition="bottom"
					extra={
						<div className="-space-x-2 whitespace-no-wrap">
							{!name && <NetworkIcon size="lg" coin={icon} network={network} />}
							<Avatar address={address} size="lg" />
						</div>
					}
				>
					<div className="flex items-center space-x-2">
						<Address address={address} maxChars={25} />
						<span className="flex text-theme-primary-300 dark:text-theme-neutral-600">
							<Clipboard data={address}>
								<Icon name="Copy" />
							</Clipboard>
						</span>
					</div>
				</TransactionDetail>
			</div>

			<div>
				{!isFormOpen && (
					<Button
						variant="plain"
						className="w-full mt-8"
						onClick={() => setIsFormOpen(true)}
						data-testid="ReceiveFunds__toggle"
					>
						{t("COMMON.SPECIFY_AMOUNT")}
					</Button>
				)}

				{isFormOpen && (
					<Form context={form} onSubmit={console.log}>
						<ReceiveFundsForm maxLength={maxLength} />
					</Form>
				)}
			</div>

			{smartbridge?.length > maxLength && (
				<div className="mt-8">
					<Alert variant="warning">{t("WALLETS.MODAL_RECEIVE_FUNDS.WARNING", { maxLength })}</Alert>
				</div>
			)}

			<div className="w-64 h-64 mx-auto mt-8">
				{image && (
					<img
						src={image}
						className="w-64 h-64 p-3 border rounded-lg border-theme-neutral-300 dark:border-theme-neutral-800"
						alt={t("COMMON.QR_CODE")}
						data-testid="ReceiveFunds__qrcode"
					/>
				)}
			</div>

			{isFormOpen && (
				<>
					<div className="max-w-sm mx-auto mt-6 text-center text-theme-neutral-600">
						{t("COMMON.QR_CODE_HELP_TEXT")}
					</div>

					<div
						className="flex mt-8 overflow-hidden font-medium border rounded-lg border-theme-neutral-300 dark:border-theme-neutral-800"
						data-testid="ReceiveFundsForm__uri"
					>
						<div className="p-6 bg-theme-neutral-200 dark:bg-theme-neutral-800">
							<span className="text-theme-secondary-text">{t("COMMON.QR_SHORT")}</span>
						</div>

						<div className="flex items-center justify-between w-full pl-6 pr-5 space-x-4 overflow-hidden bg-theme-neutral-100 dark:bg-theme-background">
							<span className="truncate">{uri}</span>
							<span className="flex text-theme-primary-300 dark:text-theme-neutral-600 hover:text-theme-primary-700">
								<Clipboard data={uri}>
									<Icon name="Copy" width={12} height={15} className="p-1" />
								</Clipboard>
							</span>
						</div>
					</div>
				</>
			)}
		</Modal>
	);
};

ReceiveFunds.defaultProps = {
	isOpen: false,
};
