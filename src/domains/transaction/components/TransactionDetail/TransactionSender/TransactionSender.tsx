import { Address } from "app/components/Address";
import { Avatar } from "app/components/Avatar";
import { Circle } from "app/components/Circle";
import { Icon } from "app/components/Icon";
import React from "react";
import { useTranslation } from "react-i18next";

import { TransactionDetail } from "../TransactionDetail";

type TransactionSenderProps = {
	address: string;
	alias?: string;
	isDelegate?: boolean;
};

export const TransactionSender = ({ address, alias, isDelegate }: TransactionSenderProps) => {
	const { t } = useTranslation();

	return (
		<TransactionDetail
			label={t("TRANSACTION.SENDER")}
			extra={
				<div className="flex items-center -space-x-2">
					{isDelegate && (
						<Circle className="border-theme-text" size="lg">
							<Icon name="Delegate" width={25} height={25} />
						</Circle>
					)}
					<Avatar address={address} size="lg" />
				</div>
			}
			border={false}
		>
			<Address address={address} maxChars={!alias ? 0 : undefined} walletName={alias} />
		</TransactionDetail>
	);
};
