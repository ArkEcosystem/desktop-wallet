import { Circle } from "app/components/Circle";
import { Skeleton } from "app/components/Skeleton";
import { TableCell, TableRow } from "app/components/Table";
import { useRandomNumber } from "app/hooks";
import React from "react";

export const NotificationTransactionItemSkeleton = () => {
	const recipientWidth = useRandomNumber(120, 150);
	const amountWidth = useRandomNumber(100, 130);

	return (
		<TableRow
			data-testid="NotificationTransactionItemSkeleton"
			className="border-b border-dotted last:border-b-0 border-theme-secondary-300 dark:border-theme-secondary-800"
		>
			<TableCell variant="start" innerClassName="space-x-3" isCompact>
				<div className="flex items-center -space-x-1">
					<Circle className="leading-none border-transparent" size="sm">
						<Skeleton circle height={32} width={32} />
					</Circle>
					<Circle className="leading-none border-transparent" size="sm">
						<Skeleton circle height={32} width={32} />
					</Circle>
				</div>

				<Skeleton height={16} width={recipientWidth} />
			</TableCell>

			<TableCell variant="end" innerClassName="justify-end" isCompact>
				<span className="flex items-center px-2 space-x-1 h-7 rounded border border-theme-secondary-300 dark:border-theme-secondary-800">
					<Skeleton height={16} width={amountWidth} />
					<Skeleton height={16} width={35} />
				</span>
			</TableCell>
		</TableRow>
	);
};
