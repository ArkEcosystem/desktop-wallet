import { Circle } from "app/components/Circle";
import { TableCell, TableRow } from "app/components/Table";
import React from "react";
import Skeleton from "react-loading-skeleton";

export const WalletListItemSkeleton = () => (
	<TableRow data-testid="WalletListItemSkeleton">
		<TableCell variant="start" innerClassName="space-x-4">
			<div className="-space-x-2">
				<div className="flex items-center mr-2 -space-x-1">
					<Circle className="border-transparent" size="lg">
						<Skeleton circle height={44} width={44} />
					</Circle>
					<Circle className="border-transparent" size="lg">
						<Skeleton circle height={44} width={44} />
					</Circle>
				</div>
			</div>
			<Skeleton height={16} width={260} />
		</TableCell>

		<TableCell innerClassName="justify-center text-sm font-bold text-center align-middle">
			<Skeleton height={16} width={100} />
		</TableCell>

		<TableCell innerClassName="font-semibold justify-end">
			<Skeleton height={16} width={229} />
		</TableCell>

		<TableCell variant="end" innerClassName="justify-end text-theme-secondary-400">
			<Skeleton height={16} width={100} />
		</TableCell>
	</TableRow>
);
