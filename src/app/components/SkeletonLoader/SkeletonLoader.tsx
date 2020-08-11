import React from "react";
import Skeleton from "react-loading-skeleton";

import * as Skeletons from "./components";

type Props = {
	type?: "table" | "plain" | "custom";
	skeleton?: React.ReactNode;
	rows?: number;
	columns?: number;
	children: React.ReactNode;
	isLoading: boolean;
};

export const SkeletonLoader = ({ type, rows, columns, skeleton, children, isLoading }: Props) => {
	let Loader;

	switch (type) {
		case "table":
			Loader = <Skeletons.TableSkeleton rows={rows} columns={columns} />;
			break;
		case "plain":
			Loader = <Skeleton rows={rows} />;
			break;
		default:
			Loader = skeleton;
			break;
	}

	if (!isLoading) {
		return children;
	}

	return Loader;
};

SkeletonLoader.defaultProps = {
	type: "table",
	isLoading: true,
};
