import cn from "classnames";
import React from "react";
import { Size } from "types";

type EmptyBlockProps = {
	className?: string;
	children?: React.ReactNode;
	size?: Size;
} & Omit<React.HTMLProps<any>, "size">;

export const EmptyBlock = ({ className, children, size, ...props }: EmptyBlockProps) => {
	const padding = size === "sm" ? "py-3 px-4" : "p-6";

	return (
		<div
			data-testid="EmptyBlock"
			className={cn(
				"border border-solid border-theme-secondary-300 dark:border-theme-secondary-800 rounded-lg text-theme-secondary-text",
				padding,
				className,
			)}
			{...props}
		>
			{children && <div>{children}</div>}
		</div>
	);
};

EmptyBlock.defaultProps = {
	size: "md",
	className: "",
};
