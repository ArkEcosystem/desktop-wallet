import React from "react";
import { useTranslation } from "react-i18next";
// UI Elements
import { Modal } from "app/components/Modal";
import { Badge } from "app/components/Badge";
import { Button } from "app/components/Button";
import { Circle } from "app/components/Circle";
import { Icon } from "app/components/Icon";
import { Label } from "app/components/Label";
import { TransactionDetail } from "app/components/TransactionDetail";

type MultiSignatureDetailProps = {
	isOpen: boolean;
	onClose?: any;
	onCancel?: any;
	onDelete: any;
};

export const MultiSignatureDetail = (props: MultiSignatureDetailProps) => {
	const { t } = useTranslation();

	return (
		<Modal title={t("TRANSACTION.MODAL_MULTISIGNATURE_DETAIL.TITLE")} isOpen={props.isOpen} onClose={props.onClose}>
			<TransactionDetail label={t("TRANSACTION.SENDER")} extra={<Circle avatarId="test"></Circle>} border={false}>
				<div className="mt-2 font-semibold">ADDRESS</div>
			</TransactionDetail>

			<TransactionDetail label={t("TRANSACTION.RECIPIENT")} extra={<Circle avatarId="test"></Circle>}>
				Bank
				<span className="ml-2 text-theme-neutral-500">ADDR...ESSS</span>
			</TransactionDetail>

			<TransactionDetail
				label={t("TRANSACTION.AMOUNT")}
				extra={
					<Circle className="-mr-2 border-theme-danger-100 text-theme-danger-400">
						<Icon name="Sent" width={40} height={40} />
					</Circle>
				}
			>
				<Label color="danger">2,088.84557 ARK</Label>

				<span className="ml-2 text-theme-neutral-500">23,000.00 USD</span>
			</TransactionDetail>

			<TransactionDetail label={t("TRANSACTION.TRANSACTION_FEE")}>0.09812015 ARK</TransactionDetail>

			<TransactionDetail label={t("TRANSACTION.SMARTBRIDGE")}>
				<div className="flex justify-between">
					Hello!
					<Icon name="Smartbridge" width={20} height={20} />
				</div>
			</TransactionDetail>

			<TransactionDetail label={t("TRANSACTION.TIMESTAMP")}>14.04.2020 21:42:40</TransactionDetail>

			<TransactionDetail label={t("TRANSACTION.CONFIRMATIONS")} className="pb-0">
				{t("TRANSACTION.MODAL_MULTISIGNATURE_DETAIL.WAITING_FOR_SIGNATURES")}
			</TransactionDetail>

			<div className="px-16 pt-8 mt-2 mt-8 -mx-16 text-black border-t border-gray-500">
				<h2 className="mb-0">{t("TRANSACTION.SIGNATURES")}</h2>

				<div className="flex">
					<div>
						<div className="mb-2 text-sm font-semibold text-theme-neutral-500">{t("COMMON.YOU")}</div>

						<div className="pr-4 mr-2 border-r border-theme-neutral-300">
							<Circle avatarId="test" className="relative ml-2">
								<Badge
									className="bottom-0 -right-1 bg-theme-success-200 text-theme-success-500"
									icon="Checkmark"
								/>
							</Circle>
						</div>
					</div>

					<div>
						<div className="mb-2 ml-2 text-sm font-semibold text-theme-neutral-500">
							{t("COMMON.OTHER")}
						</div>

						<Circle avatarId="test" className="relative ml-2">
							<Badge
								className="bottom-0 -right-1 bg-theme-danger-100 text-theme-danger-400"
								icon="StatusClock"
							/>
						</Circle>

						<Circle avatarId="test" className="relative ml-4">
							<Badge
								className="bottom-0 -right-1 bg-theme-danger-100 text-theme-danger-400"
								icon="StatusClock"
							/>
						</Circle>

						<Circle avatarId="test" className="relative ml-4">
							<Badge
								className="bottom-0 -right-1 bg-theme-success-200 text-theme-success-500"
								icon="Checkmark"
							/>
						</Circle>

						<Circle avatarId="test" className="relative ml-4">
							<Badge
								className="bottom-0 -right-1 bg-theme-danger-100 text-theme-danger-400"
								icon="StatusClock"
							/>
						</Circle>
					</div>
				</div>
			</div>

			<div className="flex justify-end mt-8">
				<Button color="primary" variant="plain" onClick={props.onCancel} className="mr-2">
					{t("COMMON.CANCEL")}
				</Button>

				<Button
					type="submit"
					color="primary"
					variant="solid"
					onClick={props.onDelete}
					className="flex items-center"
				>
					{t("TRANSACTION.SIGN")}
				</Button>
			</div>
		</Modal>
	);
};

MultiSignatureDetail.defaultProps = {
	isOpen: false,
};

MultiSignatureDetail.displayName = "MultiSignatureDetail";
