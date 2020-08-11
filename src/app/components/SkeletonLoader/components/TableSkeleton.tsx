import React from "react";
import Skeleton from "react-loading-skeleton";

type Props = {
	rows: number;
	columns: any;
};

export const TableSkeleton = ({ rows, columns }: Props) => (
	<tr className="border-b border-dotted border-theme-neutral-300">
		{columns.map((column, index) => (
			<td key={index} className="py-2 px-4 text-left">
				<Skeleton />
			</td>
		))}
	</tr>
);

/* 
<tr className="border-b border-dotted border-theme-neutral-300">
		<td className="w-4">
			<Skeleton />
		</td>
		<td className="w-24 ml-3">
			<div className="flex flex-row justify-between">
				<div className="w-full mr-1">
					<Skeleton />
				</div>
				<div className="w-full ml-1">
					<Skeleton />
				</div>
			</div>
		</td>
		<td className="w-24 ml-3">
			<Skeleton />
		</td>
		<td className="w-8">
			<Skeleton />
		</td>
		<td className="w-8">
			<Skeleton />
		</td>
		<td className="w-16">
			<Skeleton />
		</td>
		<td className="w-16">
			<Skeleton />
		</td>
	</tr>
    */
