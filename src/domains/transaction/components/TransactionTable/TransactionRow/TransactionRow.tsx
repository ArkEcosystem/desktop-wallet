import { Button } from "app/components/Button";
import { Icon } from "app/components/Icon";
import { Link } from "app/components/Link";
import React from "react";

import { Transaction } from "../TransactionTable.models";
import { TransactionRowAmount } from "./TransactionRowAmount";
import { TransactionRowConfirmation } from "./TransactionRowConfirmation";
import { TransactionRowInfo } from "./TransactionRowInfo";
import { TransactionRowMode } from "./TransactionRowMode";
import { TransactionRowRecipientLabel } from "./TransactionRowRecipientLabel";

type Props = {
	transaction: Transaction;
	currencyRate?: string;
	onSign?: () => void;
	walletName?: string;
};

export const TransactionRow = ({ currencyRate, transaction, onSign, walletName }: Props) => {
	return (
		<tr data-testid="TransactionRow" className="border-b border-dotted border-theme-neutral-300">
			<td className="w-16 py-6">
				<div className="inline-block align-middle">
					<Link data-testid="TransactionRow__ID" to={{ pathname: "" }} tooltip={transaction.id} isExternal />
				</div>
			</td>
			<td className="w-48 py-1 text-sm text-theme-neutral-600">
				<span data-testid="TransactionRow__timestamp">{transaction.timestamp}</span>
			</td>
			<td className="w-32">
				<TransactionRowMode {...transaction} />
			</td>
			<td>
				<TransactionRowRecipientLabel {...transaction} walletName={walletName} />
			</td>
			<td className="text-center">
				<TransactionRowInfo {...transaction} />
			</td>
			<td className="w-16 text-center">
				<TransactionRowConfirmation {...transaction} />
			</td>
			<td className="text-right">
				<TransactionRowAmount {...transaction} />
			</td>
			{transaction.isSignaturePending && (
				<td className="text-right">
					<Button data-testid="TransactionRow__sign" variant="plain" onClick={onSign}>
						<Icon name="Edit" />
						<span>Sign</span>
					</Button>
				</td>
			)}
			{currencyRate && !transaction.isSignaturePending && (
				<td data-testid="TransactionRow__currency" className="text-right">
					<TransactionRowAmount {...transaction} currencyRate={currencyRate} />
				</td>
			)}
		</tr>
	);
};
