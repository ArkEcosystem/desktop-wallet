import { ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";
import { Address } from "app/components/Address";
import { Avatar } from "app/components/Avatar";
import { Circle } from "app/components/Circle";
import { Icon } from "app/components/Icon";
import React from "react";
import { useTranslation } from "react-i18next";

import { TransactionDetail, TransactionDetailProps } from "../TransactionDetail";

type TransactionSenderProps = {
	address: string;
	wallet?: ReadWriteWallet;
} & TransactionDetailProps;

export const TransactionSender = ({ address, wallet, ...props }: TransactionSenderProps) => {
	const { t } = useTranslation();

	const alias = wallet?.alias() || (wallet?.isDelegate() ? wallet.username() : undefined);
	const isDelegate = wallet?.isDelegate() && !wallet?.isResignedDelegate();

	return (
		<TransactionDetail
			label={t("TRANSACTION.SENDER")}
			extra={
				<div className="flex items-center -space-x-2">
					{isDelegate && (
						<Circle
							className="border-theme-text text-theme-text dark:border-theme-neutral-600 dark:text-theme-neutral-600"
							size="lg"
						>
							<Icon name="Delegate" width={25} height={25} />
						</Circle>
					)}
					<Avatar address={address} size="lg" />
				</div>
			}
			{...props}
		>
			<Address address={address} maxChars={!alias ? 0 : undefined} walletName={alias} />
		</TransactionDetail>
	);
};

TransactionSender.defaultProps = {
	borderPosition: "top",
};
