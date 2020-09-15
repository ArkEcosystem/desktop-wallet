import { Circle } from "app/components/Circle";
import React from "react";
import Skeleton from "react-loading-skeleton";

export const AddressRowSkeleton = () => (
	<tr className="border-b border-dotted border-theme-neutral-300" data-testid="AddressRowSkeleton">
		<td className="py-5">
			<Circle className="bg-theme-neutral-200 border-theme-neutral-200" />
		</td>

		<td className="py-5">
			<Skeleton width="80%" height={6} className="mt-4" />
		</td>

		<td className="w-20 py-5" />

		<td className="py-5">
			<Skeleton width="40%" height={6} className="mt-4" />
		</td>

		<td className="py-5">
			<Circle className="bg-theme-neutral-200 border-theme-neutral-200" />
		</td>

		<td className="py-5">
			<Skeleton width="80%" height={6} className="mt-4" />
		</td>

		<td className="py-5">
			<Skeleton width="30%" height={6} className="mt-4" />
		</td>

		<td className="py-5">
			<div className="flex justify-center h-full">
				<Skeleton width={24} height={24} />
			</div>
		</td>

		<td className="py-5">
			<div className="flex justify-center h-full">
				<Skeleton width={24} height={6} className="mt-4" />
			</div>
		</td>

		<td className="py-5">
			<div className="text-right">
				<Skeleton width={100} height={40} />
			</div>
		</td>
	</tr>
);
