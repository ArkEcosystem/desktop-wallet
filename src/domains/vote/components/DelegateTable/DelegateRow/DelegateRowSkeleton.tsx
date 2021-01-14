import { Circle } from "app/components/Circle";
import React from "react";
import Skeleton from "react-loading-skeleton";

export const DelegateRowSkeleton = () => (
	<tr
		data-testid="DelegateRowSkeleton"
		className="border-b border-dotted last:border-b-0 border-theme-secondary-300 dark:border-theme-secondary-800"
	>
		<td className="py-5">
			<Circle className="bg-theme-secondary-200 border-theme-secondary-300 dark:border-theme-secondary-800" />
		</td>

		<td className="py-5">
			<Skeleton width="80%" height={6} className="mt-4" />
		</td>

		<td className="py-5">
			<Skeleton width="30%" height={6} className="mt-4" />
		</td>

		<td className="py-5">
			<Skeleton width="40%" height={6} className="mt-4" />
		</td>

		<td className="py-5">
			<div className="flex justify-center h-full">
				<Skeleton width={24} height={24} />
			</div>
		</td>

		<td className="py-5">
			<Skeleton width="40%" height={6} className="mt-4" />
		</td>

		<td className="py-5">
			<Skeleton width="40%" height={6} className="mt-4" />
		</td>

		<td className="py-5">
			<Skeleton width="40%" height={6} className="mt-4" />
		</td>

		<td className="py-5">
			<Skeleton width="60%" height={6} className="mt-4" />
		</td>

		<td className="py-5">
			<div className="text-right">
				<Skeleton width={100} height={40} />
			</div>
		</td>
	</tr>
);
