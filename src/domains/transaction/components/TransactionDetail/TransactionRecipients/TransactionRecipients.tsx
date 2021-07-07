import { Address } from "app/components/Address";
import { Avatar } from "app/components/Avatar";
import { RecipientList } from "domains/transaction/components/RecipientList";
import React from "react";
import { useTranslation } from "react-i18next";

import { TransactionDetail, TransactionDetailProperties } from "../TransactionDetail";

type TransactionRecipientsProperties = {
	currency: string;
	recipients: { address: string; alias?: string; amount?: number }[];
} & TransactionDetailProperties;

export const TransactionRecipients = ({ currency, recipients, ...properties }: TransactionRecipientsProperties) => {
	const { t } = useTranslation();

	if (recipients.length === 0) {
		return null;
	}

	return recipients.length > 1 ? (
		<TransactionDetail
			data-testid="TransactionRecipients"
			label={t("TRANSACTION.RECIPIENTS_COUNT", { count: recipients.length })}
			{...properties}
		>
			<RecipientList recipients={recipients} assetSymbol={currency} variant="condensed" />
		</TransactionDetail>
	) : (
		<TransactionDetail
			data-testid="TransactionRecipients"
			label={t("TRANSACTION.RECIPIENT")}
			extra={<Avatar size="lg" address={recipients[0].address} />}
			{...properties}
		>
			<Address address={recipients[0].address} walletName={recipients[0].alias} />
		</TransactionDetail>
	);
};
