import { Contracts } from "@arkecosystem/platform-sdk";
import { Address } from "app/components/Address";
import { Avatar } from "app/components/Avatar";
import { RecipientList } from "domains/transaction/components/RecipientList";
import React from "react";
import { useTranslation } from "react-i18next";

import { TransactionDetail } from "../TransactionDetail";

type TransactionRecipientsProps = {
	currency: string;
	recipients: (Contracts.MultiPaymentRecipient & { alias?: string }) | { address: string; alias?: string };
};

export const TransactionRecipients = ({ currency, recipients }: TransactionRecipientsProps) => {
	const { t } = useTranslation();

	if (Array.isArray(recipients)) {
		return (
			<TransactionDetail label={t("TRANSACTION.RECIPIENTS_COUNT", { count: recipients.length })}>
				<div className="-my-2">
					<RecipientList recipients={recipients} assetSymbol={currency} variant="condensed" />
				</div>
			</TransactionDetail>
		);
	}

	return (
		<TransactionDetail label={t("TRANSACTION.RECIPIENT")} extra={<Avatar size="lg" address={recipients.address} />}>
			<Address address={recipients.address} walletName={recipients.alias} />
		</TransactionDetail>
	);
};
