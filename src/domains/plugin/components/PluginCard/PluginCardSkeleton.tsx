import { Card } from "app/components/Card";
import { Skeleton } from "app/components/Skeleton";
import React from "react";

export const PluginCardSkeleton = () => (
	<div data-testid="PluginCardSkeleton">
		<Card className="h-52">
			<div className="flex flex-col h-full items-between">
				<div className="mr-4 mb-4">
					<Skeleton width={76} height={76} />
				</div>

				<div>
					<div className="flex items-center mt-2 mb-4 space-x-2 text-lg font-semibold text-theme-primary-600">
						<Skeleton height={16} width={150} />
					</div>

					<div className="flex space-x-4 text-sm text-theme-secondary-500 dark:text-theme-secondary-700">
						<Skeleton height={12} width={30} />
						<Skeleton height={12} width={89} />
					</div>
				</div>
			</div>
		</Card>
	</div>
);
