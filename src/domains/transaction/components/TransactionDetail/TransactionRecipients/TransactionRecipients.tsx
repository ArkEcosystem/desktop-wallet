import { BigNumber } from "@arkecosystem/platform-sdk-support";
import { Address } from "app/components/Address";
import { Avatar } from "app/components/Avatar";
import { RecipientList } from "domains/transaction/components/RecipientList";
import React from "react";
import { useTranslation } from "react-i18next";

import { TransactionDetail, TransactionDetailProps } from "../TransactionDetail";

type TransactionRecipientsProps = {
	currency: string;
	recipients: { address: string; alias?: string; amount?: BigNumber }[];
} & TransactionDetailProps;

export const TransactionRecipients = ({ currency, recipients, ...props }: TransactionRecipientsProps) => {
	const { t } = useTranslation();

	if (!recipients.length) {
		return null;
	}

	return recipients.length > 1 ? (
		<TransactionDetail label={t("TRANSACTION.RECIPIENTS_COUNT", { count: recipients.length })} {...props}>
			<div className="-my-2">
				<RecipientList recipients={recipients} assetSymbol={currency} variant="condensed" />
			</div>
		</TransactionDetail>
	) : (
		<TransactionDetail
			label={t("TRANSACTION.RECIPIENT")}
			extra={<Avatar size="lg" address={recipients[0].address} />}
			{...props}
		>
			<Address
				address={recipients[0].address}
				walletName={recipients[0].alias}
				maxChars={!recipients[0].alias ? 0 : undefined}
			/>
		</TransactionDetail>
	);
};
