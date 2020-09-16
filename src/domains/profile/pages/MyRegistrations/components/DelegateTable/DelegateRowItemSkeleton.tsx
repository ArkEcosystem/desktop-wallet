import { Circle } from "app/components/Circle";
import React from "react";
import Skeleton from "react-loading-skeleton";

export const DelegateRowItemSkeleton = () => (
	<tr
		data-testid="DelegateRowItemSkeleton"
		className="border-b border-dashed last:border-b-0 border-theme-neutral-light"
	>
		<td className="w-24 py-6 pr-4">
			<div className="flex items-center">
				<Circle className="border-theme-neutral-300" size="lg" />
				<Circle className="border-theme-neutral-300" size="lg" />
			</div>
		</td>
		<td className="font-semibold">
			<Skeleton height={6} width="60%" className="mt-4" />
		</td>
		<td className="font-semibold text-theme-neutral-dark">
			<Skeleton height={6} width="80%" className="mt-4" />
		</td>
		<td className="font-semibold text-center text-theme-primary">
			<span className="flex justify-center">
				<Skeleton width={24} height={24} />
			</span>
		</td>
		<td className="text-theme-neutral-light">
			<span className="flex justify-center">
				<Skeleton width={24} height={24} />
			</span>
		</td>
		<td className="font-semibold text-theme-neutral-dark">
			<div className="flex items-center justify-end">
				<Skeleton height={6} width={100} className="mt-4" />
			</div>
		</td>
		<td className="font-semibold text-theme-neutral-dark">
			<div className="flex items-center justify-end">
				<Skeleton height={6} width={40} className="mt-4" />
				<Skeleton height={6} width={80} className="mt-4 ml-4" />
			</div>
		</td>
		<td className="align-middle">
			<span className="flex justify-end">
				<Skeleton width={24} height={24} />
			</span>
		</td>
	</tr>
);
