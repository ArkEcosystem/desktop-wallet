import React, { CSSProperties, ReactNode } from "react";
import SkeletonReact from "react-loading-skeleton";

type SkeletonProps = {
	count?: number;
	duration?: number;
	width?: string | number;
	wrapper?: ReactNode;
	height?: string | number;
	circle?: boolean;
	style?: CSSProperties;
	className?: string;
};

export const Skeleton = (props: SkeletonProps) => (
	<SkeletonReact
		wrapper={({ children }: { children: ReactNode }) => (
			<span className="flex items-center leading-none">{children}</span>
		)}
		{...props}
	/>
);
