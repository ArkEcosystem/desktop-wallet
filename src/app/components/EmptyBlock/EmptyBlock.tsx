import React from "react";
import { Size } from "types";

type EmptyBlockProps = {
	className?: string;
	children?: React.ReactNode;
	size?: Size;
};

export const EmptyBlock = ({ className, children, size }: EmptyBlockProps) => {
	const padding = size === "sm" ? "py-3 px-4" : "p-6";

	return (
		<div
			data-testid="EmptyBlock"
			className={`border border-solid border-theme-secondary-300 dark:border-theme-secondary-800 rounded-lg text-theme-secondary-text ${padding} ${className}`}
		>
			{children && <div>{children}</div>}
		</div>
	);
};

EmptyBlock.defaultProps = {
	size: "md",
	className: "",
};
