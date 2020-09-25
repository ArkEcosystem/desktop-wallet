import { Contracts } from "@arkecosystem/platform-sdk";
import { Address } from "app/components/Address";
import { Avatar } from "app/components/Avatar";
import { RecipientList } from "domains/transaction/components/RecipientList";
import React from "react";
import { useTranslation } from "react-i18next";

import { TransactionDetail } from "../TransactionDetail";

type TransactionRecipientsProps = {
	currency: string;
	recipient?: { address: string; alias: string };
	recipients?: Contracts.MultiPaymentRecipient[];
};

export const TransactionRecipients = ({ currency, recipient, recipients }: TransactionRecipientsProps) => {
	const { t } = useTranslation();

	return recipient ? (
		<TransactionDetail label={t("TRANSACTION.RECIPIENT")} extra={<Avatar size="lg" address={recipient.address} />}>
			<Address address={recipient.address} walletName={recipient.alias} />
		</TransactionDetail>
	) : (
		<TransactionDetail label={t("TRANSACTION.RECIPIENTS_COUNT", { count: recipients!.length })}>
			<div className="-my-2">
				<RecipientList recipients={recipients} assetSymbol={currency} variant="condensed" />
			</div>
		</TransactionDetail>
	);
};
