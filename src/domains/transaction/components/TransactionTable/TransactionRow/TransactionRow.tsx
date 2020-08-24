import { ExtendedTransactionData } from "@arkecosystem/platform-sdk-profiles";
import { Button } from "app/components/Button";
import { Icon } from "app/components/Icon";
import { Link } from "app/components/Link";
import React from "react";

import { TransactionRowAmount } from "./TransactionRowAmount";
import { TransactionRowConfirmation } from "./TransactionRowConfirmation";
import { TransactionRowInfo } from "./TransactionRowInfo";
import { TransactionRowMode } from "./TransactionRowMode";
import { TransactionRowRecipientLabel } from "./TransactionRowRecipientLabel";
import { TransactionRowSkeleton } from "./TransactionRowSkeleton";

type Props = {
	transaction: ExtendedTransactionData;
	exchangeCurrency?: string;
	isSignaturePending?: boolean;
	onSign?: () => void;
	onClick?: () => void;
	walletName?: string;
	isLoading?: boolean;
	showSign?: boolean;
} & React.HTMLProps<any>;

export const TransactionRow = ({
	exchangeCurrency,
	transaction,
	onSign,
	onClick,
	walletName,
	isSignaturePending,
	isLoading,
	showSign,
	...props
}: Props) => {
	if (isLoading)
		return (
			<TransactionRowSkeleton
				data-testid="TransactionRow__skeleton"
				showCurrency={!!exchangeCurrency && !isSignaturePending}
				showSign={showSign || isSignaturePending}
			/>
		);

	return (
		<tr
			data-testid="TransactionRow"
			className="border-b border-dotted cursor-pointer border-theme-neutral-300 hover:bg-theme-neutral-100"
			{...props}
			onClick={onClick}
		>
			<td className="w-16 py-6">
				<div className="inline-block align-middle">
					<Link
						data-testid="TransactionRow__ID"
						to={{ pathname: transaction.explorerLink() }}
						tooltip={transaction.id()}
						isExternal
					/>
				</div>
			</td>
			<td className="w-48 py-1 text-sm text-theme-neutral-600">
				<span data-testid="TransactionRow__timestamp">
					{transaction.timestamp()!.format("DD MMM YYYY HH:mm:ss")}
				</span>
			</td>
			<td className="w-32 py-2">
				<TransactionRowMode transaction={transaction} />
			</td>
			<td>
				<TransactionRowRecipientLabel transaction={transaction} walletName={walletName} />
			</td>
			<td className="text-center">
				<TransactionRowInfo transaction={transaction} />
			</td>
			<td className="w-16 text-center">
				<TransactionRowConfirmation transaction={transaction} />
			</td>
			<td className="text-right">
				<TransactionRowAmount transaction={transaction} />
			</td>
			{isSignaturePending && (
				<td className="text-right">
					<Button data-testid="TransactionRow__sign" variant="plain" onClick={onSign}>
						<Icon name="Edit" />
						<span>Sign</span>
					</Button>
				</td>
			)}
			{!!exchangeCurrency && !isSignaturePending && (
				<td data-testid="TransactionRow__currency" className="text-right">
					<TransactionRowAmount transaction={transaction} exchangeCurrency={exchangeCurrency} />
				</td>
			)}
		</tr>
	);
};

TransactionRow.defaultProps = {
	isSignaturePending: false,
	isLoading: false,
	showSign: false,
};
