import React from "react";

type EmptyBlockProps = {
	className?: string;
	children?: React.ReactNode;
};

export const EmptyBlock = ({ className, children }: EmptyBlockProps) => (
	<div
		data-testid="EmptyBlock"
		className={`border border-solid border-theme-secondary-300 dark:border-theme-secondary-800 p-6 rounded-lg text-theme-secondary-text ${className}`}
	>
		{children && <div>{children}</div>}
	</div>
);
