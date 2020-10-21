import { Circle } from "app/components/Circle";
import { TableCell, TableRow } from "app/components/Table";
import React from "react";
import Skeleton from "react-loading-skeleton";

export const NotificationTransactionItemSkeleton = () => (
	<TableRow
		data-testid="NotificationTransactionItemSkeleton"
		className="border-b border-dotted last:border-b-0 border-theme-neutral-300 dark:border-theme-neutral-800"
	>
		<TableCell variant="start" innerClassName="space-x-3" isCompact>
			<div className="flex items-center -space-x-1">
				<Circle size="sm" className="leading-none">
					<Skeleton circle height={32} width={32} />
				</Circle>
				<Circle size="sm" className="leading-none">
					<Skeleton circle height={32} width={32} />
				</Circle>
			</div>
			<Skeleton height={10} width={150} className="mt-3" />
		</TableCell>

		<TableCell variant="end" innerClassName="justify-end" isCompact>
			<Skeleton height={10} width={90} className="mt-3" />
		</TableCell>
	</TableRow>
);
