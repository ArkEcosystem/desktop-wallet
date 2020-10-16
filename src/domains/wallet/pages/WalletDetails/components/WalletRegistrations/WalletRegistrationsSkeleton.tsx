import { Circle } from "app/components/Circle";
import React from "react";
import Skeleton from "react-loading-skeleton";

export const WalletRegistrationsSkeleton = () => (
	<div data-testid="WalletRegistrations__skeleton" className="flex items-center pr-8 space-x-4">
		<div className="flex items-center -space-x-2">
			<Circle size="lg" className="text-theme-neutral-light" />
			<Circle size="lg" className="bg-theme-background" />
		</div>
		<div className="flex flex-col">
			<span className="text-sm font-semibold text-theme-neutral">
				<Skeleton height={6} width={120} />
			</span>
			<span className="font-semibold text-theme-text">
				<Skeleton height={6} width={120} />
				<a href="/#" className="px-2 text-theme-primary">
					<Skeleton height={6} width={60} />
				</a>
			</span>
		</div>
	</div>
);
