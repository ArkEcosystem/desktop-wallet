import { Contracts } from "@arkecosystem/platform-sdk";
import React from "react";
import Skeleton from "react-loading-skeleton";







type Props = {
	transaction: Contracts.TransactionDataType;
	currencyRate?: string;
	isSignaturePending?: boolean;
	onSign?: () => void;
	walletName?: string;
} & React.HTMLProps<any>;

export const TransactionRow = ({
	currencyRate,
	transaction,
	onSign,
	walletName,
	isSignaturePending,
	...props
}: Props) => (
	<tr data-testid="TransactionRow" className="border-b border-dotted border-theme-neutral-300" {...props}>
		<td className="w-16 py-6">
			{/* <div className="inline-block align-middle"> */}
			<Skeleton />
			{/* <Link data-testid="TransactionRow__ID" to={{ pathname: "" }} tooltip={transaction.id()} isExternal /> */}
			{/* </div> */}
		</td>
		<td className="w-48 py-1 text-sm text-theme-neutral-600">
			<span data-testid="TransactionRow__timestamp">
				<Skeleton />
				{/* {transaction.timestamp()!.format("DD MMM YYYY HH:mm:ss")} */}
			</span>
		</td>
		<td className="w-32">
			{/* <TransactionRowMode transaction={transaction} /> */}
			{/* <Skeleton /> */}
		</td>
		<td>
			{/* <TransactionRowRecipientLabel transaction={transaction} walletName={walletName} /> */}
			<Skeleton />
		</td>
		<td className="text-center">
			{/* <TransactionRowInfo transaction={transaction} /> */}
			<Skeleton />
		</td>
		<td className="w-16 text-center">
			{/* <TransactionRowConfirmation transaction={transaction} /> */}
			<Skeleton />
		</td>
		<td className="text-right">
			{/* <TransactionRowAmount transaction={transaction} /> */}
			<Skeleton />
		</td>
		{isSignaturePending && (
			<td className="text-right">
				{/* <Button data-testid="TransactionRow__sign" variant="plain" onClick={onSign}>
					<Icon name="Edit" />
					<span>Sign</span>
				</Button> */}
				<Skeleton />
			</td>
		)}
		{currencyRate && !isSignaturePending && (
			<td data-testid="TransactionRow__currency" className="text-right">
				{/* <TransactionRowAmount transaction={transaction} currencyRate={currencyRate} /> */}
				<Skeleton />
			</td>
		)}
	</tr>
);

TransactionRow.defaultProps = {
	isSignaturePending: false,
};
