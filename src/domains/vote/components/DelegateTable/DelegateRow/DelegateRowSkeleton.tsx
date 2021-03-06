import { Circle } from "app/components/Circle";
import { TableCell, TableRow } from "app/components/Table";
import { useRandomNumber } from "app/hooks";
import React from "react";
import Skeleton from "react-loading-skeleton";

export const DelegateRowSkeleton = () => {
	const nameWidth = useRandomNumber(120, 150);

	return (
		<TableRow data-testid="DelegateRowSkeleton">
			<TableCell variant="start" innerClassName="space-x-4">
				<Circle className="border-transparent" size="lg">
					<Skeleton className="align-top" circle height={44} width={44} />
				</Circle>

				<Skeleton height={16} width={nameWidth} />
			</TableCell>

			<TableCell className="w-24" innerClassName="justify-center">
				<Skeleton height={16} width={22} />
			</TableCell>

			<TableCell variant="end" className="w-40" innerClassName="justify-end">
				<Skeleton width={100} height={40} />
			</TableCell>
		</TableRow>
	);
};
