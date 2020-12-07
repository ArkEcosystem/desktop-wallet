import { Image } from "app/components/Image";
import React from "react";

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
			<div className="my-4 mx-auto w-128">
				<Image name="NoResultsBanner" />
			</div>
		</div>
	</div>
);
