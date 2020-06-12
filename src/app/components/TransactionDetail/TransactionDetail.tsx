import React from "react";

type TransactionDetailProps = {
	children: React.ReactNode;
	label: string;
	extra?: React.ReactNode;
	border?: boolean;
	padding?: boolean;
	className?: string;
};

export const TransactionDetail = (props: TransactionDetailProps) => (
	<div
		className={`flex items-center ${!props.padding || "py-4"} ${
			!props.border || "border-t border-dashed border-theme-neutral-300"
		} ${props.className}`}
	>
		<div className="flex-1">
			<div className="text-sm font-semibold text-theme-neutral-500">{props.label}</div>

			<div className="mt-2 font-semibold">{props.children}</div>
		</div>

		{props.extra ? props.extra : null}
	</div>
);

TransactionDetail.defaultProps = {
	className: "",
	border: true,
	padding: true,
};
