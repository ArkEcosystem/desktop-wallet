import cn from "classnames";
import React from "react";
import { Size } from "types";

type EmptyBlockProperties = {
	className?: string;
	children?: React.ReactNode;
	size?: Size;
} & Omit<React.HTMLProps<any>, "size">;

export const EmptyBlock = ({ className, children, size, ...properties }: EmptyBlockProperties) => {
	const padding = size === "sm" ? "py-3 px-4" : "p-6";

	return (
		<div
			data-testid="EmptyBlock"
			className={cn(
				"border border-solid border-theme-secondary-300 dark:border-theme-secondary-800 rounded-lg text-theme-secondary-text text-center leading-5",
				padding,
				className,
			)}
			{...properties}
		>
			{children && <div>{children}</div>}
		</div>
	);
};

EmptyBlock.defaultProps = {
	className: "",
	size: "md",
};
