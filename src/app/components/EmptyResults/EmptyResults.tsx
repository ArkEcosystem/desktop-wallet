import { images } from "app/assets/images";
import React from "react";
const { NoResultsBanner } = images.common;

type EmptyResultsProps = {
	className?: string;
	title?: string;
	subtitle?: string;
};

export const EmptyResults = ({ className, title, subtitle }: EmptyResultsProps) => (
	<div
		className={`flex flex-col justify-center h-full text-center bg-theme-background ${className}`}
		data-testid="EmptyResults"
	>
		<div>
			{title && <div className="mb-4 text-lg font-bold">{title}</div>}
			{subtitle && <div className="mb-8 text-md">{subtitle}</div>}
			<div className="mx-auto my-4 w-128">
				<NoResultsBanner />
			</div>
		</div>
	</div>
);
