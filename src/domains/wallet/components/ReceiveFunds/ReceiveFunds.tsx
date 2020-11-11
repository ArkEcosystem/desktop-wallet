import { Avatar } from "app/components/Avatar";
import { Button } from "app/components/Button";
import { Clipboard } from "app/components/Clipboard";
import { Form } from "app/components/Form";
import { Icon } from "app/components/Icon";
import { Input, InputAddonEnd, InputAddonStart, InputGroup } from "app/components/Input";
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

	const { t } = useTranslation();
	const form = useForm({ mode: "onChange" });
	const { amount, smartbridge } = form.watch();
	const { qrCodeDataUri, qrCodeDataImage } = useQRCode({ amount, smartbridge, network, address });

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
						<div className="-space-x-2">
							{!name && <NetworkIcon size="lg" coin={icon} network={network} />}
							<Avatar address={address} size="lg" />
						</div>
					}
				>
					<div className="flex items-center space-x-3">
						<span>{address}</span>
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
						className="w-full mt-8 mb-2"
						onClick={() => setIsFormOpen(true)}
						data-testid="ReceiveFunds__toggle"
					>
						{t("COMMON.SPECIFY_AMOUNT")}
					</Button>
				)}

				{isFormOpen && (
					<Form context={form} onSubmit={console.log}>
						<ReceiveFundsForm />
					</Form>
				)}
			</div>

			<div className="mt-8">
				{qrCodeDataImage && (
					<img
						src={qrCodeDataImage}
						className="w-64 h-64 mx-auto"
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

					<div className="mt-8" data-testid="ReceiveFundsForm__uri">
						<InputGroup>
							<InputAddonStart className="px-4 m-px border-r border-theme-neutral-500 bg-theme-neutral-200">
								{t("COMMON.QR_SHORT")}
							</InputAddonStart>
							<Input className="truncate pl-18 pr-13" disabled value={qrCodeDataUri} />
							<InputAddonEnd className="px-4 m-px border-r border-theme-neutral-500">
								<span className="flex text-theme-primary-300 dark:text-theme-neutral-600">
									<Clipboard data={qrCodeDataUri}>
										<Icon name="Copy" />
									</Clipboard>
								</span>
							</InputAddonEnd>
						</InputGroup>
					</div>
				</>
			)}
		</Modal>
	);
};

ReceiveFunds.defaultProps = {
	isOpen: false,
};
