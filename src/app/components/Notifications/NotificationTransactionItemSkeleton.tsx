import { Circle } from "app/components/Circle";
import { TableCell, TableRow } from "app/components/Table";
import React from "react";
import Skeleton from "react-loading-skeleton";

export const NotificationTransactionItemSkeleton = () => (
	<TableRow
		data-testid="NotificationTransactionItemSkeleton"
		className="border-b border-dotted last:border-b-0 border-theme-neutral-300 dark:border-theme-neutral-800"
	>
		<TableCell variant="start" className="w-24">
			<Circle size="sm" className="-mr-1" />
			<Circle size="sm" />
		</TableCell>

		<TableCell>
			<Skeleton height={10} width={120} className="mt-4" />
		</TableCell>
		<TableCell variant="end" innerClassName="justify-end">
			<span>
				<Skeleton height={10} width={30} className="mt-4" />
				<Skeleton height={10} width={30} className="mt-4 ml-2" />
			</span>
		</TableCell>
	</TableRow>
);
