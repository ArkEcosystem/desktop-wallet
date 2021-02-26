import { ExtendedTransactionData } from "@arkecosystem/platform-sdk-profiles";
import { Button } from "app/components/Button";
import { Icon } from "app/components/Icon";
import { Link } from "app/components/Link";
import { TableCell, TableRow } from "app/components/Table";
import React from "react";
import { shouldUseDarkColors } from "utils/electron-utils";

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
	showExplorerLink?: boolean;
	showSignColumn?: boolean;
} & React.HTMLProps<any>;

export const TransactionRow = ({
	exchangeCurrency,
	transaction,
	onSign,
	onClick,
	walletName,
	isSignaturePending,
	isLoading,
	showExplorerLink,
	showSignColumn,
	...props
}: Props) => {
	const [shadowColor, setShadowColor] = React.useState<string>("--theme-background-color");

	if (isLoading) {
		return (
			<TransactionRowSkeleton
				data-testid="TransactionRow__skeleton"
				showCurrencyColumn={!!exchangeCurrency && !isSignaturePending}
				showSignColumn={showSignColumn || isSignaturePending}
			/>
		);
	}

	return (
		<TableRow
			onClick={onClick}
			onMouseEnter={() => setShadowColor(shouldUseDarkColors() ? "--theme-black" : "--theme-color-secondary-100")}
			onMouseLeave={() => setShadowColor("")}
			{...props}
		>
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
					{transaction.timestamp()!.format("DD MMM YYYY HH:mm:ss")}
				</span>
			</TableCell>

			<TableCell innerClassName="space-x-4">
				<TransactionRowMode transaction={transaction} circleShadowColor={shadowColor} />
				<TransactionRowRecipientLabel transaction={transaction} walletName={walletName} />
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
};

TransactionRow.defaultProps = {
	isSignaturePending: false,
	isLoading: false,
	showSignColumn: false,
	showExplorerLink: true,
};
