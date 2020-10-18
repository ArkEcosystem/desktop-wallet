import React from "react";

type EmptyBlockProps = {
	className?: string;
	message: string;
};

export const EmptyBlock = ({ className, message }: EmptyBlockProps) => (
	<div
		className={`border border-solid border-theme-neutral-300 dark:border-theme-neutral-800 p-6 rounded-lg text-theme-secondary-text ${className}`}
	>
		{message}
	</div>
);
