import { DTO } from "@arkecosystem/platform-sdk-profiles";
import { Button } from "app/components/Button";
import { Icon } from "app/components/Icon";
import { Link } from "app/components/Link";
import { TableCell, TableRow } from "app/components/Table";
import { useTimeFormat } from "app/hooks/use-time-format";
import cn from "classnames";
import React, { memo } from "react";

import { TransactionRowAmount } from "./TransactionRowAmount";
import { TransactionRowConfirmation } from "./TransactionRowConfirmation";
import { TransactionRowInfo } from "./TransactionRowInfo";
import { TransactionRowMode } from "./TransactionRowMode";
import { TransactionRowRecipientLabel } from "./TransactionRowRecipientLabel";
import { TransactionRowSkeleton } from "./TransactionRowSkeleton";

type Props = {
	transaction: DTO.ExtendedTransactionData;
	exchangeCurrency?: string;
	onSign?: () => void;
	onClick?: () => void;
	walletName?: string;
	isLoading?: boolean;
	showExplorerLink?: boolean;
	showSignColumn?: boolean;
} & React.HTMLProps<any>;

export const TransactionRow = memo(
	({
		className,
		exchangeCurrency,
		transaction,
		onSign,
		onClick,
		walletName,
		isLoading = false,
		showExplorerLink = true,
		showSignColumn = false,
		...props
	}: Props) => {
		const timeFormat = useTimeFormat();

		if (isLoading) {
			return (
				<TransactionRowSkeleton
					data-testid="TransactionRow__skeleton"
					showCurrencyColumn={!!exchangeCurrency}
					showSignColumn={showSignColumn}
				/>
			);
		}

		const isSignaturePending = showSignColumn && transaction.isMultiSignatureRegistration();

		return (
			<TableRow onClick={onClick} className={cn("group", className)} {...props}>
				{showExplorerLink && (
					<TableCell variant="start">
						<Link
							data-testid="TransactionRow__ID"
							to={transaction.explorerLink()}
							tooltip={transaction.id()}
							showExternalIcon={false}
							isExternal
						>
							<Icon name="Id" />
						</Link>
					</TableCell>
				)}

				<TableCell variant={showExplorerLink ? "middle" : "start"} innerClassName="text-theme-secondary-text">
					<span data-testid="TransactionRow__timestamp" className="whitespace-nowrap">
						{transaction.timestamp()!.format(timeFormat)}
					</span>
				</TableCell>

				<TableCell innerClassName="space-x-4">
					<TransactionRowMode transaction={transaction} />
					<div className="w-40 xl:w-full">
						<TransactionRowRecipientLabel transaction={transaction} walletName={walletName} />
					</div>
				</TableCell>

				<TableCell innerClassName="justify-center">
					<TransactionRowInfo transaction={transaction} />
				</TableCell>

				<TableCell className="w-16" innerClassName="justify-center">
					<TransactionRowConfirmation transaction={transaction} />
				</TableCell>

				<TableCell innerClassName="justify-end">
					<TransactionRowAmount transaction={transaction} />
				</TableCell>

				<TableCell variant="end" innerClassName="justify-end">
					{isSignaturePending ? (
						<Button data-testid="TransactionRow__sign" variant="secondary" onClick={onSign}>
							<Icon name="Edit" />
							<span>Sign</span>
						</Button>
					) : (
						exchangeCurrency && (
							<span data-testid="TransactionRow__currency" className="whitespace-nowrap">
								<TransactionRowAmount transaction={transaction} exchangeCurrency={exchangeCurrency} />
							</span>
						)
					)}
				</TableCell>
			</TableRow>
		);
	},
);

TransactionRow.displayName = "TransactionRow";
