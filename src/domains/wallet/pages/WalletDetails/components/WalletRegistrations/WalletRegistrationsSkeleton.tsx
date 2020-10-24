import { Circle } from "app/components/Circle";
import { Skeleton } from "app/components/Skeleton";
import React from "react";

export const WalletRegistrationsSkeleton = () => (
	<div data-testid="WalletRegistrations__skeleton" className="flex items-center">
		<div className="flex items-center -space-x-2 mr-4">
			<Circle className="border-transparent" size="lg">
				<Skeleton circle height={44} width={44} />
			</Circle>
			<Circle className="border-transparent" size="lg">
				<Skeleton circle height={44} width={44} />
			</Circle>
		</div>

		<div className="flex flex-col h-10 justify-between">
			<Skeleton height={14} width={150} />
			<Skeleton height={16} width={100} />
		</div>

		<div className="ml-auto">
			<Skeleton height={48} width={100} />
		</div>
	</div>
);
