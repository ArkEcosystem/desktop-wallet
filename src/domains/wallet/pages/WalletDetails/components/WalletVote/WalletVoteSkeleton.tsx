import { Circle } from "app/components/Circle";
import { Skeleton } from "app/components/Skeleton";
import React from "react";

export const WalletVoteSkeleton = () => (
	<div data-testid="WalletVote__skeleton" className="flex items-center">
		<div className="flex items-center mr-4 -space-x-2">
			<Circle className="border-transparent" size="lg">
				<Skeleton circle height={44} width={44} />
			</Circle>
			<Circle className="border-transparent" size="lg">
				<Skeleton circle height={44} width={44} />
			</Circle>
		</div>

		<div className="flex flex-col justify-between h-10">
			<Skeleton height={14} width={150} />
			<Skeleton height={16} width={100} />
		</div>

		<div className="ml-auto">
			<Skeleton height={44} width={100} />
		</div>
	</div>
);
