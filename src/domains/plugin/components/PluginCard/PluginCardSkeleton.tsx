import { Card } from "app/components/Card";
import { Skeleton } from "app/components/Skeleton";
import { useRandomNumber } from "app/hooks";
import React from "react";

export const PluginCardSkeleton = () => {
	const authorWidth = useRandomNumber(70, 130);
	const titleWidth = useRandomNumber(100, 180);

	return (
		<div data-testid="PluginCardSkeleton">
			<Card>
				<div className="flex items-center space-x-4">
					<div className="flex-shrink-0 w-25 h-25 overflow-hidden rounded-xl">
						<Skeleton width={100} height={100} />
					</div>

					<div className="flex flex-col">
						<div className="flex items-center h-5">
							<Skeleton height={14} width={authorWidth} />
						</div>

						<div className="flex items-center h-7 mt-1">
							<Skeleton height={16} width={titleWidth} />
						</div>

						<div className="flex items-center space-x-2 mt-4">
							<Skeleton height={20} width={20} />
							<Skeleton height={14} width={70} />
						</div>
					</div>
				</div>
			</Card>
		</div>
	);
};
