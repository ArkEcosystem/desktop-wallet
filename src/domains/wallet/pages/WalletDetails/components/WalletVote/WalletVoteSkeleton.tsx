import { Circle } from "app/components/Circle";
import React from "react";
import Skeleton from "react-loading-skeleton";

export const WalletVoteSkeleton = () => (
	<div data-testid="WalletVote__skeleton" className="flex items-center pr-8 space-x-4">
		<div className="flex items-center -space-x-2">
			<Circle size="lg" className="text-theme-neutral-light" />
			<Circle size="lg" className="bg-theme-background" />
		</div>
		<div className="flex flex-col w-full">
			<span className="text-sm font-semibold text-theme-neutral">
				<Skeleton height={6} width={120} />
			</span>
			<div className="w-full font-semibold text-theme-text">
				<Skeleton height={6} width="50%" />
				<Skeleton height={6} width="10%" className="ml-4" />
			</div>
		</div>
	</div>
);
