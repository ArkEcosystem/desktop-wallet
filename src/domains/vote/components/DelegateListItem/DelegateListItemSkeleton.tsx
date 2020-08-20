import { Circle } from "app/components/Circle";
import React from "react";
import Skeleton from "react-loading-skeleton";

export const DelegateListItemSkeleton = () => (
	<tr data-testid="DelegateListItemSkeleton" className="border-b border-dotted border-theme-neutral-300">
		<td className="py-5">
			<Circle aria-label="network" className="border-theme-neutral-200" />
		</td>

		<td className="py-5">
			<Skeleton width="80%" height={6} className="mt-4" />
		</td>

		<td className="py-5">
			<Skeleton height={6} width="40%" className="mt-4" />
		</td>

		<td className="py-5 font-bold text-theme-neutral-dark">
			<Skeleton height={6} width="40%" className="mt-4" />
		</td>

		<td className="py-5">
			<Skeleton width={24} height={24} />
		</td>

		<td className="py-5 font-bold text-theme-neutral-dark">
			<Skeleton width="80%" height={6} className="mt-4" />
		</td>

		<td className="py-5 font-bold text-theme-neutral-dark">
			<Skeleton width="80%" height={6} className="mt-4" />
		</td>

		<td className="py-5 font-bold text-theme-neutral-dark">
			<Skeleton width="80%" height={6} className="mt-4" />
		</td>

		<td className="py-5 font-bold text-theme-neutral-dark">
			<Skeleton height={6} width="60%" className="mt-4" />
		</td>

		<td className="py-5">
			<Skeleton width={100} height={40} />
		</td>
	</tr>
);
