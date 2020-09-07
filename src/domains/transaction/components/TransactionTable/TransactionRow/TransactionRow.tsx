import { ExtendedTransactionData } from "@arkecosystem/platform-sdk-profiles";
import { Button } from "app/components/Button";
import { Icon } from "app/components/Icon";
import { Link } from "app/components/Link";
import { TableCell } from "app/components/Table";
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
	showExplorerLink?: boolean;
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
	showExplorerLink,
	showSign,
	...props
}: Props) => {
	const [shadowColor, setShadowColor] = React.useState<string>("--theme-background-color");

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
			className="border-b border-dashed border-theme-neutral-200 group transition-colors duration-100"
			{...props}
			onClick={onClick}
			onMouseEnter={() => setShadowColor("--theme-color-neutral-100")}
			onMouseLeave={() => setShadowColor("")}
		>
			{showExplorerLink && (
				<TableCell variant="start">
					<Link
						data-testid="TransactionRow__ID"
						to={transaction.explorerLink()}
						tooltip={transaction.id()}
						isExternal
					/>
				</TableCell>
			)}

			<TableCell
				variant={showExplorerLink ? "middle" : "start"}
				cellWidth="w-48"
				className="text-sm text-theme-neutral-600"
			>
				<span data-testid="TransactionRow__timestamp">
					{transaction.timestamp()!.format("DD MMM YYYY HH:mm:ss")}
				</span>
			</TableCell>

			<TableCell cellWidth="w-32">
				<TransactionRowMode transaction={transaction} circleShadowColor={shadowColor} />
			</TableCell>

			<TableCell>
				<TransactionRowRecipientLabel transaction={transaction} walletName={walletName} />
			</TableCell>

			<TableCell className="justify-center">
				<TransactionRowInfo transaction={transaction} />
			</TableCell>

			<TableCell cellWidth="w-16" className="justify-center">
				<TransactionRowConfirmation transaction={transaction} />
			</TableCell>

			<TableCell className="justify-end">
				<TransactionRowAmount transaction={transaction} />
			</TableCell>

			{isSignaturePending && (
				<TableCell className="justify-end">
					<Button data-testid="TransactionRow__sign" variant="plain" onClick={onSign}>
						<Icon name="Edit" />
						<span>Sign</span>
					</Button>
				</TableCell>
			)}

			{!!exchangeCurrency && !isSignaturePending && (
				<TableCell variant="end" className="justify-end">
					<span data-testid="TransactionRow__currency">
						<TransactionRowAmount transaction={transaction} exchangeCurrency={exchangeCurrency} />
					</span>
				</TableCell>
			)}
		</tr>
	);
};

TransactionRow.defaultProps = {
	isSignaturePending: false,
	isLoading: false,
	showSign: false,
	showExplorerLink: true,
};
