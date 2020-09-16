import React from "react";
import Skeleton from "react-loading-skeleton";

type Props = {
	showSign?: boolean;
	showCurrency?: boolean | "";
} & React.HTMLProps<any>;

export const TransactionRowSkeleton = ({ showSign, showCurrency, ...props }: Props) => (
	<tr
		data-testid="TransactionRow"
		className="border-b border-dotted last:border-b-0 border-theme-neutral-300"
		{...props}
	>
		<td className="w-16 py-6">
			<Skeleton width={24} height={24} />
		</td>
		<td className="w-48 py-1 text-sm text-theme-neutral-600">
			<Skeleton height={6} width="80%" className="mt-4" />
		</td>
		<td className="w-32 py-2">
			<span>
				<Skeleton height={6} width="40%" className="mt-4" />
				<Skeleton height={6} width="40%" className="mt-4 ml-2" />
			</span>
		</td>
		<td>
			<Skeleton height={6} width="80%" className="mt-4" />
		</td>
		<td className="text-center">
			<Skeleton height={6} width="60%" className="mt-4" />
		</td>
		<td className="w-16 text-center">
			<Skeleton height={6} width="60%" className="mt-4" />
		</td>
		<td className="text-right">
			<span className="px-2 pt-2 mt-1 border-2 rounded-lg border-theme-neutral-200">
				<Skeleton height={6} width="80%" className="mt-4" />
			</span>
		</td>
		{showSign && (
			<td className="text-right">
				<Skeleton height={6} width="60%" className="mt-4" />
			</td>
		)}
		{showCurrency && (
			<td data-testid="TransactionRow__currency" className="text-right">
				<Skeleton height={6} width="60%" className="mt-4" />
			</td>
		)}
	</tr>
);

TransactionRowSkeleton.defaultProps = {
	showSign: false,
	showCurrency: false,
};
