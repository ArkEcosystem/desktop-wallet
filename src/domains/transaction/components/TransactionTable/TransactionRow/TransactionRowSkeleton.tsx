import { Circle } from "app/components/Circle";
import { Skeleton } from "app/components/Skeleton";
import { TableCell, TableRow } from "app/components/Table";
import { useRandomNumber } from "app/hooks";
import React, { useMemo } from "react";

type Props = {
	showSign?: boolean;
	showCurrency?: boolean | "";
} & React.HTMLProps<any>;

export const TransactionRowSkeleton = ({ showSign, showCurrency, ...props }: Props) => {
	const recipientWidth = useRandomNumber(120, 150);
	const infoIconCount = useRandomNumber(0, 3);
	const amountWidth = useRandomNumber(100, 130);
	const currencyWidth = Math.floor(amountWidth * 0.75);

	const infoIcons = useMemo(
		() =>
			new Array(infoIconCount)
				.fill(undefined)
				.map((_: any, index: number) => <Skeleton key={index} width={16} height={16} />),
		[infoIconCount],
	);

	return (
		<TableRow>
			<TableCell variant="start" noHover>
				<Skeleton width={16} height={16} />
			</TableCell>

			<TableCell noHover>
				<Skeleton height={16} width={150} />
			</TableCell>

			<TableCell noHover>
				<div className="flex items-center mr-4 -space-x-1">
					<Circle className="border-transparent" size="lg">
						<Skeleton circle height={44} width={44} />
					</Circle>
					<Circle className="border-transparent" size="lg">
						<Skeleton circle height={44} width={44} />
					</Circle>
				</div>

				<Skeleton height={16} width={recipientWidth} />
			</TableCell>

			<TableCell innerClassName="justify-center" noHover>
				<span className="flex items-center space-x-2">{infoIcons}</span>
			</TableCell>

			<TableCell innerClassName="justify-center" noHover>
				<Skeleton circle width={22} height={22} />
			</TableCell>

			<TableCell innerClassName="justify-end" noHover>
				<span className="flex items-center px-2 space-x-1 border rounded h-7 border-theme-neutral-300 dark:border-theme-neutral-800">
					<Skeleton height={16} width={amountWidth} />
					<Skeleton height={16} width={35} />
				</span>
			</TableCell>

			{showSign && (
				<TableCell variant="end" innerClassName="justify-end" noHover>
					<Skeleton height={44} width={100} />
				</TableCell>
			)}

			{showCurrency && (
				<TableCell variant="end" innerClassName="justify-end" noHover>
					<span className="flex items-center space-x-1">
						<Skeleton height={16} width={currencyWidth} />
						<Skeleton height={16} width={35} />
					</span>
				</TableCell>
			)}
		</TableRow>
	);
};

TransactionRowSkeleton.defaultProps = {
	showSign: false,
	showCurrency: false,
};
